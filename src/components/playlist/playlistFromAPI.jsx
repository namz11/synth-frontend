import Image from "next/image";
import React from "react";
import TrackListForPlaylist from "@components/trackList/trackListForPlaylist";

function playlistFromAPI({ playlistData }) {
  function getTime(isoString) {
    const date = new Date(isoString);
    let hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    if (Number(hours.slice(0, 1)) === 0) {
      hours = hours.slice(1);
    }
    return `${hours}hr ${minutes}min `;
  }

  return (
    <>
      <div className="mt-8 flex flex-col ">
        <div className="h-1/4 container mx-auto py-8 flex flex-wrap">
          <div className="w-3/10 flex items-center justify-center px-4">
            <Image
              src={playlistData.images[0].url}
              alt="Artist Cover"
              width={350}
              height={350}
            />
          </div>
          <div className="w-7/10 pl-4 flex flex-col items-start justify-center text-white text-overflow: ellipsis">
            <p className="text-sm text-blue-300 font-bold mb-2">
              {playlistData.type.toUpperCase()}
            </p>
            <h1 className="text-7xl font-bold mb-2">{playlistData.name}</h1>
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
          <div className="text-3xl text-white font-semibold">Tracks</div>
          <TrackListForPlaylist tracks={playlistData.tracks.items} />
        </div>
      </div>
    </>
  );
}

export default playlistFromAPI;
