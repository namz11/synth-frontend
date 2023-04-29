import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function TrackList({ tracks }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState(null);

  useEffect(() => {
    async function fetchAlbumData() {
      const { data } = await axios(`/api/user/playlists/`);
      setUserPlaylists(data);
    }
    fetchAlbumData();
  });

  function formatDuration(duration_ms) {
    const seconds = Math.floor((duration_ms / 1000) % 60);
    const minutes = Math.floor(duration_ms / 1000 / 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function handleAddToPlaylistClick(trackId) {
    setSelectedTrackId(trackId);
    setShowModal(true);
  }

  function handlePlaylistSelect(playlistId) {
    if (selectedTrackId && playlistId) {
      console.log("Selected Track ID:", selectedTrackId);
      console.log("Selected Playlist ID:", playlistId);
    }

    setShowModal(false);
  }

  return (
    <>
      <div className="container mx-auto text-white mt-4">
        {tracks.items.map((track) => (
          <Link key={track.id} href={`#_`}>
            <div className="flex items-center rounded-md px-4 py-4 hover:bg-gray-800 cursor-pointer">
              <div className="mr-5 text-white">{track.track_number}</div>
              <div className="flex-grow">
                <div className="font-medium text-white truncate">
                  {track.name}
                </div>
                <div className="text-gray-400 flex flex-wrap">
                  {track.artists.map((artist, index) => (
                    <React.Fragment key={artist.id}>
                      <Link href={`/artist/${artist.id}`}>
                        <p className="text-pink-500 hover:underline">
                          {artist.name}
                        </p>
                      </Link>
                      {index !== track.artists.length - 1 && (
                        <span className="text-pink-500">,&nbsp;</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="text-gray-400">
                {formatDuration(track.duration_ms)}
              </div>
              <div
                className="text-blue-300 z-10 ml-5 cursor-pointer"
                onClick={() => handleAddToPlaylistClick(track.id)}
              >
                Add to Playlist
              </div>
            </div>
          </Link>
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle           sm:w-full sm:max-w-md">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TrackList;
