import Scroller from "@components/scroller/scroller";
import MainLayout from "@components/layouts/main-layout";
import React, { useEffect, useState, useContext } from "react";
import withAuth from "@components/withAuth";
import axios from "axios";

// #FIREBASEAUTH For authentication and authorisation
import { AuthContext } from "@context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signIn } from "@utils/firebase";

const Home = () => {
  const [featuredPlaylist, setFeaturedPlaylist] = useState(null);
  const [categoryPlaylists, setCategoryPlaylists] = useState(null);

  // #FIREBASEAUTH For checking if the user is logged in, the session is active and if the seesion is loading
  const [user, loading] = useAuthState(auth);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    // #FIREBASEAUTH async function for getting the value of token before making api call and passing the token as the header
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        return token;
      }
    };

    // passed the header in this way so the middleware can check if the user is authorised or not
    async function fetchFeaturedPlaylists(theToken) {
      const { data } = await axios("/api/playlists/featured", {
        headers: {
          Authorization: `Bearer ${theToken}`,
        },
      });
      console.log("featured", data);
      setFeaturedPlaylist(data);
    }
    async function fetchCategoryPlaylists(theToken) {
      const { data } = await axios("/api/playlists/category", {
        headers: {
          Authorization: `Bearer ${theToken}`,
        },
      });
      console.log("category", data);
      setCategoryPlaylists(data);
    }

    // #FIREBASEAUTH If loading is false and user is authenticated,  an array of promises that includes two functions is created.
    if (!loading) {
      if (user) {
        const promises = [logToken()];
        // #FIREBASEAUTH Promise.all is used to execute both promises concurrently and wait until they are both resolved.
        Promise.all(promises).then(([theToken]) => {
          // #FIREBASEAUTH Once the promises are resolved, the fetchFeaturedPlaylists function and the fetchCategoryPlaylists function is called with resolved token as a parameter.
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
        {featuredPlaylist && (
          <Scroller
            title={"Featured Playlists"}
            tagline={
              featuredPlaylist?.message || "music that's hot and happening"
            }
            playlists={featuredPlaylist?.playlists?.items || []}
          />
        )}
        {categoryPlaylists &&
          categoryPlaylists?.length > 0 &&
          categoryPlaylists.map((item) => (
            <Scroller
              key={item.title}
              title={item?.title}
              tagline={item?.message}
              playlists={item?.playlists?.items || []}
            />
          ))}
      </MainLayout>
    </>
  );
};

export default withAuth(Home);
