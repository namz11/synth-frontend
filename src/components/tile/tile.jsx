import React, { useState } from "react";
import Link from "next/link";

const Tile = ({ data }) => {
  if (data) {
    return (
      <>
        <Link href={`/playlist/${data?.id}`}>
          <div className="shrink-0 w-48 overflow-hidden bg-transparent rounded-lg shadow-lg">
            <img
              className="object-cover w-full h-48"
              src={data?.images?.length > 0 ? data?.images[0]?.url : null}
              alt="playlist image"
            />
            {/* TODO add no image */}

            <div className="py-2">
              <span
                className="block text-lg text-gray-800 dark:text-gray-100 truncate"
                tabIndex="0"
                role="link"
              >
                {data?.name}
              </span>
              <span className="block text-sm text-gray-700 dark:text-gray-200 truncate">
                {data?.description || data?.owner?.display_name}
              </span>
            </div>
          </div>
        </Link>
      </>
    );
  }
};

export default Tile;
