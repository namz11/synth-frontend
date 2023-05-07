import MainLayout from "@components/layouts/main-layout";
import React, { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { auth, signUp } from "@utils/firebase";
import { AuthContext } from "@context/AuthContext";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDoc,
  updateDoc,
} from "firebase/firestore";
const db = getFirestore();
import {
  updateProfile,
  sendEmailVerification,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  checkFirstName,
  checkLastName,
  checkEmail,
  validateImageInput,
  checkPassword,
} from "@utils/helpers";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// TODO: Incomplete Functionalities and Validation

function SignUp() {
  const router = useRouter();
  const { dispatch } = useContext(AuthContext);
  const [user, loading] = useAuthState(auth);
  const [profileImage, setProfileImage] = useState(null);
  const [dob, setDob] = useState(new Date());

  const uploadProfileImage = async (file, userUid) => {
    if (!file || !userUid) {
      console.log("Invalid parameters passed");
    }

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
      if (user && user.emailVerified) {
        router.push("/");
      }
    }
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const recaptchaVerifierRef = useRef(null);
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [weakPassword, setWeakPassword] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
  const [firstnameError, setFirstnameError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [signupError, setSignupError] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [verificationAlertModal, setVerificationAlertModal] = useState(false);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthYear = new Date(dob).getFullYear();
    const birthMonth = new Date(dob).getMonth();
    const month = today.getMonth() - birthMonth;
    let age = today.getFullYear() - birthYear;
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age;
  };

  // for handling email verification modal
  const closeVerificationAlertModal = () => {
    setVerificationAlertModal(false);
    router.push("/auth/login");
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    // Image Error Management
    if (profileImage) {
      try {
        const imageTest = validateImageInput(profileImage);
      } catch (e) {
        setImageError(e);
        return;
      }
      console.log("Success Most Probably");
    }
    if (imageError !== false) {
      setImageError(false);
    }

    // Firstname Error Management
    try {
      const firstNameTest = checkFirstName(firstName);
    } catch (e) {
      setFirstnameError(e);
      return;
    }
    if (firstnameError !== false) {
      setFirstnameError(false);
    }

    // Lastname Error Management
    try {
      const lastNameTest = checkLastName(lastName);
    } catch (e) {
      setLastnameError(e);
      return;
    }
    if (lastnameError !== false) {
      setLastnameError(false);
    }

    // Email Error Management
    try {
      const emailTest = checkEmail(email);
    } catch (e) {
      setEmailError(e);
      return;
    }
    if (emailError !== false) {
      setEmailError(false);
    }

    // Password Error Management
    if (password !== passwordConfirmation) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordError !== false) {
      setPasswordError(false);
    }

    try {
      const passwordTest = checkPassword(password);
    } catch (e) {
      console.log(e);
      console.log(password);
      setSignupError(
        "The password is too weak. Please choose a stronger password."
      );
      setSignupModal(true);
      setWeakPassword(true);
      return;
    }

    if (weakPassword !== false) {
      setWeakPassword(false);
    }

    // Date Error Management
    if (calculateAge(dob) < 13) {
      setDateError(
        "We're sorry, but you must be at least 13 years old in order to use our services."
      );
      return;
    }
    if (dateError !== false) {
      setDateError(false);
    }

    signUp(auth, email, password)
      .then(async (userCredential) => {
        setError(false);
        const user = userCredential.user;
        dispatch({ type: "SIGNUP", payload: user });

        // email verification
        await sendEmailVerification(user);

        const displayName = `${firstName} ${lastName}`;
        await updateProfile(user, { displayName });

        let photoURL = "";
        if (profileImage && user.uid) {
          try {
            photoURL = await uploadProfileImage(profileImage, user.uid);
          } catch (error) {
            console.error("Error while uploading the profile image", error);
          }
        } else {
          photoURL = "/user.png";
        }

        await signOut(auth);
        setVerificationAlertModal(true);

        try {
          await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            displayName,
            dateOfBirth: new Date(dob),
            email,
            photoURL,
            emailVerified: false,
            tracks: [],
          });
          console.log("The above code got fired?");
        } catch (error) {
          console.error("Error while saving user data to Firestore:", error);
        }
      })
      .catch((error) => {
        const errorMessage = error.code;
        switch (errorMessage) {
          case "auth/email-already-in-use":
            setSignupError(
              "The email address is already in use. Please sign in or use a different email."
            );
            break;
          case "auth/invalid-email":
            setSignupError(
              "Invalid email format. Please enter a valid email address."
            );
            break;
          case "auth/operation-not-allowed":
            setSignupError(
              "Email and password accounts are not enabled. Please contact our support team for assistance."
            );
            break;
          case "auth/weak-password":
            setSignupError(
              "The password is too weak. Please choose a stronger password."
            );
            setWeakPassword(true);
            break;
          default:
            setSignupError(
              "An unexpected error occurred. Please try again later."
            );
            console.log(error);
        }
        setSignupModal(true);
      });
  };

  return (
    <>
      <div>
        <section className="bg-slate-900">
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
              className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:py-12 lg:px-16 xl:col-span-6 bg-slate-900"
            >
              <div className="max-w-xl lg:max-w-3xl">
                <Link href="/" passHref>
                  <span className="self-center text-xl text-white font-semibold whitespace-nowrap">
                    Synth
                  </span>
                </Link>

                <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                  Join Synth today 🎵
                </h1>

                <p className="mt-4 leading-relaxed text-blue-300">
                  Create your Synth account and start exploring a world of
                  music. <br />
                  Sign up with your email and password today!
                </p>

                <form
                  action="#"
                  onSubmit={handleSignUp}
                  className="mt-8 grid grid-cols-6 gap-6 bg-slate-900"
                >
                  <div className="col-span-6">
                    <label
                      htmlFor="ProfileImage"
                      className="block text-sm font-medium text-cyan-200"
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
                    {imageError && (
                      <p className="text-pink-500 font-medium text-sm mt-2">
                        {imageError}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="FirstName"
                      className="block text-sm font-medium text-cyan-200"
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
                    <br />
                    {firstnameError && (
                      <p className="text-pink-500 font-medium text-sm mt-2">
                        {firstnameError}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="LastName"
                      className="block text-sm font-medium text-cyan-200"
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
                    <br />
                    {lastnameError && (
                      <p className="text-pink-500 font-medium text-sm mt-2">
                        {lastnameError}
                      </p>
                    )}
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="DateOfBirth"
                      className="block text-sm font-medium text-cyan-200"
                    >
                      Date of Birth
                    </label>
                    <DatePicker
                      className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      selected={dob}
                      onChange={(date) => setDob(date)}
                      maxDate={new Date()}
                      minDate={
                        new Date(
                          `${new Date().getMonth()}/${new Date().getDate()}/${
                            new Date().getFullYear() - 150
                          }`
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      isClearable
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown={true}
                      yearDropdownItemNumber={150}
                      scrollableMonthYearDropdown
                      closeCalendar
                      required={true}
                      aria-label="Date of Birth"
                    />
                    {dateError && (
                      <p className="text-pink-500 font-medium text-sm mt-2">
                        {dateError}
                      </p>
                    )}
                  </div>
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
                    <br />
                    {emailError && (
                      <p className="text-pink-500 font-medium text-sm mt-2">
                        {emailError}
                      </p>
                    )}
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

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="PasswordConfirmation"
                      className="block text-sm font-medium text-cyan-200"
                    >
                      Password Confirmation
                    </label>

                    <input
                      type="password"
                      id="PasswordConfirmation"
                      name="passwordConfirmation"
                      placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                      required
                    />
                    <br />
                    {passwordError && (
                      <p className="text-pink-500 font-medium text-sm mt-2">
                        {passwordError}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                    <button
                      className="inline-block shrink-0 rounded-md border border-pink-600 bg-pink-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-pink-300 focus:outline-none focus:ring active:text-pink-400"
                      type="submit"
                    >
                      Sign Up
                    </button>

                    <p className="mt-4 text-sm text-blue-300 sm:mt-0">
                      <span>Already have an account? </span>
                      <Link
                        className="text-pink-500 hover:text-indigo-100 cursor-pointer"
                        href="/auth/login"
                        passHref
                      >
                        Log In
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
      {signupModal && signupError && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:p-8">
            <div className="text-center">
              <div className="mt-4">
                <h2 className="text-lg font-medium text-gray-900">Oops!</h2>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">{signupError}</div>
                </div>
                {weakPassword && (
                  <div className="text-gray-900 text-sm mt-4">
                    Make sure your password meets the following requirements:
                    <ul className="text-sm text-gray-500 list-inside list-disc text-left">
                      <li className="ml-1 mt-1">
                        Must be at least 6 characters long
                      </li>
                      <li className="ml-1 mt-1">
                        Must contain at least one uppercase letter
                      </li>
                      <li className="ml-1 mt-1">
                        Must contain at least one lowercase letter
                      </li>
                      <li className="ml-1 mt-1">
                        Must contain at least one number
                      </li>
                      <li className="ml-1 mt-1">
                        Must contain at least one special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:w-auto sm:text-sm"
                onClick={() => {
                  setSignupModal(false);
                  setSignupError(false);
                  setWeakPassword(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {verificationAlertModal && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:p-8">
            <div className="text-center">
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Welcome to Synth!
                </h3>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">
                    Get ready! A verification email is coming your way. Click
                    the link to unlock endless bangers and dive into the
                    ultimate music experience!
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:w-auto sm:text-sm"
                onClick={closeVerificationAlertModal}
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

export default SignUp;
