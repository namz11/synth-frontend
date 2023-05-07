import MainLayout from "@components/layouts/main-layout";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
// #FIREBASEAUTH Import auth, signIn (normal) from the firebase.config file
import { auth, signIn } from "@utils/firebase";
import { AuthContext } from "@context/AuthContext";
// #FIREBASEAUTH getAuth, signInWithPopup, GoogleAuthProvider from firebase/auth
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const db = getFirestore();

function LogIn() {
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        const userRef = doc(db, "users", user.uid);

        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          await updateDoc(userRef, { emailVerified: true });
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (!loading) {
        if (user && user.emailVerified) {
          router.push("/");
        } else {
          await auth.signOut();
        }
      }
    };

    checkUserAndRedirect();
  }, [user, loading, router]);

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider())
      .then(async (result) => {
        const user = result.user;
        dispatch({ type: "LOGIN", payload: user });
        const { displayName, email, uid, photoURL, emailVerified } = user;
        const nameParts = displayName.split(" ");
        const firstName = nameParts[0];
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        const userDocRef = doc(db, "users", uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          const response = await setDoc(userDocRef, {
            firstName,
            lastName,
            displayName,
            email,
            photoURL,
            emailVerified,
          })
            .then(() => {
              console.log("Document written successfully!");
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logToken = async () => {
    // #FIREBASEAUTH using useAuthState
    if (user) {
      const token = await user.getIdToken();
      return token;
    }
  };

  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const [verificationModal, setVerificationModal] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);

  const resendVerificationEmail = async () => {
    try {
      const userCredential = await signIn(auth, email, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        await sendEmailVerification(user);
      }
    } catch (error) {
      const errorMessage = error.code;
      switch (errorMessage) {
        case "auth/too-many-requests":
          setVerificationError(
            "Check your inbox and spam folder again. If you can't find the confirmation email, try the login button again shortly!"
          );
          break;
        case "auth/network-request-failed":
          setVerificationError(
            "A network error has occurred. Please check your connection and try again."
          );
          break;
        default:
          setVerificationError(
            "An unknown error occurred while sending the verification email."
          );
      }
      setVerificationModal(true);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setForgotPasswordError("Please enter an email address.");
      setForgotPasswordModal(true);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setForgotPasswordError(
        "If your email is registered with us, you'll receive a password reset email shortly. Please check your inbox or spam in case you didn't already receive it."
      );
      setForgotPasswordModal(true);
    } catch (error) {
      console.error("Error sending password reset email: ", error);
      if (error.code === "auth/user-not-found") {
        console.error("Error sending password reset email: ", error);
        setForgotPasswordError("The email address does not exist.");
        setForgotPasswordModal(true);
      } else {
        setForgotPasswordError(
          "If your email is registered with us, you'll receive a password reset email shortly. Please check your inbox or spam in case you didn't already receive it."
        );
        setForgotPasswordModal(true);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signIn(auth, email, password);
      const user = userCredential.user;
      if (user.emailVerified === true) {
        setVerificationError(false);
        dispatch({ type: "LOGIN", payload: user });
        router.push("/");
      } else {
        setVerificationError("Please verify your email before logging in.");
        setVerificationModal(true);
        resendVerificationEmail();
      }
    } catch (error) {
      const errorMessage = error.code;
      switch (errorMessage) {
        case "auth/invalid-email":
          setLoginError(
            "Invalid email format. Please enter a valid email address."
          );
          break;
        case "auth/user-disabled":
          setLoginError(
            "This account has been disabled. Please contact our support team for assistance."
          );
          break;
        case "auth/user-not-found":
          setLoginError("Incorrect email or password. Please try again.");

          break;
        case "auth/wrong-password":
          setLoginError("Incorrect email or password. Please try again.");
          break;
        case "auth/too-many-requests":
          setLoginError(
            "Check your inbox and spam folder again. If you can't find the confirmation email, try the login button again shortly!"
          );

          break;
        default:
          setLoginError(
            "An unexpected error occurred. Please try again later."
          );
      }
      setLoginModal(true);
    }
  };

  return (
    <>
      <div>
        <section className="bg-slate-900">
          <div className="lg:grid lg:min-h-[101vh] lg:grid-cols-12">
            <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
              <Image
                alt="Pattern"
                src="/music.jpg"
                className="w-full h-full object-cover"
                width={1200}
                height={1000}
              />
            </aside>

            <main
              aria-label="Main"
              className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6"
            >
              <div className="max-w-xl lg:max-w-3xl">
                <Link href="/" passHref>
                  <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
                    Synth
                  </span>
                </Link>

                <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  Welcome back to Synth 🎵
                </h1>

                <p className="mt-4 leading-relaxed text-blue-300">
                  Access your Synth account to continue your listening journey.{" "}
                  <br />
                  Login with your credentials and start exploring today!
                </p>

                <form
                  action="#"
                  onSubmit={handleLogin}
                  className="mt-8 grid grid-cols-6 gap-6"
                >
                  <div className="col-span-6">
                    <label
                      htmlFor="Email"
                      className="block text-sm font-medium text-cyan-200"
                    >
                      Email
                    </label>

                    <input
                      id="Email"
                      name="email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="Password"
                      className="block text-sm font-medium text-cyan-200"
                    >
                      Password
                    </label>

                    <input
                      type="password"
                      id="Password"
                      placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                      required
                    />
                  </div>

                  <div className="col-span-6 sm:grid sm:items-center sm:gap-4">
                    <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                      <button className="inline-block shrink-0 rounded-md border border-pink-600 bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-pink-300 focus:outline-none focus:ring active:text-pink-400">
                        Log In
                      </button>
                      <button
                        onClick={handleForgotPassword}
                        className="text-sm text-pink-500 hover:text-indigo-100 cursor-pointer mt-2 sm:mt-0 ml-2"
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <p className="mt-4 text-sm text-blue-300 sm:mt-4">
                      <span>New to Synth? </span>
                      <Link
                        className="text-pink-500 hover:text-indigo-100 cursor-pointer"
                        href="/auth/signup"
                        passHref
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
                <div className="mt-6 grid grid-cols-4 gap-2">
                  <div className="col-span-4 sm:col-span-2">
                    <div className="w-auto py-2">
                      <button
                        className="flex items-center p-4 bg-white hover:bg-pink-100 rounded-lg transition ease-in-out duration-200 cursor-pointer border-purple-400"
                        onClick={handleGoogleSignIn}
                      >
                        <img
                          className="mr-3 w-[20px]"
                          src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
                          alt="google"
                          width="32"
                          height="32"
                        />
                        <span className="font-semibold leading-normal">
                          Sign in with Google
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>
      </div>
      {verificationModal && verificationError && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:p-8">
            <div className="text-center">
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Email Verification Pending
                </h2>
                {verificationError && (
                  <div className="text-sm text-gray-700">
                    {verificationError}
                  </div>
                )}
                <div className="mt-2">
                  <div className="text-sm text-gray-500">
                    We have just sent you an email with a verification link to
                    confirm your email address. Please check your inbox and
                    follow the instructions to complete the verification
                    process.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:w-auto sm:text-sm"
                onClick={() => setVerificationModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {loginModal && loginError && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:p-8">
            <div className="text-center">
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">Oops!</h2>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">{loginError}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:w-auto sm:text-sm"
                onClick={() => {
                  setLoginModal(false);
                  setLoginError(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {forgotPasswordModal && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:p-8">
            <div className="text-center">
              <div className="mt-4">
                {forgotPasswordError ? (
                  <h2>{forgotPasswordError}</h2>
                ) : (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Forgot Password
                    </h2>
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">
                        A password reset email has been sent to your email
                        address. Please check your inbox and follow the
                        instructions to reset your password.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:w-auto sm:text-sm"
                onClick={() => setForgotPasswordModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LogIn;
