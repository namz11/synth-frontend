import Footer from "@components/footer/footer";
import Header from "@components/header/header";
import Scroller from "@components/scroller/scroller";
import MainLayout from "@components/layouts/main-layout";
import React from "react";

const Home = () => {
  return (
    <>
      <MainLayout>
        <Scroller
          title={"Trending Playlists"}
          tagline={"music that's hot and happening"}
        />
        <Scroller
          title={"Featured Playlists"}
          tagline={"curated with love by us"}
        />
        <Scroller title={"My Playlists"} />
      </MainLayout>
    </>
  );
};

export default Home;
