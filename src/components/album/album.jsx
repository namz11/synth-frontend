import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import TrackList from "@components/trackList/trackList";
import axios from "axios";
import { spotifyApi } from "react-spotify-web-playback";
import { PlayerContext } from "@context/PlayerContext";
import MainLayout from "@components/layouts/main-layout";
import Loader from "@components/loader/loader";

function Album({ albumData, token }) {
  const [deviceId, setDeviceId] = useContext(PlayerContext);

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return formattedDate;
  }

  // Play the full album
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

  if (albumData) {
    return (
      <>
        <div className="mt-2 lg:mt-6 flex flex-col ">
          <div className="h-1/4 container mx-auto py-8 flex flex-wrap lg:flex-nowrap">
            <div className="w-3/10 flex items-center justify-center px-4">
              <Image
                src={
                  albumData?.images[0]?.url ||
                  "https://faculty.eng.ufl.edu/fluids/wp-content/uploads/sites/46/2015/11/img-placeholder-270x300.png"
                }
                alt="Album Cover"
                width={400}
                height={400}
              />
            </div>
            <div className="w-7/10 pl-4 flex flex-col items-start justify-center text-white text-overflow: ellipsis">
              <p className="text-sm text-blue-300 font-bold mb-2 mt-4 lg:mt-0">
                {albumData?.type.toUpperCase() || `ALBUM`}
              </p>
              <p className="text-3xl lg:text-5xl font-bold mb-2">
                {albumData?.name || `No Name Available`}
              </p>
              <div className="text-lg lg:text-xl font-semibold mb-2 ">
                {albumData?.artists?.map((artist, index) => (
                  <React.Fragment key={artist.id}>
                    <Link href={`/artist/${artist.id}`}>
                      <span className="text-pink-500 hover:text-pink-600">
                        {artist.name}
                      </span>
                    </Link>
                    {index !== albumData.artists.length - 1 && (
                      <span className="text-pink-500"> &bull; </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {/* <p className="text-blue-300 font-medium">
                {albumData?.total_tracks} Tracks &bull;{" "}
                {albumData?.release_date.slice(0, 4)}
              </p> */}
              {albumData && (
                <p className="text-blue-300 font-medium">
                  {albumData.total_tracks && `${albumData.total_tracks} Tracks`}{" "}
                  {albumData.release_date &&
                    `• ${albumData.release_date.slice(0, 4)}`}
                </p>
              )}
            </div>
          </div>

          <div className="h-3/4 container mx-auto mt-4">
            <div className="text-3xl text-white font-semibold px-4 lg:px-0">
              Tracks
            </div>
            <div
              className="text-2xl text-white font-semibold px-4 lg:px-0 rounded-md py-4 hover:bg-gray-800 cursor-pointer mt-3"
              onClick={() => handlePlayerAdd(albumData.uri)}
            >
              Listen Now
            </div>
            <TrackList tracks={albumData.tracks} token={token} />
            <div className="my-8 text-gray-400 text-sm">
              {albumData?.release_date && (
                <p>{formatDate(albumData.release_date)}</p>
              )}
              {albumData?.copyrights?.map((item) => (
                <p key={item.type}>
                  {item.type === "C" && `© ${item.text.slice(3)}`}
                  {item.type === "P" && `℗ ${item.text.slice(3)}`}
                </p>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <MainLayout>
          <Loader />
        </MainLayout>
      </>
    );
  }
}

export default Album;
