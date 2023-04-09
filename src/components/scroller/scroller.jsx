import React, { useState } from "react";
import Tile from "@components/tile/tile";

const Scroller = ({ title, tagline, playlists }) => {
  return (
    <>
      <div className="mx-auto px-4 sm:px-8 lg:px-12 my-4">
        <div className="text-base text-gray-300 font-light pb-1 uppercase">
          {tagline}
        </div>
        <div className="text-3xl font-bold text-gray-200">{title}</div>

        <div className="overflow-x-scroll mt-3 flex flex-row justify-start items-center space-x-5 flex-nowrap">
          {playlists &&
            playlists.length > 0 &&
            playlists.map((playlist) => (
              <Tile key={playlist?.id} data={playlist} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Scroller;
