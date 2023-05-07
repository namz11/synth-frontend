import Scroller from "@components/scroller/scroller";
import MainLayout from "@components/layouts/main-layout";
import React, { useState, useContext, useEffect, useRef } from "react";
import withAuth from "@components/withAuth";
import axios from "axios";

// #FIREBASEAUTH For authentication and authorisation
import { AuthContext } from "@context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signIn } from "@utils/firebase";

const Home = () => {
  const [recentTracks, setRecentTracks] = useState(null);
  const [mostPlayed, setMostPlayed] = useState(null);
  const [featuredPlaylist, setFeaturedPlaylist] = useState(null);
  const [categoryPlaylists, setCategoryPlaylists] = useState(null);

  // #FIREBASEAUTH For checking if the user is logged in, the session is active and if the seesion is loading
  const [user, loading] = useAuthState(auth);
  const { currentUser } = useContext(AuthContext);
  const [tok, setTok] = useState(null);

  useEffect(() => {
    // #FIREBASEAUTH async function for getting the value of token before making api call and passing the token as the header
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        setTok(token);
        return token;
      }
    };

    // passed the header in this way so the middleware can check if the user is authorised or not
    async function fetchRecentTracks(theToken) {
      const { data } = await axios("/api/tracks/user/recent", {
        headers: {
          Authorization: `Bearer ${theToken}`,
        },
      });
      setRecentTracks(data?.items);
    }
    async function fetchMostPlayed(theToken) {
      const { data } = await axios("/api/tracks/user/most-played", {
        headers: {
          Authorization: `Bearer ${theToken}`,
        },
      });
      setMostPlayed(data?.items);
    }
    async function fetchFeaturedPlaylists(theToken) {
      const { data } = await axios("/api/playlists/featured", {
        headers: {
          Authorization: `Bearer ${theToken}`,
        },
      });
      setFeaturedPlaylist(data);
    }
    async function fetchCategoryPlaylists(theToken) {
      const { data } = await axios("/api/playlists/category", {
        headers: {
          Authorization: `Bearer ${theToken}`,
        },
      });
      setCategoryPlaylists(data);
    }

    // #FIREBASEAUTH If loading is false and user is authenticated,  an array of promises that includes two functions is created.
    if (!loading) {
      if (user) {
        const promises = [logToken()];
        // #FIREBASEAUTH Promise.all is used to execute both promises concurrently and wait until they are both resolved.
        Promise.all(promises).then(([theToken]) => {
          // #FIREBASEAUTH Once the promises are resolved, the fetchFeaturedPlaylists function and the fetchCategoryPlaylists function is called with resolved token as a parameter.
          fetchRecentTracks(theToken);
          fetchMostPlayed(theToken);
          fetchFeaturedPlaylists(theToken);
          fetchCategoryPlaylists(theToken);
        });
      } else {
        // FIREBASEAUTH If user is falsy, the code logs a message "Denied due to unauthorized".
        console.log("Denied due to unauthorized");
      }
    }
  }, [user, loading]);

  return (
    <>
      <MainLayout>
        {mostPlayed && mostPlayed?.length > 0 && (
          <Scroller
            title={"Listen Again"}
            items={mostPlayed || []}
            isTracks={true}
            token={tok}
          />
        )}
        {recentTracks && recentTracks?.length > 0 && (
          <Scroller
            title={"Recently Played"}
            items={recentTracks || []}
            isTracks={true}
            token={tok}
          />
        )}
        {featuredPlaylist && (
          <Scroller
            title={"Featured Playlists"}
            tagline={
              featuredPlaylist?.message || "music that's hot and happening"
            }
            items={featuredPlaylist?.playlists?.items || []}
            isTracks={false}
          />
        )}
        {categoryPlaylists &&
          categoryPlaylists?.length > 0 &&
          categoryPlaylists.map((item) => (
            <Scroller
              key={item.title}
              title={item?.title}
              tagline={item?.message}
              items={item?.playlists?.items || []}
              isTracks={false}
            />
          ))}
      </MainLayout>
    </>
  );
};

export default withAuth(Home);
