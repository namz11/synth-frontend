import React, { useState } from "react";
import Link from "next/link";
import { toString } from "lodash-es";

const TrackTile = ({ data }) => {
  if (data) {
    return (
      <>
        <div className="shrink-0 w-48 overflow-hidden bg-transparent">
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
        </div>
      </>
    );
  }
};

export default TrackTile;
