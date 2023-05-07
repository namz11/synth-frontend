import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";
import ArtistComponent from "@components/artist/artist";

// #FIREBASEAUTH For authentication and authorisation
import { AuthContext } from "@context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signIn } from "@utils/firebase";
import Loader from "@components/loader/loader";

const Artist = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, loading] = useAuthState(auth);

  const [artistData, setArtistData] = useState(null);
  const [artistTopTracksData, setArtistTopTracksData] = useState(null);
  const [token, setToken] = useState(null);

  const [loader, setLoading] = useState(true);
  useEffect(() => {
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        return token;
      }
    };

    async function fetchArtistData(theToken) {
      if (id) {
        const { data } = await axios(`/api/artist/${id}`, {
          headers: {
            Authorization: `Bearer ${theToken}`,
          },
        });
        setArtistData(data);
      }
    }
    async function fetchArtistTopTracksData(theToken) {
      if (id) {
        const { data } = await axios(`/api/artist/${id}/top-tracks`, {
          headers: {
            Authorization: `Bearer ${theToken}`,
          },
        });
        setArtistTopTracksData(data);
        setToken(theToken);
        setLoading(false);
      }
    }

    if (!loading) {
      if (user) {
        const promises = [logToken()];
        Promise.all(promises).then(([theToken]) => {
          fetchArtistData(theToken);
          fetchArtistTopTracksData(theToken);
        });
      } else {
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
          <ArtistComponent
            artistData={artistData}
            artistTopTracksData={artistTopTracksData}
            token={token}
          />
        </MainLayout>
      </>
    );
  }
};

export default Artist;
