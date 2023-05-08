import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";
import AlbumComponent from "@components/album/album";

// #FIREBASEAUTH For authentication and authorisation
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";
import Loader from "@components/loader/loader";
import Error404 from "@components/error/error404";

const Album = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, loading] = useAuthState(auth);

  const [albumData, setAlbumData] = useState(null);
  const [loader, setLoading] = useState(true);
  const [token, setToken] = useState(null);
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
          const { data } = await axios(`/api/album/${id}`, {
            headers: {
              Authorization: `Bearer ${theToken}`,
            },
          });
          setAlbumData(data);
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
          <AlbumComponent albumData={albumData} token={token} />
        </MainLayout>
      </>
    );
  }
};

export default Album;
