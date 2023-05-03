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
import { updateProfile, sendEmailVerification, signOut } from "firebase/auth";
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
  const recaptchaVerifierRef = useRef(null);
  const [error, setError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
  const [firstnameError, setFirstnameError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [signupError, setSignupError] = useState(false);
  const [signupModal, setSignupModal] = useState(false);

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
        if (profileImage) {
          photoURL = await uploadProfileImage(profileImage, user.uid);
        } else {
          photoURL = "/user.png";
        }

        await signOut(auth);

        try {
          await setDoc(doc(db, "users", user.uid), {
            firstName,
            lastName,
            displayName,
            dateOfBirth: new Date(dob),
            email,
            photoURL,
            emailVerified: false,
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
            break;
          default:
            setSignupError(
              "An unexpected error occurred. Please try again later."
            );
        }
        setSignupModal(true);
      });
  };

  return (
    <>
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
                    {imageError && <p style={{ color: "red" }}>{imageError}</p>}
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
                    <br />
                    {firstnameError && (
                      <p style={{ color: "red" }}>{firstnameError}</p>
                    )}
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
                    <br />
                    {lastnameError && (
                      <p style={{ color: "red" }}>{lastnameError}</p>
                    )}
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="DateOfBirth"
                      className="block text-sm font-medium text-gray-700"
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
                            new Date().getFullYear() - 100
                          }`
                        )
                      }
                      dateFormat="MM/dd/yyyy"
                      isClearable
                      showYearDropdown
                      scrollableMonthYearDropdown
                      closeCalendar
                      required={true}
                    />
                    {dateError && <p style={{ color: "red" }}>{dateError}</p>}
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
                    <br />
                    {emailError && <p style={{ color: "red" }}>{emailError}</p>}
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
                      htmlFor="PasswordConfirmation"
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
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                      required
                    />
                    <br />
                    {passwordError && (
                      <p style={{ color: "red" }}>{passwordError}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                    <button
                      className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                      type="submit"
                    >
                      Sign Up
                    </button>

                    <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                      <span>Already have an account? </span>
                      <Link href="/auth/login" passHref>
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
      {signupModal && signupError && (
        <div className="fixed z-10 inset-0 flex items-center justify-center overflow-y-auto">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg sm:p-8">
            <div className="text-center">
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">Oops!</h3>
                <div className="mt-2">
                  <div className="text-sm text-gray-500">{signupError}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-pink-600 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:w-auto sm:text-sm"
                onClick={() => {
                  setSignupModal(false);
                  setSignupError(false);
                }}
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
