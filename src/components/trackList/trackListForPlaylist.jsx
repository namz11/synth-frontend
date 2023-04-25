import Image from "next/image";
import Link from "next/link";
import React from "react";

function topTrackForPlaylist({ tracks }) {
  function formatDuration(duration_ms) {
    const seconds = Math.floor((duration_ms / 1000) % 60);
    const minutes = Math.floor(duration_ms / 1000 / 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <>
      <div className="container mx-auto text-white mt-4">
        {tracks.map((track, index) => (
          <Link key={track.id} href={`#_`}>
            <div className="flex items-center rounded-md px-4 py-4 hover:bg-gray-800 cursor-pointer">
              <div className="mr-5 text-white">{index + 1}</div>
              <Image
                class="object-cover mr-4"
                src={track.track.album.images[1].url}
                alt="Track Cover"
                width={70}
                height={70}
              />
              <div className="flex-grow ">
                <div className="font-medium text-xl text-white truncate hover:underline">
                  {track.track.name}
                </div>
                <p className="text-gray-400 flex flex-wrap">
                  {track.track.artists.map((artist, index) => (
                    <React.Fragment key={artist.id}>
                      <Link href={`/artist/${artist.id}`}>
                        <div className="text-pink-500 text-lg hover:underline">
                          {artist.name}
                        </div>
                      </Link>
                      {index !== track.track.artists.length - 1 && (
                        <span className="text-pink-500">,&nbsp;</span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              </div>
              <Link href={`/album/${track.track.album.id}`}>
                <div className="text-blue-300 hover:underline mr-28">
                  {track.track.album.name}
                </div>
              </Link>
              <div className="text-gray-400">
                {formatDuration(track.track.duration_ms)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default topTrackForPlaylist;
