import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import { RiPlayListAddLine } from "react-icons/ri";
import { BsFillPlayFill } from "react-icons/bs";
import { spotifyApi } from "react-spotify-web-playback";
import { PlayerContext } from "@context/PlayerContext";

function TopTrackForPlaylist({ tracks, token }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState(null);

  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const [resultModal, setResultModal] = useState(false);
  const [resultResponse, setResultResponse] = useState(false);
  const [imagesForTracks, setimagesForTracks] = useState([]);

  const [deviceId, setDeviceId] = useContext(PlayerContext);

  useEffect(() => {
    async function fetchUserPlaylists(token) {
      const { data } = await axios(`/api/user/playlists/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserPlaylists(data);
    }
    fetchUserPlaylists(token);
  }, [token]);

  function formatDuration(duration_ms) {
    const seconds = Math.floor((duration_ms / 1000) % 60);
    const minutes = Math.floor(duration_ms / 1000 / 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function handleAddToPlaylistClick(trackId, images) {
    setimagesForTracks(images);
    setSelectedTrackId(trackId);
    setShowModal(true);
  }

  function handlePlaylistSelect(playlistId) {
    if (selectedTrackId && playlistId) {
      const url = `/api/user/playlists/${playlistId}/tracks`;
      axios
        .put(
          url,
          {
            tracks: [
              {
                id: selectedTrackId,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setResultResponse(response.data.message);
        })
        .catch((error) => {
          console.error(error);
          setResultResponse(error.message);
        });
    }

    setShowModal(false);
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
    await spotifyApi.play(spotifyToken, {
      uris: trackUriList,
      deviceId: deviceId,
    });
  }

  return (
    <>
      {/* <div className="container mx-auto text-white mt-4">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center rounded-md px-4 py-4 hover:bg-gray-800 cursor-pointer"
          >
            <Link href={`#_`}>
              <div className="mr-5 text-white">{index + 1}</div>
            </Link>

            <div className="hidden md:block">
              <Link href={`#_`}>
                <Image
                  className="object-cover mr-4"
                  src={
                    track.track.album.images[1].url ||
                    "https://faculty.eng.ufl.edu/fluids/wp-content/uploads/sites/46/2015/11/img-placeholder-270x300.png"
                  }
                  alt="Track Cover"
                  width={70}
                  height={70}
                />
              </Link>
            </div>

            <div className="flex-grow">
              <Link href={`#_`}>
                <div className="font-medium text-xl text-white text-overflow:text-ellipsis hover:underline max-w-[23ch] lg:max-w-[42ch] md:max-w-[32ch] ">
                  {track.track.name}
                </div>
              </Link>
              <div className="text-gray-400 flex flex-wrap">
                {track.track.artists.map((artist, index) => (
                  <React.Fragment key={artist.id}>
                    <Link href={`/artist/${artist.id}`}>
                      <div className="text-pink-500 text-lg hover:underline">
                        {artist.name}
                      </div>
                    </Link>
                    {index !== track.track.artists.length - 1 && (
                      <span className="text-pink-500">,&nbsp;</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <Link href={`/album/${track.track.album.id}`}>
                <div className="text-blue-300 hover:underline mr-28">
                  {track.track.album.name}
                </div>
              </Link>
            </div>

            <div className="text-gray-400">
              {formatDuration(track.track.duration_ms)}
            </div>
            <div
              className="text-gray-400 ml-5"
              onClick={() => handlePlayerAdd([track.track.uri])}
            >
              Listen to this song!
            </div>
            <div
              className="text-blue-300 z-10 ml-5 cursor-pointer"
              onClick={() =>
                handleAddToPlaylistClick(
                  track.track.id,
                  track.track.album.images
                )
              }
            >
              <RiPlayListAddLine className="text-xl lg:text-2xl" />
            </div>
          </div>
        ))}
      </div> */}

      <div className="container mx-auto text-white mt-4">
        {tracks.map((track, index) => {
          return (
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
                    track.track?.uri
                      ? () => handlePlayerAdd([track.track.uri])
                      : undefined
                  }
                  aria-label="Play Track"
                />
              ) : (
                <span
                  className="mr-5 text-md lg:text-xl text-white"
                  onClick={
                    track.track?.uri
                      ? () => handlePlayerAdd([track.track.uri])
                      : undefined
                  }
                >
                  {index + 1}
                </span>
              )}

              <div className="hidden md:block">
                <Image
                  className="object-cover mr-4 "
                  src={
                    track?.track?.album?.images[1]?.url ||
                    "https://faculty.eng.ufl.edu/fluids/wp-content/uploads/sites/46/2015/11/img-placeholder-270x300.png"
                  }
                  alt="Track Cover"
                  width={70}
                  height={70}
                  onClick={
                    track.track?.uri
                      ? () => handlePlayerAdd([track.track.uri])
                      : undefined
                  }
                />
              </div>

              <div className="flex-grow">
                <div
                  className="font-medium text-xl text-white text-overflow:text-ellipsis hover:underline max-w-[23ch] lg:max-w-[42ch] md:max-w-[32ch]"
                  onClick={
                    track.track?.uri
                      ? () => handlePlayerAdd([track.track.uri])
                      : undefined
                  }
                >
                  {track.track?.name || "Track Unavailable"}
                </div>

                {track?.track?.artists && track?.track?.artists.length > 0 && (
                  <div className="text-gray-400 flex flex-wrap">
                    {track.track.artists.map((artist, index) => (
                      <React.Fragment key={artist.id}>
                        <Link href={`/artist/${artist.id}`}>
                          <div className="text-pink-500 text-lg hover:underline">
                            {artist.name}
                          </div>
                        </Link>
                        {index !== track.track.artists.length - 1 && (
                          <span className="text-pink-500">,&nbsp;</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {track?.track?.album?.id && track?.track?.album?.name && (
                <div className="hidden lg:block">
                  <Link href={`/album/${track.track.album.id}`}>
                    <div className="text-blue-300 z-20 hover:underline mr-28">
                      {track.track.album.name}
                    </div>
                  </Link>
                </div>
              )}

              {track?.track?.duration_ms && (
                <div className="text-gray-400">
                  {formatDuration(track.track.duration_ms)}
                </div>
              )}

              {track?.track?.id && track?.track?.name && (
                <div
                  className="text-blue-300 ml-5 cursor-pointer"
                  onClick={() => handleAddToPlaylistClick(track.track.id)}
                  title="Add to Playlist"
                >
                  <RiPlayListAddLine
                    className="text-xl lg:text-2xl"
                    aria-label="Add To Playlist"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:p-8">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 mx-auto rounded-full bg-pink-100 sm:h-10 sm:w-10">
                <RiPlayListAddLine className="text-2xl text-pink-500" />
              </div>
              <div className="mt-4">
                <div className="text-lg font-medium text-gray-900">
                  Add to Playlist
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">
                    Select a playlist to add this track to:
                  </div>
                  <select
                    className="mt-3 block w-full px-4 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    onChange={(e) => handlePlaylistSelect(e.target.value)}
                  >
                    <option value="">-- Select a playlist --</option>
                    {userPlaylists.items.map((playlist) => (
                      <option key={playlist.id} value={playlist.id}>
                        {playlist.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:w-auto sm:text-sm"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                onClick={() => setResultModal(false)}
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

export default TopTrackForPlaylist;
