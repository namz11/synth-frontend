import React, { useState, useEffect } from "react";
import Head from "next/head";
import "@styles/globals.css";

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
      <Component {...pageProps} />
    </>
  );
};

export default App;
