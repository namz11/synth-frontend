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
import Error404 from "@components/error/error404";

const Playlist = () => {
  const router = useRouter();
  const { id } = router.query;

  const [playlistData, setPlaylistData] = useState(null);
  const [loader, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [user, loading] = useAuthState(auth);
  const [error404, setError404] = useState(false);

  useEffect(() => {
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        return token;
      }
    };

    async function fetchAlbumData(theToken) {
      try {
        if (id && /^[0-9a-zA-Z]+$/.test(id.trim()) && id.trim().length === 22) {
          const { data } = await axios(`/api/playlists/${id}`, {
            headers: {
              Authorization: `Bearer ${theToken}`,
            },
          });
          setPlaylistData(data);
          setToken(theToken);
          setLoading(false);
        } else {
          setError404(true);
          setLoading(false);
        }
      } catch (error) {
        setError404(true);
        setLoading(false);
      }
    }

    if (!loading) {
      if (user) {
        const promises = [logToken()];
        Promise.all(promises).then(([theToken]) => {
          fetchAlbumData(theToken);
        });
      } else {
        console.log("Denied due to unauthorized");
      }
    }
  }, [id, user, loading]);

  if (error404) {
    return (
      <>
        <MainLayout>
          <Error404 />
        </MainLayout>
      </>
    );
  }

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
