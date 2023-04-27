import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import withAuth from "@components/withAuth";
import PlaylistFromAPI from "@components/playlist/playlistFromAPI";
import MainLayout from "@components/layouts/main-layout";
import axios from "axios";

const Playlist = () => {
  const router = useRouter();
  const { id } = router.query;

  const [playlistData, setPlaylistData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchAlbumData() {
      if (id) {
        const { data } = await axios(`/api/playlists/${id}`);
        setPlaylistData(data);
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
          <PlaylistFromAPI playlistData={playlistData} />
        </MainLayout>
      </>
    );
  }
};

export default withAuth(Playlist);
