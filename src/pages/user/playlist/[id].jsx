import React, { useContext, useEffect, useState } from "react";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";
import { useRouter } from "next/router";
import PlaylistFromUser from "@components/playlist/playlistFromUser";
import { PlaylistContext } from "@context/PlaylistContext";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";

function UserPlaylist() {
  const router = useRouter();
  const { id } = router.query;

  const [user, loading] = useAuthState(auth);

  const [playlistData, setPlaylistData] = useState(null);
  const [tracksData, setTracksData] = useState(null);
  const [loader, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const { setFullPlaylistData, setFullTracksData } =
    useContext(PlaylistContext);

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
        setPlaylistData(data);
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
          setTracksData(trackDataArray);
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
        <div>Loading</div>
      </>
    );
  } else {
    return (
      <>
        <MainLayout>
          {playlistData && tracksData && (
            <PlaylistFromUser
              playlistData={playlistData}
              tracksData={tracksData}
              playlistId={id}
              token={token}
            />
          )}
        </MainLayout>
      </>
    );
  }
}

export default UserPlaylist;
