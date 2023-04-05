import React, { useState } from "react";

const Tile = ({ data }) => {
  return (
    <>
      <div className="shrink-0 w-48 overflow-hidden bg-transparent rounded-lg shadow-lg">
        <img
          className="object-cover w-full h-48"
          src={data?.imageUrl}
          alt="playlist image"
        />

        <div className="py-2">
          <span
            className="block text-lg text-gray-800 dark:text-gray-100 truncate"
            tabIndex="0"
            role="link"
          >
            {data?.name}
          </span>
          <span className="block text-sm text-gray-700 dark:text-gray-200 truncate">
            {data?.subtitle}
          </span>
        </div>
      </div>
    </>
  );
};

export default Tile;
