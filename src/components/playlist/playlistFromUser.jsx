// import Image from "next/image";
import React, { useState, useContext } from "react";
import TrackListForPlaylist from "@components/trackList/trackListForUserPlaylist";
import { useRouter } from "next/router";
import axios from "axios";
import { PlayerContext } from "@context/PlayerContext";
import { spotifyApi } from "react-spotify-web-playback";

function PlaylistFromUser({ playlistData, tracksData, playlistId, token }) {
  const router = useRouter();
  const [resultModal, setResultModal] = useState(false);
  const [resultResponse, setResultResponse] = useState(false);
  const [nameModal, setNameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [deviceId, setDeviceId] = useContext(PlayerContext);

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

  const openModal = () => {
    setNameModal(true);
  };

  const closeModal = () => {
    setNameModal(false);
  };

  const handleUpdateName = () => {
    console.log("New name:", newName);
    const url = `/api/user/playlists/${playlistId}`;
    axios
      .put(
        url,
        {
          name: newName,
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
        setResultResponse(error);
      });
    setNameModal(false);
  };

  // Play the track list on spotify player.
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
      <div className="mt-2 lg:mt-6 flex flex-col ">
        <div className="h-1/4 container mx-auto py-8 flex flex-wrap">
          <div className="w-3/10 flex items-center justify-center px-10 lg:px-4 mx-auto md:mx-0">
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
            <p className="text-sm text-blue-300 font-bold mb-2 mt-4 lg:mt-0">
              {`playlist`.toUpperCase()}
            </p>
            <p className="text-4xl lg:text-7xl font-bold mb-2">
              {newName || playlistData.data.name}
            </p>
            {playlistData.data.tracks !== [] && playlistData.data.userId && (
              <p className="text-pink-500 text-lg lg:text-2xl font-regular">
                {/* {playlistData.data.userId.toUpperCase()} &bull;{" "} */}
                {playlistData.data.tracks.length === 1 ? (
                  <span>{`${playlistData.data.tracks.length} Track`}</span>
                ) : (
                  <span>{`${playlistData.data.tracks.length} Tracks`}</span>
                )}
              </p>
            )}
            <div className="flex gap-4 mt-2">
              <button
                className="cursor-pointer text-white font-medium text-sm lg:text-md py-1 px-4 lg:py-2 bg-pink-600 rounded-3xl"
                onClick={() => handleDeletePlaylist()}
              >
                Delete Playlist
              </button>
              <button
                className="cursor-pointer text-white font-medium text-sm lg:text-md py-1 px-4 lg:py-2 bg-pink-600 rounded-3xl"
                onClick={() => {
                  openModal();
                }}
              >
                Edit Playlist Name
              </button>
            </div>
          </div>
        </div>
        <div className="h-3/4 container mx-auto mb-8 mt-4">
          <div className="text-3xl text-white font-semibold px-4 lg:px-0">
            Tracks
          </div>
          {/* If playlist length is equal to zero, don't render */}
          {tracksData.length !== 0 && (
            <div
              className="text-2xl text-white font-semibold px-4 lg:px-0 rounded-md py-4 hover:bg-gray-800 cursor-pointer mt-3"
              onClick={() => {
                let trackUriList = [];
                tracksData.forEach((track) => {
                  trackUriList.push(track.uri);
                });
                handlePlayerAdd(trackUriList);
              }}
            >
              Listen Now
            </div>
          )}
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

      {nameModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-md">
              <div
                className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
                aria-label="Edit Playlist Name Popup"
              >
                <div
                  className="sm:flex sm:items-start"
                  aria-label="Edit Playlist Name Popup"
                >
                  <div
                    className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                    aria-label="Edit Playlist Name Popup"
                  >
                    <div
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      <label>
                        <input
                          type="text"
                          className="mt-4 p-2 border border-gray-300 rounded-md w-full"
                          placeholder="Playlist Name..."
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          aria-label="New Playlist Name Input"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleUpdateName}
                >
                  Update Name
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
