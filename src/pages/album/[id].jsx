import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";
import AlbumComponent from "@components/album/album";

// #FIREBASEAUTH For authentication and authorisation
import { AuthContext } from "@context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signIn } from "@utils/firebase";

const Album = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, loading] = useAuthState(auth);

  const [albumData, setAlbumData] = useState(null);
  const [loader, setLoading] = useState(true);
  useEffect(() => {
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        return token;
      }
    };

    async function fetchAlbumData(theToken) {
      if (id) {
        const { data } = await axios(`/api/album/${id}`, {
          headers: {
            Authorization: `Bearer ${theToken}`,
          },
        });
        setAlbumData(data);
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
        <div>Loading</div>
      </>
    );
  } else {
    return (
      <>
        <MainLayout>
          <AlbumComponent albumData={albumData} />
        </MainLayout>
      </>
    );
  }
};

export default Album;
