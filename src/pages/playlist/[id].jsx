import React, { useState } from "react";
import { useRouter } from "next/router";
import withAuth from "../../components/withauth";

const Playlist = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <div>this is playlist page for {id}</div>
    </>
  );
};

export default withAuth(Playlist);
