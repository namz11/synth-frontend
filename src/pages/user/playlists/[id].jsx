import React from "react";
import MainLayout from "@components/layouts/main-layout";
// import axios from "axios";
import { useRouter } from "next/router";

function UserPlaylist() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <MainLayout>
        <div className="text-white">{id}</div>
      </MainLayout>
    </>
  );
}

export default UserPlaylist;
