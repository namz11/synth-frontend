import Scroller from "@components/scroller/scroller";
import MainLayout from "@components/layouts/main-layout";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [featuredPlaylist, setFeaturedPlaylist] = useState(null);
  const [categoryPlaylists, setCategoryPlaylists] = useState(null);

  useEffect(() => {
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
    fetchFeaturedPlaylists();
    fetchCategoryPlaylists();
  }, []);

  return (
    <>
      <MainLayout>
        {featuredPlaylist && (
          <Scroller
            title={"Featured Playlists"}
            tagline={
              featuredPlaylist?.message || "music that's hot and happening"
            }
            playlists={featuredPlaylist?.playlists?.items || []}
          />
        )}
        {categoryPlaylists &&
          categoryPlaylists?.length > 0 &&
          categoryPlaylists.map((item) => (
            <Scroller
              key={item.title}
              title={item?.title}
              tagline={item?.message}
              playlists={item?.playlists?.items || []}
            />
          ))}
      </MainLayout>
    </>
  );
};

export default Home;
