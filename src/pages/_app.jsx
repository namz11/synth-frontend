import React, { useState, useEffect } from "react";
import Head from "next/head";
import "@styles/globals.css";
import { AuthContextProvider } from "@context/AuthContext";
import store from "@utils/store";
import MusicPlayer from "@components/player/musicPlayer";
import { Provider } from "react-redux";

const App = ({ Component, pageProps }) => {
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
      <AuthContextProvider>
        <Provider store={store}>
          <Component {...pageProps} />
          <MusicPlayer />
        </Provider>
      </AuthContextProvider>
    </>
  );
};

export default App;
