import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { AuthContext } from "@context/AuthContext";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@utils/firebase";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore();

import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const [isOpen, setOpen] = useState(false);
  const [user, loading] = useAuthState(auth);
  const { currentUser } = useContext(AuthContext);
  const [photoURL, setPhotoURL] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Successfully Logged Out!");
        dispatch({ type: "LOGOUT" });
        router.push("/auth/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      router.push(`/search?query=${searchTerm}`);
    }
  }, [searchTerm]);

  const logInRedirect = () => {
    console.log("PLEASE LOGIN");
    router.push("/auth/login");
  };

  useEffect(() => {
    const fetchUserData = async (uid) => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.photoURL) {
          setPhotoURL(userData.photoURL);
        }
      }
    };

    // #FIREBASEAUTH using useAuthState
    if (!loading) {
      if (user) {
        if (user.photoURL) {
          setPhotoURL(user.photoURL);
          fetchUserData(user.uid);
        } else {
          fetchUserData(user.uid);
        }
      } else {
        console.log("Denied due to unauthorized");
      }
    }
  }, [user, loading]);

  {
    /* taken from - https://merakiui.com/components/navbars */
  }
  const loggedInNav = (
    <nav className="relative bg-white shadow dark:bg-gray-800">
      <div className="container px-6 py-3 mx-auto md:flex">
        <div className="flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-bold text-gray-800 transition-colors duration-300 transform dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300">
              Synth
            </span>
          </Link>

          {/* <!-- Mobile menu button --> */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setOpen(!isOpen)}
              type="button"
              className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
              aria-label="toggle menu"
            >
              {!isOpen && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              )}

              {isOpen && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* <!-- Mobile Menu open: "block", Menu closed: "hidden" --> */}
        <div
          className={`${
            isOpen ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-full"
          } absolute inset-x-0 z-9 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 md:mt-0 md:p-0 md:top-0 md:relative md:opacity-100 md:translate-x-0 md:flex md:items-center md:justify-between`}
        >
          <div className="flex flex-col px-2 -mx-4 md:flex-row md:mx-10 md:py-0 items-center">
            <Link href="/home">
              <span
                href="#"
                className="px-2.5 py-2 text-gray-700 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 md:mx-2"
              >
                Home
              </span>
            </Link>
            <Link href="/user/playlists">
              <span
                href="#"
                className="px-2.5 py-2 text-gray-700 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 md:mx-2"
              >
                My Playlists
              </span>
            </Link>
          </div>

          <div className="relative mt-4 md:mt-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>

            <input
              autoFocus={router.pathname === "/search"}
              type="text"
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e)}
              onClick={() => router.push("/search")} // Add this line
              aria-label="Search"
            />
          </div>

          <div className="flex items-center mt-4 lg:mt-0">
            <button
              className="hidden mx-4 text-gray-600 transition-colors duration-300 transform lg:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none"
              aria-label="show notifications"
              onClick={handleLogout}
            >
              <FiLogOut aria-label="Logout" />
            </button>

            <button
              type="button"
              className="flex items-center focus:outline-none"
              aria-label="toggle profile dropdown"
              onClick={() => {
                if (user) {
                  router.push("/profile");
                } else {
                  router.push("/auth/login");
                }
              }}
            >
              <div className="w-8 h-8 overflow-hidden border-2 border-slate-100 rounded-full ">
                <img
                  src={photoURL || "/user.png"}
                  className="object-cover w-full h-full"
                  alt="avatar"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const loggedOutNav = (
    <nav className="relative bg-white shadow dark:bg-gray-800">
      <div className="container px-6 py-3 mx-auto md:flex">
        <div className="flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-bold text-gray-800 transition-colors duration-300 transform dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300">
              Synth
            </span>
          </Link>

          {/* <!-- Mobile menu button --> */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setOpen(!isOpen)}
              type="button"
              className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
              aria-label="toggle menu"
            >
              {!isOpen && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              )}

              {isOpen && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* <!-- Mobile Menu open: "block", Menu closed: "hidden" --> */}
        <div
          className={`${
            isOpen ? "translate-x-0 opacity-100" : "opacity-0 -translate-x-full"
          } absolute inset-x-0 z-9 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 md:mt-0 md:p-0 md:top-0 md:relative md:opacity-100 md:translate-x-0 md:flex md:items-center md:justify-between`}
        >
          <div className="flex flex-col px-2 -mx-4 md:flex-row md:mx-10 md:py-0 items-center">
            <Link href="/home">
              <span
                href="#"
                className="px-2.5 py-2 text-gray-700 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 md:mx-2"
              >
                Home
              </span>
            </Link>
            <Link href="/user/playlists">
              <span
                href="#"
                className="px-2.5 py-2 text-gray-700 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 md:mx-2"
              >
                My Playlists
              </span>
            </Link>
          </div>

          <div className="relative mt-4 md:mt-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>

            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
              placeholder="Search"
            />
          </div>

          <div className="flex items-center mt-4 lg:mt-0">
            <button
              className="hidden mx-4 text-gray-600 transition-colors duration-300 transform lg:block dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none"
              aria-label="show notifications"
              onClick={logInRedirect}
            >
              Log In
            </button>

            <button
              type="button"
              className="flex items-center focus:outline-none"
              aria-label="toggle profile dropdown"
              onClick={() => {
                if (user) {
                  router.push("/profile");
                } else {
                  router.push("/auth/login");
                }
              }}
            >
              <div className="w-8 h-8 overflow-hidden border-2 border-slate-100 rounded-full ">
                <img
                  src={photoURL || "/user.png"}
                  className="object-cover w-full h-full"
                  alt="avatar"
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>{user ? loggedInNav : loggedOutNav}</>
      )}
    </>
  );
};

export default Header;
