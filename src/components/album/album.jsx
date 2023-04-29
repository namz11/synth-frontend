import Image from "next/image";
import Link from "next/link";
import React from "react";
import TrackList from "@components/trackList/trackList";

function album({ albumData }) {
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return formattedDate;
  }

  if (albumData) {
    return (
      <>
        <div className="mt-8 flex flex-col ">
          <div className="h-1/4 container mx-auto py-8 flex flex-wrap:nowrap">
            <div className="w-3/10 flex items-center justify-center px-4">
              <Image
                src={albumData.images[0].url}
                alt="Album Cover"
                width={400}
                height={400}
              />
            </div>
            <div className="w-7/10 pl-4 flex flex-col items-start justify-center text-white text-overflow: ellipsis">
              <p className="text-sm text-blue-300 font-bold mb-2">
                {albumData.type.toUpperCase()}
              </p>
              <p className="text-6xl font-bold mb-2 ">{albumData.name}</p>
              <div className="text-xl font-semibold mb-2 ">
                {albumData.artists.map((artist, index) => (
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
              <p className="text-blue-300 font-medium">
                {albumData.total_tracks} Tracks &bull;{" "}
                {albumData.release_date.slice(0, 4)}
              </p>
            </div>
          </div>

          <div className="h-3/4 container mx-auto mt-4">
            <div className="text-3xl text-white font-semibold">Tracks</div>
            <TrackList tracks={albumData.tracks} />
            <div className="my-8 text-gray-400 text-sm">
              <p>{formatDate(albumData.release_date)}</p>
              {albumData?.copyrights &&
                albumData?.copyrights.map((item) => (
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
        <div>Loading...</div>
      </>
    );
  }
}

export default album;
