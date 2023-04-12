import React, { useState } from "react";
import Link from "next/link";
import { toString } from "lodash-es";
const Tile = ({ data }) => {
  const isUserPlaylist = toString(data?.userId).trim() !== "";

  if (data) {
    return (
      <>
        <Link href={`/playlist/${data?.id}`}>
          <div className="shrink-0 w-48 overflow-hidden bg-transparent">
            {!isUserPlaylist &&
              (data?.images?.length > 0 &&
              toString(data?.images[0]?.url).trim() !== "" ? (
                <img
                  className="object-cover w-full h-48"
                  src={data?.images[0]?.url}
                  alt="playlist image"
                />
              ) : (
                <div className="bg-gray-800 w-full h-48 opacity-70"></div>
              ))}
            {isUserPlaylist && (
              <div className="flex flex-row flex-wrap justify-start content-start">
                {data?.images?.length > 0 &&
                toString(data?.images[0]).trim() !== "" ? (
                  <img
                    className="object-cover w-24 h-24"
                    src={data?.images[0]}
                    alt="playlist image"
                  />
                ) : (
                  <div className="bg-gray-800 w-24 h-24 opacity-70"></div>
                )}

                {data?.images?.length > 1 &&
                toString(data?.images[1]).trim() !== "" ? (
                  <img
                    className="object-cover w-24 h-24"
                    src={data?.images[1]}
                    alt="playlist image"
                  />
                ) : (
                  <div className="bg-gray-800 w-24 h-24 opacity-70"></div>
                )}

                {data?.images?.length > 2 &&
                toString(data?.images[2]).trim() !== "" ? (
                  <img
                    className="object-cover w-24 h-24"
                    src={data?.images[2]}
                    alt="playlist image"
                  />
                ) : (
                  <div className="bg-gray-800 w-24 h-24 opacity-70"></div>
                )}

                {data?.images?.length > 3 &&
                toString(data?.images[3]).trim() !== "" ? (
                  <img
                    className="object-cover w-24 h-24"
                    src={data?.images[3]}
                    alt="playlist image"
                  />
                ) : (
                  <div className="bg-gray-800 w-24 h-24 opacity-70"></div>
                )}
              </div>
            )}

            <div className="py-2">
              <span
                className="block text-lg text-gray-800 dark:text-gray-100 truncate"
                tabIndex="0"
                role="link"
              >
                {data?.name}
              </span>
              <span className="block text-sm text-gray-700 dark:text-gray-200 truncate">
                {isUserPlaylist
                  ? `${data?.tracks?.length} songs`
                  : data?.description || data?.owner?.display_name}
              </span>
            </div>
          </div>
        </Link>
      </>
    );
  }
};

export default Tile;
