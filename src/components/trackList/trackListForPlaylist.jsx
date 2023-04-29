import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RiPlayListAddLine } from "react-icons/ri";

function TopTrackForPlaylist({ tracks, token }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState(null);

  const [resultModal, setResultModal] = useState(false);
  const [resultResponse, setResultResponse] = useState(false);

  useEffect(() => {
    async function fetchAlbumData(token) {
      const { data } = await axios(`/api/user/playlists/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserPlaylists(data);
    }
    fetchAlbumData(token);
  }, [token]);

  function formatDuration(duration_ms) {
    const seconds = Math.floor((duration_ms / 1000) % 60);
    const minutes = Math.floor(duration_ms / 1000 / 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function handleAddToPlaylistClick(trackId) {
    setSelectedTrackId(trackId);
    setShowModal(true);
  }

  function handlePlaylistSelect(playlistId, trackImages) {
    if (selectedTrackId && playlistId) {
      const url = `/api/user/playlists/${playlistId}/tracks`;
      axios
        .put(
          url,
          {
            tracks: [
              {
                id: selectedTrackId,
                images: trackImages,
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
          // Navigate
          // console.log(response.data);
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

  return (
    <>
      <div className="container mx-auto text-white mt-4">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center rounded-md px-4 py-4 hover:bg-gray-800 cursor-pointer"
          >
            <Link href={`#_`}>
              <div className="mr-5 text-white">{index + 1}</div>
            </Link>
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
            <div className="flex-grow ">
              <Link href={`#_`}>
                <div className="font-medium text-xl text-white truncate hover:underline">
                  {track.track.name}
                </div>
              </Link>
              <p className="text-gray-400 flex flex-wrap">
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
              </p>
            </div>
            <Link href={`/album/${track.track.album.id}`}>
              <div className="text-blue-300 hover:underline mr-28">
                {track.track.album.name}
              </div>
            </Link>
            <div className="text-gray-400">
              {formatDuration(track.track.duration_ms)}
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
              <RiPlayListAddLine className="text-2xl" />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-md">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 sm:mx-0 sm:h-10 sm:w-10">
                    <RiPlayListAddLine className="text-2xl text-pink-500" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Add to Playlist
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">
                        Select a playlist to add this track to:
                      </div>

                      <select
                        className="mt-3 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
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
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {resultModal && resultResponse && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-md">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      {`Track ${resultResponse}`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setResultModal(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TopTrackForPlaylist;
