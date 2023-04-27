import React, { useState } from "react";
import Link from "next/link";
import { toString } from "lodash-es";
import { FaPlay } from "react-icons/fa";

const TrackTile = ({ data }) => {
  const handlePlayTrack = (data) => {
    // TODO dominick
    console.log(data);
  };
  if (data) {
    return (
      <>
        <div className="relative shrink-0 w-48 overflow-hidden bg-transparent hover:">
          {data?.album?.images?.length > 0 &&
          toString(data?.album?.images[0]?.url).trim() !== "" ? (
            <img
              className="object-cover w-full h-48"
              src={data?.album?.images[0]?.url}
              alt="playlist image"
            />
          ) : (
            <div className="bg-gray-800 w-full h-48 opacity-70"></div>
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
              {`Song - ${data?.artists[0]?.name}`}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 top-0 h-48 w-48 overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition duration-300 ease-in-out hover:opacity-80">
            <div className="text-3xl text-white text-center flex justify-center align-center items-center w-full h-full">
              <button onClick={() => handlePlayTrack(data)} type="button">
                <FaPlay />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default TrackTile;
