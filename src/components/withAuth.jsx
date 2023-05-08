/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";
import MainLayout from "./layouts/main-layout";
import Loader from "./loader/loader";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/auth/login");
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <>
          <MainLayout>
            <Loader />
          </MainLayout>
        </>
      ); // to be replaced with loading spinner
    }

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
