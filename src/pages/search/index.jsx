import React, { useState, useEffect } from "react";
import MainLayout from "@components/layouts/main-layout";
import { useRouter } from "next/router";
import Scroller from "@components/scroller/scroller";
import ScrollerTwo from "@components/scroller/scrollerTwo";
import withAuth from "@components/withAuth";
import axios from "axios";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";

const Search = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const searchTerm = router.query.query;
  const [tracks, setTracks] = useState(null);
  const [artists, setArtists] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const logToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
        return token;
      }
    };

    const fetchData = async () => {
      try {
        const token = await logToken();
        const response = await axios.get(`/api/search?search=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTracks(response.data.tracks.tracks.items);
        setArtists(response.data.artists.artists.items);
        setAlbums(response.data.albums.albums.items);
        setPlaylists(response.data.playlists.playlists.items);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (searchTerm && user && !loading) {
      fetchData();
    }
  }, [loading, searchTerm, user]);

  return (
    <>
      <MainLayout>
        {tracks && tracks?.length > 0 && (
          <Scroller
            title={"Tracks"}
            items={tracks || []}
            isTracks={true}
            token={token}
          />
        )}
        {artists && artists?.length > 0 && (
          <ScrollerTwo
            title={"Artists"}
            items={artists || []}
            isArtist={true}
          />
        )}
        {albums && albums?.length > 0 && (
          <ScrollerTwo title={"Albums"} items={albums || []} isArtist={false} />
        )}
        {playlists && playlists?.length > 0 && (
          <Scroller
            title={"Playlists"}
            items={playlists || []}
            isTracks={false}
          />
        )}
      </MainLayout>
    </>
  );
};

export default withAuth(Search);
