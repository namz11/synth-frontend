import React, { createContext, useState } from "react";

export const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [fullPlaylistData, setFullPlaylistData] = useState(null);
  const [fullTracksData, setFullTracksData] = useState(null);

  return (
    <PlaylistContext.Provider
      value={{
        fullPlaylistData,
        setFullPlaylistData,
        fullTracksData,
        setFullTracksData,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
