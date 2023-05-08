import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "@components/withAuth";
import PlaylistFromAPI from "@components/playlist/playlistFromAPI";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";

// #FIREBASEAUTH For authentication and authorisation
import { AuthContext } from "@context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";
import Loader from "@components/loader/loader";

const Playlist = () => {
  const router = useRouter();
  const { id } = router.query;

  const [playlistData, setPlaylistData] = useState(null);
  const [loader, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, loading] = useAuthState(auth);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        return token;
      }
    };

    async function fetchAlbumData(theToken) {
      if (id) {
        const { data } = await axios(`/api/playlists/${id}`, {
          headers: {
            Authorization: `Bearer ${theToken}`,
          },
        });
        setPlaylistData(data);
        setToken(theToken);
        setLoading(false);
      }
    }

    if (!loading) {
      if (user) {
        const promises = [logToken()];
        // #FIREBASEAUTH Promise.all is used to execute both promises concurrently and wait until they are both resolved.
        Promise.all(promises).then(([theToken]) => {
          // #FIREBASEAUTH Once the promises are resolved, the fetchFeaturedPlaylists function and the fetchCategoryPlaylists function is called with resolved token as a parameter.
          fetchAlbumData(theToken);
        });
      } else {
        // FIREBASEAUTH If user is falsy, the code logs a message "Denied due to unauthorized".
        console.log("Denied due to unauthorized");
      }
    }
  }, [id, user, loading]);

  if (loader) {
    return (
      <>
        <MainLayout>
          <Loader />
        </MainLayout>
      </>
    );
  } else {
    return (
      <>
        <MainLayout>
          <PlaylistFromAPI playlistData={playlistData} token={token} />
        </MainLayout>
      </>
    );
  }
};

export default withAuth(Playlist);
