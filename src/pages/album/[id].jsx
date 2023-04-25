import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";
import AlbumComponent from "@components/album/album";

const Album = () => {
  const router = useRouter();
  const { id } = router.query;

  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchAlbumData() {
      if (id) {
        const { data } = await axios(`/api/album/${id}`);
        setAlbumData(data);
        setLoading(false);
      }
    }
    fetchAlbumData();
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
          <AlbumComponent albumData={albumData} />
        </MainLayout>
      </>
    );
  }
};

export default Album;
