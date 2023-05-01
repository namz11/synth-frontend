// Could've Used Switch Case in the main scroller, but building this to make sure my changes don't break any code
import React from "react";
import ArtistTile from "@components/tiles/artistTile";
import AlbumTile from "@components/tiles/albumTile";

const ScrollerTwo = ({ title, tagline, items, isArtist }) => {
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
            items.map((item) => {
              if (isArtist) {
                return <ArtistTile key={item?.id} data={item} />;
              } else {
                return <AlbumTile key={item?.id} data={item} />;
              }
            })}
        </div>
      </div>
    </>
  );
};

export default ScrollerTwo;
