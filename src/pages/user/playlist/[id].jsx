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
  const [error, setError] = useState(false);
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

        if (user.uid !== data.data.userId) {
          setError(true);
        } else {
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

  if (error) {
    return (
      <>
        <MainLayout>
          <div className="flex flex-col h-[75vh] md:h-[85vh] items-center justify-center text-white font-semibold">
            <div className="w-full flex flex-col justify-center items-center">
              <h1 className="text-9xl font-extrabold text-white tracking-widest">
                403
              </h1>
              <div className="absolute bg-pink-500 text-white px-4 text-sm rotate-[15deg] mr-2 rounded-md">
                Access Forbidden
              </div>
            </div>

            <div className="flex my-4 justify-center text-center text-2xl text-white font-semibold py-2 tracking-wider">
              The Playlist You Are Trying To Access Is Private!
            </div>
            <button
              className="my-4 px-6 py-2 bg-pink-500 rounded-lg text-xl font-medium cursor-pointer hover:shadow-lg hover:shadow-slate-800"
              onClick={() => {
                router.push("/home");
              }}
            >
              Go Home
            </button>
          </div>
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
          {fullPlaylistData && fullTracksData && (
            <PlaylistFromUser playlistId={id} token={token} />
          )}
        </MainLayout>
      </>
    );
  }
}

export default UserPlaylist;
