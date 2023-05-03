import Image from "next/image";
import React, { useContext } from "react";
import TrackListForPlaylist from "@components/trackList/trackListForPlaylist";
import axios from "axios";
import { spotifyApi } from "react-spotify-web-playback";
import { PlayerContext } from "@context/PlayerContext";

function PlaylistFromAPI({ playlistData, token }) {
  const [deviceId, setDeviceId] = useContext(PlayerContext);

  // Play the full playlist
  async function handlePlayerAdd(contextUri) {
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
      context_uri: contextUri,
      deviceId: deviceId,
    });
  }

  return (
    <>
      <div className="mt-2 lg:mt-6  flex flex-col ">
        <div className="h-1/4 container mx-auto py-8 flex flex-wrap lg:flex-nowrap">
          <div className="w-3/10 flex items-center justify-center px-4">
            <Image
              src={
                playlistData.images[0].url ||
                "https://faculty.eng.ufl.edu/fluids/wp-content/uploads/sites/46/2015/11/img-placeholder-270x300.png"
              }
              alt="Artist Cover"
              width={350}
              height={350}
            />
          </div>
          <div className="w-7/10 pl-4 flex flex-col items-start justify-center text-white text-overflow: ellipsis">
            <p className="text-sm text-blue-300 font-bold mb-2 mt-4 lg:mt-0">
              {playlistData.type.toUpperCase()}
            </p>
            <h1 className="text-3xl lg:text-6xl font-bold mb-2">
              {playlistData.name}
            </h1>
            {playlistData.description && (
              <p className="text-xl font-light text-pink-500 mt-4">
                {playlistData.description.replace(/<\/?[^>]+(>|$)/g, "")}
              </p>
            )}
            <p className="text-pink-500 mt-4 text-2xl font-regular">
              {playlistData.owner.display_name} &bull;{" "}
              {playlistData.tracks.total} Tracks
            </p>
          </div>
        </div>
        <div className="h-3/4 container mx-auto my-8">
          <div className="text-3xl text-white font-semibold px-4 lg:px-0">
            Tracks
          </div>
          <div
            className="text-2xl text-white font-semibold px-4 lg:px-0 rounded-md px-4 py-4 hover:bg-gray-800 cursor-pointer mt-3"
            onClick={() => handlePlayerAdd(playlistData.uri)}
          >
            Listen Now
          </div>
          <TrackListForPlaylist
            tracks={playlistData.tracks.items}
            token={token}
          />
        </div>
      </div>
    </>
  );
}

export default PlaylistFromAPI;
