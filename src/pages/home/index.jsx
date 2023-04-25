import Scroller from "@components/scroller/scroller";
import MainLayout from "@components/layouts/main-layout";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [recentTracks, setRecentTracks] = useState(null);
  const [mostPlayed, setMostPlayed] = useState(null);
  const [featuredPlaylist, setFeaturedPlaylist] = useState(null);
  const [categoryPlaylists, setCategoryPlaylists] = useState(null);

  useEffect(() => {
    async function fetchRecentTracks() {
      const { data } = await axios("/api/tracks/user/recent");
      console.log("recent", data);
      setRecentTracks(data?.items);
    }
    async function fetchMostPlayed() {
      const { data } = await axios("/api/tracks/user/most-played");
      console.log("most-played", data);
      setMostPlayed(data?.items);
    }
    async function fetchFeaturedPlaylists() {
      const { data } = await axios("/api/playlists/featured");
      console.log("featured", data);
      setFeaturedPlaylist(data);
    }
    async function fetchCategoryPlaylists() {
      const { data } = await axios("/api/playlists/category");
      console.log("category", data);
      setCategoryPlaylists(data);
    }
    fetchRecentTracks();
    fetchMostPlayed();
    fetchFeaturedPlaylists();
    fetchCategoryPlaylists();
  }, []);

  return (
    <>
      <MainLayout>
        {mostPlayed && mostPlayed?.length > 0 && (
          <Scroller
            title={"Listen Again"}
            items={mostPlayed || []}
            isTracks={true}
          />
        )}
        {recentTracks && recentTracks?.length > 0 && (
          <Scroller
            title={"Recently Played"}
            items={recentTracks || []}
            isTracks={true}
          />
        )}
        {featuredPlaylist && (
          <Scroller
            title={"Featured Playlists"}
            tagline={
              featuredPlaylist?.message || "music that's hot and happening"
            }
            items={featuredPlaylist?.playlists?.items || []}
            isTracks={false}
          />
        )}
        {categoryPlaylists &&
          categoryPlaylists?.length > 0 &&
          categoryPlaylists.map((item) => (
            <Scroller
              key={item.title}
              title={item?.title}
              tagline={item?.message}
              items={item?.playlists?.items || []}
              isTracks={false}
            />
          ))}
      </MainLayout>
    </>
  );
};

export default Home;
