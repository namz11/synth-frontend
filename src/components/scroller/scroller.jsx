import React from "react";
import PlaylistTile from "@components/tiles/playlistTile";
import TrackTile from "@components/tiles/trackTile";

const Scroller = ({ title, tagline, items, isTracks, token }) => {
  return (
    <>
      <div className="mx-auto px-4 sm:px-8 lg:px-12 my-4">
        <div className="text-base text-gray-300 font-light pb-1 uppercase">
          {tagline}
        </div>
        <div className="text-3xl font-bold text-gray-200">{title}</div>

        <div className="overflow-x-scroll mt-3 flex flex-row justify-start items-center space-x-5 flex-nowrap">
          {items &&
            items.length > 0 &&
            items.map((item, idx) => {
              if (isTracks) {
                return (
                  <TrackTile
                    key={`${idx}_${item?.id}`}
                    data={item}
                    token={token}
                  />
                );
              } else {
                return <PlaylistTile key={`${idx}_${item?.id}`} data={item} />;
              }
            })}
        </div>
      </div>
    </>
  );
};

export default Scroller;
