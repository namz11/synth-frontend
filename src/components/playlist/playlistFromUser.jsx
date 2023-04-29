import Image from "next/image";
import React, { useState } from "react";
import TrackListForPlaylist from "@components/trackList/trackListForUserPlaylist";
import { useRouter } from "next/router";
import axios from "axios";

function PlaylistFromUser({ playlistData, tracksData, playlistId, token }) {
  const router = useRouter();
  const [resultModal, setResultModal] = useState(false);
  const [resultResponse, setResultResponse] = useState(false);
  function handleDeletePlaylist() {
    const url = `/api/user/playlists/${playlistId}`;
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      <div className="mt-8 flex flex-col ">
        <div className="h-1/4 container mx-auto py-8 flex flex-wrap">
          <div className="w-3/10 flex items-center justify-center px-4">
            <div className="shrink-0 w-48 overflow-hidden bg-transparent">
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
                </div>
              )}
            </div>
          </div>
          <div className="w-7/10 pl-4 flex flex-col items-start justify-center text-white text-overflow: ellipsis">
            <p className="text-sm text-blue-300 font-bold mb-2">
              {`playlist`.toUpperCase()}
            </p>
            <p className="text-7xl font-bold mb-2">{playlistData.data.name}</p>
            {playlistData.data.tracks !== [] && playlistData.data.userId && (
              <p className="text-pink-500 mt-4 text-2xl font-regular">
                {playlistData.data.userId.toUpperCase()} &bull;{" "}
                {playlistData.data.tracks.length} Tracks
              </p>
            )}
            <button
              className="cursor-pointer mt-2 text-white py-2 px-4 bg-pink-500 rounded-3xl"
              onClick={() => handleDeletePlaylist()}
            >
              Delete Playlist
            </button>
          </div>
        </div>
        <div className="h-3/4 container mx-auto my-8">
          <div className="text-3xl text-white font-semibold">Tracks</div>
          <TrackListForPlaylist
            tracks={tracksData}
            playlistId={playlistId}
            token={token}
          />
        </div>
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
                    router.push("/user/playlists");
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

export default PlaylistFromUser;
