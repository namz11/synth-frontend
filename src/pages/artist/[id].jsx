import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";
import ArtistComponent from "@components/artist/artist";

const Artist = () => {
  const router = useRouter();
  const { id } = router.query;

  const [artistData, setArtistData] = useState(null);
  const [artistTopTracksData, setArtistTopTracksData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchArtistData() {
      if (id) {
        const { data } = await axios(`/api/artist/${id}`);
        setArtistData(data);
      }
    }
    async function fetchArtistTopTracksData() {
      if (id) {
        const { data } = await axios(`/api/artist/${id}/top-tracks`);
        setArtistTopTracksData(data);
        setLoading(false);
      }
    }
    fetchArtistData();
    fetchArtistTopTracksData();
  }, [id]);

  if (loading) {
    return (
      <>
        <div>Loading</div>
      </>
    );
  } else {
    return (
      <>
        <MainLayout>
          <ArtistComponent
            artistData={artistData}
            artistTopTracksData={artistTopTracksData}
          />
        </MainLayout>
      </>
    );
  }
};

export default Artist;
