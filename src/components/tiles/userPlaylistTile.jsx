import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toString } from "lodash-es";

import { AuthContext } from "@context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signIn } from "@utils/firebase";
import axios from "axios";

const PlaylistTile = ({ data }) => {
  const [user, loading] = useAuthState(auth);
  const [tracksData, setTracksData] = useState(null);
  const [loader, setLoading] = useState(true);

  useEffect(() => {
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        return token;
      }
    };

    async function fetchPlaylistData(theToken) {
      if (data) {
        const trackDataArray = await Promise.all(
          data?.tracks?.map(async (trackId) => {
            const response = await axios(`/api/tracks/${trackId}`, {
              headers: {
                Authorization: `Bearer ${theToken}`,
              },
            });
            return response.data.data;
          })
        );
        setTracksData(trackDataArray);
      }
      setLoading(false);
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
  }, [user, loading, data]);

  if (loader) {
    return (
      <>
        <span></span>
      </>
    );
  } else {
    if (data) {
      return (
        <>
          <Link href={`/user/playlist/${data?.id}`}>
            <div className="shrink-0 w-48 overflow-hidden bg-transparent">
              <div className="flex flex-row flex-wrap justify-start content-start">
                {!tracksData ? (
                  <div className="bg-gray-800 w-full h-48 opacity-70"></div>
                ) : (
                  <div className="flex flex-row flex-wrap justify-start content-start">
                    {tracksData.slice(0, 4).map((track, index) => (
                      <img
                        key={index}
                        className="object-cover w-24 h-24"
                        src={
                          track.album.images[0] ? track.album.images[0].url : ""
                        }
                        alt="playlist image"
                      />
                    ))}
                    {Array.from({
                      length: Math.max(4 - (tracksData.length || 0), 0),
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="object-cover w-24 h-24 bg-gray-800 opacity-70" // Empty box styling
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="py-2">
                <span
                  className="block text-lg text-gray-800 dark:text-gray-100 truncate"
                  tabIndex="0"
                  role="link"
                >
                  {data?.name}
                </span>
                <span className="block text-sm text-gray-700 dark:text-gray-200 truncate">
                  {`${data?.tracks?.length} songs`}
                </span>
              </div>
            </div>
          </Link>
        </>
      );
    }
  }
};

export default PlaylistTile;
