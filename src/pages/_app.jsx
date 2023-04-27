import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import "@styles/globals.css";
import PlayerContext from "./PlayerContext";
import axios from "axios";

const App = ({ Component, pageProps }) => {
  const [player, setPlayer] = useState(undefined);
  useEffect(() => {
    // Create a Web Playback Instance Object
    const createPlayer = () => {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      // Once the script is loaded, we can use the Spotify SDK
      window.onSpotifyWebPlaybackSDKReady = async () => {
        let token;
        try {
          token = await axios.get("/api/token");
        } catch (e) {
          console.error(e);
        }

        token = token.data.token;
        const music_player = new window.Spotify.Player({
          name: "Synth Music Player",
          getOAuthToken: (cb) => {
            cb(token);
          },
          volume: 0.5,
        });

        setPlayer(music_player);
        music_player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
        });
        music_player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id);
        });
        music_player.connect();
      };
    };

    createPlayer();
  }, []);

  return (
    <>
      <Head>
        <title>Synth</title>
        <meta name="keywords" content="synth, music" />
        <meta name="description" content="Listen to music" />
        <meta name="author" content="Bug Squashers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PlayerContext.Provider value={[player, setPlayer]}>
        <Component {...pageProps} />
      </PlayerContext.Provider>
    </>
  );
};

export default App;
