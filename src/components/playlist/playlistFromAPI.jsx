import Image from "next/image";
import React from "react";
import TrackListForPlaylist from "@components/trackList/trackListForPlaylist";

function playlistFromAPI({ playlistData, token }) {
  return (
    <>
      <div className="mt-8 flex flex-col ">
        <div className="h-1/4 container mx-auto py-8 flex flex-wrap">
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
          <TrackListForPlaylist
            tracks={playlistData.tracks.items}
            token={token}
          />
        </div>
      </div>
    </>
  );
}

export default playlistFromAPI;
