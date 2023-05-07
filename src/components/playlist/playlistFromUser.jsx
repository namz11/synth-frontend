// import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import TrackListForPlaylist from "@components/trackList/trackListForUserPlaylist";
import { useRouter } from "next/router";
import axios from "axios";
import { PlayerContext } from "@context/PlayerContext";
import { spotifyApi } from "react-spotify-web-playback";

function PlaylistFromUser({ playlistData, tracksData, playlistId, token }) {
  const router = useRouter();
  const [resultModal, setResultModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [resultResponse, setResultResponse] = useState(false);
  const [nameModal, setNameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [deviceId, setDeviceId] = useContext(PlayerContext);
  const [originalName, setOriginalName] = useState(null);

  useEffect(() => {
    setOriginalName(playlistData.data.name);
  }, [playlistData.data.name]);

  function handleDeletePlaylist() {
    const url = `/api/user/playlists/${playlistId}`;
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setResultResponse(`${response.data.message}`);
      })
      .catch((error) => {
        console.error(error);
        setResultResponse(error.message);
      });
    setDeleteModal(true);
  }

  const openModal = () => {
    setNameModal(true);
  };

  const closeModal = () => {
    setNameModal(false);
  };

  const handleUpdateName = () => {
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
        setNameModal(false);
        setOriginalName(newName);
        if (response.data.success) {
          setResultResponse(`Playlist Name Updated to ${newName}`);
          setResultModal(true);
        }
      })
      .catch((error) => {
        setNameModal(false);
        setNewName(null);
        setResultResponse(error);
        setResultModal(true);
      });
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
              {/* {!tracksData ? (
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
              )} */}
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

      {deleteModal && resultResponse && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl mb-28 rounded-lg sm:p-8">
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
                  setDeleteModal(false);
                  router.push("/user/playlists");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {nameModal && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg mb-28 sm:p-8">
            <div className="text-center">
              <div className="mt-4">
                <label>
                  <input
                    type="text"
                    className="mt-4 p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Playlist Name..."
                    value={newName || originalName}
                    onChange={(e) => setNewName(e.target.value)}
                    aria-label="New Playlist Name Input"
                  />
                </label>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-700 text-base font-medium text-white hover:bg-pink-800 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  closeModal();
                  setNewName(null);
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-700 text-base font-medium text-white hover:bg-pink-800 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleUpdateName}
              >
                Update Name
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PlaylistFromUser;
