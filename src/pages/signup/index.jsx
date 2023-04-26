import MainLayout from "@components/layouts/main-layout";
import React, { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth, signUp } from "@utils/firebase";
import { AuthContext } from "@context/AuthContext";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
const db = getFirestore();
import {
  updateProfile,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// TODO: Incomplete Functionalities and Validation

function SignUp() {
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);
  const [user, loading] = useAuthState(auth);
  const [profileImage, setProfileImage] = useState(null);

  const uploadProfileImage = async (file, userUid) => {
    const storage = getStorage();
    const storageRef = ref(storage, `profile_images/${userUid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const recaptchaVerifierRef = useRef(null);
  const [error, setError] = useState(false);

  const handleSignUp = (e) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    signUp(auth, email, password)
      .then(async (userCredential) => {
        setError(false);
        const user = userCredential.user;
        dispatch({ type: "SIGNUP", payload: user });

        ///////////////////////////////////////////////////////////////////////////////////////
        // email verification
        await sendEmailVerification(user);

        const displayName = `${firstName} ${lastName}`;
        await updateProfile(user, { displayName });

        let photoURL = "";
        if (profileImage) {
          photoURL = await uploadProfileImage(profileImage, user.uid);
        } else {
          photoURL = "/user.png";
        }

        const userData = {
          firstName,
          lastName,
          email,
          phone,
          photoURL,
          isVerified: user.emailVerified,
        };

        await setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName,
          displayName,
          email,
          photoURL,
          emailVerified: false,
        });

        router.push("/");
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(true);
        console.log(errorMessage);
      });
  };

  return (
    <>
      <MainLayout>
        <div className="mt-4">
          <section className="bg-white">
            <div className="lg:grid lg:min-h-[93vh] lg:grid-cols-12">
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
                    <span className="sr-only">Sign Up Page</span>
                    <span className="self-center text-xl font-semibold whitespace-nowrap">
                      Synth
                    </span>
                  </Link>

                  <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                    Join Synth today 🎵
                  </h1>

                  <p className="mt-4 leading-relaxed text-gray-500">
                    Create your Synth account and start exploring a world of
                    music. <br />
                    Sign up with your email and password today!
                  </p>

                  <div ref={recaptchaVerifierRef} className="invisible">
                    <div id="recaptcha-container"></div>
                  </div>

                  <form
                    action="#"
                    onSubmit={handleSignUp}
                    className="mt-8 grid grid-cols-6 gap-6"
                  >
                    <div className="col-span-6">
                      <label
                        htmlFor="ProfileImage"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Profile Image
                      </label>
                      <input
                        type="file"
                        id="ProfileImage"
                        name="profileImage"
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="FirstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        id="FirstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="LastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        id="LastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                        required
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="Email"
                        className="block text-sm font-medium text-gray-700"
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

                    <div className="col-span-6">
                      <label
                        htmlFor="Phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <input
                        id="Phone"
                        name="phone"
                        type="tel"
                        placeholder="123-456-7890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="Password"
                        className="block text-sm font-medium text-gray-700"
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

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        for="PasswordConfirmation"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Password Confirmation
                      </label>

                      <input
                        type="password"
                        id="PasswordConfirmation"
                        name="passwordConfirmation"
                        placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                        value={passwordConfirmation}
                        onChange={(e) =>
                          setPasswordConfirmation(e.target.value)
                        }
                        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                      {error && <p style={{ color: "red" }}>{error}</p>}
                      <button
                        className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                        type="submit"
                      >
                        Sign Up
                      </button>

                      <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                        <span>Already have an account? </span>
                        <Link href="/login" passHref>
                          Log In
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </main>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
}

export default SignUp;
