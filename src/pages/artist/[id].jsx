import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";
import ArtistComponent from "@components/artist/artist";

// #FIREBASEAUTH For authentication and authorisation
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";
import Loader from "@components/loader/loader";
import Error404 from "@components/error/error404";

const Artist = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, loading] = useAuthState(auth);

  const [artistData, setArtistData] = useState(null);
  const [artistTopTracksData, setArtistTopTracksData] = useState(null);
  const [token, setToken] = useState(null);
  const [error404, setError404] = useState(false);

  const [loader, setLoading] = useState(true);
  useEffect(() => {
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        return token;
      }
    };

    async function fetchArtistData(theToken) {
      try {
        if (id && /^[0-9a-zA-Z]+$/.test(id.trim()) && id.trim().length === 22) {
          const { data } = await axios(`/api/artist/${id}`, {
            headers: {
              Authorization: `Bearer ${theToken}`,
            },
          });
          setArtistData(data);

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
          fetchArtistData(theToken);
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
          {/* <div className="text-white text-4xl">Error 404</div> */}
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
