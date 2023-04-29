import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";

function TrackListForUserPlaylist({ tracks, playlistId, token }) {
  const [resultModal, setResultModal] = useState(false);
  const [resultResponse, setResultResponse] = useState(false);
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
      })
      .catch((error) => {
        console.error(error);
        setResultResponse(error.message);
      });
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
              <span className="mr-5 text-white">{index + 1}</span>
            </Link>
            <Link href={`#_`}>
              <Image
                className="object-cover mr-4"
                src={
                  track.album.images[1].url ||
                  "https://faculty.eng.ufl.edu/fluids/wp-content/uploads/sites/46/2015/11/img-placeholder-270x300.png"
                }
                alt="Track Cover"
                width={70}
                height={70}
              />
            </Link>
            <div className="flex-grow">
              <Link href={`#_`}>
                <h3 className="font-medium text-white truncate">
                  {track.name}
                </h3>
              </Link>
              <p className="text-gray-400 flex flex-wrap">
                {track.artists.map((artist, index) => (
                  <React.Fragment key={artist.id}>
                    <Link href={`/artist/${artist.id}`}>
                      <div className="text-pink-500 hover:underline">
                        {artist.name}
                      </div>
                    </Link>
                    {index !== track.artists.length - 1 && (
                      <span className="text-pink-500">,&nbsp;</span>
                    )}
                  </React.Fragment>
                ))}
              </p>
            </div>
            <Link href={`/album/${track.album.id}`}>
              <div className="text-blue-300 hover:underline mr-28">
                {track.album.name}
              </div>
            </Link>
            <div className="text-gray-400">
              {formatDuration(track.duration_ms)}
            </div>
            <div
              className="text-pink-500 z-10 ml-5 cursor-pointer"
              onClick={() => handleDeleteTrackClick(track.id, token)}
            >
              {/* Delete Track */}
              <MdDelete className="text-2xl" />
            </div>
          </div>
        ))}
      </div>

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
                    window.location.reload();
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

export default TrackListForUserPlaylist;
