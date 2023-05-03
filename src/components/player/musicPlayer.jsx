"use client";
import React, { useEffect, useState, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";
import axios from "axios";
import SpotifyPlayer from "react-spotify-web-playback";
import { PlayerContext } from "@context/PlayerContext";

function MusicPlayer() {
  const [user, loading] = useAuthState(auth);
  const [token, setToken] = useState(null);
  const [deviceId, setDeviceId] = useContext(PlayerContext);

  useEffect(() => {
    const fetchToken = async () => {
      // Wait until not loading and user is defined.
      if (loading || !user) return;

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
          name="Synth Music Player"
          token={token}
          uris={["spotify:track:4h9wh7iOZ0GGn8QVp4RAOB"]}
          play={false}
          callback={(state) => {
            // Set the device id in storage
            if (state.deviceId) {
              setDeviceId(state.deviceId);
            }
          }}
          styles={{
            bgColor: "#1f2937",
            color: "#fff",
            loaderColor: "#fff",
            sliderColor: "#EC4899",
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
