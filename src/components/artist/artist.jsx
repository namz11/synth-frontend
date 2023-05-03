import Image from "next/image";
import Link from "next/link";
import React from "react";
import TrackListForArtist from "@components/trackList/topTrackForArtist";
import { spotifyApi } from "react-spotify-web-playback";
import { PlayerContext } from "@context/PlayerContext";
import { useContext } from "react";
import axios from "axios";

function Artist({ artistData, artistTopTracksData, token }) {
  const [deviceId, setDeviceId] = useContext(PlayerContext);

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

  console.log(artistTopTracksData);

  return (
    <>
      <div className="mt-2 lg:mt-6 flex flex-col ">
        <div className="h-1/4  container mx-auto py-8 flex flex-wrap">
          <div className="w-3/10 flex items-center justify-center px-4">
            <Image
              src={
                artistData.images[0].url ||
                "https://faculty.eng.ufl.edu/fluids/wp-content/uploads/sites/46/2015/11/img-placeholder-270x300.png"
              }
              alt="Artist Cover"
              width={350}
              height={350}
            />
          </div>
          <div className="w-7/10 pl-4 flex flex-col items-start justify-center text-white">
            <div className="text-sm text-blue-300 font-bold mb-2 mt-4 lg:mt-0">
              {artistData.type.toUpperCase()}
            </div>
            <div className="text-3xl lg:text-7xl font-bold mb-2">
              {artistData.name}
            </div>
          </div>
        </div>
        <div className="h-3/4 container mx-auto my-6">
          <div className="text-3xl text-white font-semibold px-4 lg:px-0">
            Top Tracks
          </div>
          <div
            className="text-2xl text-white font-semibold px-4 lg:px-0 rounded-md px-4 py-4 hover:bg-gray-800 cursor-pointer mt-3"
            onClick={() => {
              let trackUriList = [];
              artistTopTracksData.tracks.forEach((track) => {
                trackUriList.push(track.uri);
              });
              handlePlayerAdd(trackUriList);
            }}
          >
            Listen Now
          </div>
          <TrackListForArtist topTracks={artistTopTracksData} token={token} />
        </div>
      </div>
    </>
  );
}

export default Artist;
