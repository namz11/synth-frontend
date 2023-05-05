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
  const [currentTrack, setCurrentTrack] = useState(null);

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
  }, [user, loading]);

  const refetchToken = async () => {
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
    return tok;
  };

  const addTrackToDatabase = async (trackId) => {
    let res, tok;
    tok = await user.getIdToken();
    try {
      res = await axios.post(
        {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        },
        "/api/tracks/user/add",
        {
          trackId: trackId,
        }
      );
    } catch (e) {
      console.error(e);
    }
    console.log(res);
  };

  return (
    user && (
      <div className="fixed bottom-0 z-40 w-full">
        <SpotifyPlayer
          name="Synth Music Player"
          token={token}
          uris={["spotify:track:4h9wh7iOZ0GGn8QVp4RAOB"]}
          play={false}
          callback={async (state) => {
            // Set the device id in storage
            if (state.deviceId !== deviceId) {
              setDeviceId(state.deviceId);
            }
            // Check if the player has changed the track and is playing.
            if (state.track.uri !== currentTrack && state.isPlaying) {
              // Set the current track
              setCurrentTrack(state.track.uri);
              let trackId = state.track.uri.split(":")[2];
              console.log(trackId);
              // Add the track as being played by the user in the database.
              addTrackToDatabase(trackId);
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
          getOAuthToken={async (cb) => {
            // fetch token from backend api
            let tok = await refetchToken();
            console.log("fetched new token");
            cb(tok);
          }}
        ></SpotifyPlayer>
      </div>
    )
  );
}

export default MusicPlayer;
