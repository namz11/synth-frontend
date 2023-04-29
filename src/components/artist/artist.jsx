import Image from "next/image";
import Link from "next/link";
import React from "react";
import TrackListForArtist from "@components/trackList/topTrackForArtist";

function artist({ artistData, artistTopTracksData, token }) {
  return (
    <>
      <div className="mt-8 flex flex-col ">
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
            <p className="text-sm text-blue-300 font-bold mb-2">
              {artistData.type.toUpperCase()}
            </p>
            <h1 className="text-7xl font-bold mb-2">{artistData.name}</h1>
            {/* <p className="text-blue-300 text-2xl font-medium">
              Followers: {artistData.followers.total.toLocaleString()} (Spotify)
            </p> */}
          </div>
        </div>
        <div className="h-3/4 container mx-auto my-8">
          <div className="text-3xl text-white font-semibold">Top Tracks</div>
          <TrackListForArtist topTracks={artistTopTracksData} token={token} />
        </div>
      </div>
    </>
  );
}

export default artist;
