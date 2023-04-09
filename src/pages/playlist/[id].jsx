import React, { useState } from "react";
import { useRouter } from "next/router";

const Playlist = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <div>this is playlist page for {id}</div>
    </>
  );
};

export default Playlist;
