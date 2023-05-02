"use client";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";
import axios from "axios";
import SpotifyPlayer from "react-spotify-web-playback";
import { useDispatch } from "react-redux";
import playerActions from "@utils/playerActions";

function MusicPlayer() {
  const [user, loading] = useAuthState(auth);
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      // Wait until not loading and user is defined.
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (!loading && user) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      // Get the spotify token from the backend api.
      let res, tok;
      tok = await user.getIdToken();
      try {
        res = await axios.get("/api/token", {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        });
      } catch (e) {
        console.error(e);
      }
      tok = res.data.token;
      setToken(tok);
    };

    fetchToken();
  }, [user, loading]);

  return (
    user && (
      <div className="fixed bottom-0 w-full">
        <SpotifyPlayer
          token={token}
          uris={["spotify:track:4h9wh7iOZ0GGn8QVp4RAOB"]}
          play={false}
          callback={(state) => {
            if (state.deviceId) {
              dispatch(playerActions.setDeviceId(state.deviceId));
            }
          }}
          styles={{
            bgColor: "#1e1e1e",
            color: "#fff",
            loaderColor: "#fff",
            sliderColor: "#1cb954",
            savedColor: "#fff",
            trackArtistColor: "#ccc",
            trackNameColor: "#fff",
          }}
          hideAttribution={true}
          layout="responsive"
          magnifySliderOnHover={true}
        ></SpotifyPlayer>
      </div>
    )
  );
}

export default MusicPlayer;
