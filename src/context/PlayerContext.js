import { useState, createContext } from "react";

export const PlayerContext = createContext(undefined);

export const PlayerContextProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState(undefined);

  return (
    <PlayerContext.Provider value={[deviceId, setDeviceId]}>
      {children}
    </PlayerContext.Provider>
  );
};
