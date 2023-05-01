import { async } from "@firebase/util";
import { createContext, useEffect, useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../utils/firebase";
import axios from "axios";
const PlayerContext = createContext(undefined);
export default PlayerContext;

export const PlayerContextProvider = ({ children }) => {
  const [player, setPlayer] = useState(undefined);

  return (
    <PlayerContext.Provider value={{ player, setPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};
