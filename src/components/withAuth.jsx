/* eslint-disable react/display-name */
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/login");
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>; // to be replaced with loading spinner
    }

    return user ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
