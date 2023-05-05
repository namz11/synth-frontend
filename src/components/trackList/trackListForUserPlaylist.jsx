import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { spotifyApi } from "react-spotify-web-playback";
import { PlayerContext } from "@context/PlayerContext";
import { BsFillPlayFill } from "react-icons/bs";

function TrackListForUserPlaylist({ tracks, playlistId, token }) {
  const [resultModal, setResultModal] = useState(false);
  const [resultResponse, setResultResponse] = useState(false);
  const [currentTracks, setCurrentTracks] = useState(tracks);

  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const [deviceId, setDeviceId] = useContext(PlayerContext);

  function formatDuration(duration_ms) {
    const seconds = Math.floor((duration_ms / 1000) % 60);
    const minutes = Math.floor(duration_ms / 1000 / 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function handleDeleteTrackClick(trackId, token) {
    const url = `/api/user/playlists/${playlistId}/tracks`;
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          tracks: [trackId],
        },
      })
      .then((response) => {
        setResultResponse(response.data.message);
        setCurrentTracks((prevTracks) =>
          prevTracks.filter((track) => track.id !== trackId)
        );
      })
      .catch((error) => {
        console.error(error);
        setResultResponse(error.message);
      });
    setResultModal(true);
  }

  async function handlePlayerAdd(trackUriList) {
    let spotifyToken;
    const getSpotifyToken = async () => {
      spotifyToken = await axios(`/api/token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };
    await getSpotifyToken();
    spotifyToken = spotifyToken.data.token;

    // Get the device id of the spotify player from context.
    console.log(trackUriList);
    await spotifyApi.play(spotifyToken, {
      uris: trackUriList,
      deviceId: deviceId,
    });
  }

  return (
    <>
      <div className="container mx-auto text-white mt-4">
        {currentTracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center rounded-md px-4 py-4 hover:bg-gray-800 cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
          >
            {hoveredIndex === index ? (
              <BsFillPlayFill
                className="mr-2 text-2xl text-white"
                onClick={
                  track?.uri ? () => handlePlayerAdd([track.uri]) : undefined
                }
                aria-label="Play Track"
              />
            ) : (
              <span
                className="mr-5 text-md lg:text-xl text-white"
                onClick={
                  track?.uri ? () => handlePlayerAdd([track.uri]) : undefined
                }
              >
                {index + 1}
              </span>
            )}
            <div className="hidden md:block">
              <Image
                className="object-cover mr-4"
                src={
                  track.album.images[1]?.url ||
                  "https://faculty.eng.ufl.edu/fluids/wp-content/uploads/sites/46/2015/11/img-placeholder-270x300.png"
                }
                alt="Track Cover"
                width={70}
                height={70}
                onClick={
                  track?.uri ? () => handlePlayerAdd([track.uri]) : undefined
                }
              />
            </div>

            <div className="flex-grow">
              <div
                className="font-medium text-xl text-white text-overflow:text-ellipsis hover:underline max-w-[23ch] lg:max-w-[42ch] md:max-w-[32ch] "
                onClick={
                  track?.uri ? () => handlePlayerAdd([track.uri]) : undefined
                }
              >
                {track.name || "Track Unavailable"}
              </div>

              {track.artists && track.artists.length > 0 && (
                <div className="text-gray-400 flex flex-wrap">
                  {track.artists.map((artist, index) => (
                    <React.Fragment key={artist.id}>
                      <Link href={`/artist/${artist.id}`}>
                        <div className="text-pink-500 hover:underline">
                          {artist.name || "Artist Unavailable"}
                        </div>
                      </Link>
                      {index !== track.artists.length - 1 && (
                        <span className="text-pink-500">,&nbsp;</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {track.album.id && track.album.name && (
              <div className="hidden lg:block">
                <Link href={`/album/${track.album.id}`}>
                  <div className="text-blue-300 hover:underline mr-28">
                    {track.album.name}
                  </div>
                </Link>
              </div>
            )}

            <div className="text-gray-400">
              {track.duration_ms ? formatDuration(track.duration_ms) : " "}
            </div>

            <div className="text-pink-500 z-10 ml-5 cursor-pointer">
              {track.id && token && (
                <div
                  className="text-pink-500 z-10 ml-5 cursor-pointer"
                  onClick={() => handleDeleteTrackClick(track.id, token)}
                  title="Remove From Playlist"
                >
                  <MdDelete
                    className="text-xl lg:text-2xl"
                    aria-label="Remove From Playlist"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {resultModal && resultResponse && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:p-8">
            <div className="text-center">
              <div className="mt-4">
                <div className="text-lg font-medium text-gray-900">{`Track ${resultResponse}`}</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 sm:w-auto sm:text-sm"
                onClick={() => {
                  setResultModal(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TrackListForUserPlaylist;
