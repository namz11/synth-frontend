import React, { useContext } from "react";
import { current } from "tailwindcss/colors";
import {
  IoPlaySharp,
  IoPlaySkipForwardSharp,
  IoPlaySkipBackSharp,
} from "react-icons/io5";
import PlayerContext from "@pages/PlayerContext";

function MusicPlayer() {
  const [player] = useContext(PlayerContext);

  return (
    <div>
      {/* Is the player defined? */}
      {player && (
        <div className="fixed bottom-0 left-0 w-full h-16 bg-slate-100 dark:bg-slate-900 flex flex-row justify-center items-center">
          <div className="flex flex-row justify-center items-center">
            <IoPlaySkipBackSharp className="text-3xl text-slate-900 dark:text-slate-100" />
            <IoPlaySharp className="text-3xl text-slate-900 dark:text-slate-100" />
            <IoPlaySkipForwardSharp className="text-3xl text-slate-900 dark:text-slate-100" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
