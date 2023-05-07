import React, { useContext, useEffect, useState } from "react";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";
import { useRouter } from "next/router";
import PlaylistFromUser from "@components/playlist/playlistFromUser";
import { PlaylistContext } from "@context/PlaylistContext";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";
import Loader from "@components/loader/loader";

function UserPlaylist() {
  const router = useRouter();
  const { id } = router.query;

  const [user, loading] = useAuthState(auth);

  const [loader, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const {
    setFullPlaylistData,
    setFullTracksData,
    fullPlaylistData,
    fullTracksData,
  } = useContext(PlaylistContext);

  useEffect(() => {
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        return token;
      }
    };

    async function fetchPlaylistData(theToken) {
      if (id) {
        const { data } = await axios(`/api/user/playlists/${id}`, {
          headers: {
            Authorization: `Bearer ${theToken}`,
          },
        });

        setFullPlaylistData(data);

        if (data) {
          const trackDataArray = await Promise.all(
            data.data.tracks.map(async (trackId) => {
              const response = await axios(`/api/tracks/${trackId}`, {
                headers: {
                  Authorization: `Bearer ${theToken}`,
                },
              });
              return response.data.data;
            })
          );

          setFullTracksData(trackDataArray);
        }
        setToken(theToken);
        setLoading(false);
      }
    }

    if (!loading) {
      if (user) {
        const promises = [logToken()];
        Promise.all(promises).then(([theToken]) => {
          fetchPlaylistData(theToken);
        });
      } else {
        console.log("Denied due to unauthorized");
      }
    }
  }, [id, user, loading, setFullPlaylistData, setFullTracksData]);

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
          {fullPlaylistData && fullTracksData && (
            <PlaylistFromUser playlistId={id} token={token} />
          )}
        </MainLayout>
      </>
    );
  }
}

export default UserPlaylist;
