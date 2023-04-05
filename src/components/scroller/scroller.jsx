import React, { useState } from "react";
import Tile from "@components/tile/tile";

const Scroller = ({ title, tagline, items }) => {
  const songs = [
    {
      id: 1,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 2,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 3,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 4,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 5,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 6,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 7,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 8,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 9,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 10,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
    {
      id: 11,
      imageUrl: "http://ecx.images-amazon.com/images/I/51US-2jHP8L._SL500_.jpg",
      name: "Led Zeppelin Essentials",
      subtitle: "YouTube Music Featured",
    },
  ];
  items = songs;
  return (
    <>
      <div className="mx-auto px-4 sm:px-8 lg:px-12 my-4">
        <div className="text-base text-gray-300 font-light pb-1 uppercase">
          {tagline}
        </div>
        <div className="text-3xl font-bold text-gray-200">{title}</div>

        <div className="overflow-x-scroll mt-3 flex flex-row justify-start items-center space-x-5 flex-nowrap">
          {(items || []).map((item) => (
            <Tile key={item.id} data={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Scroller;
