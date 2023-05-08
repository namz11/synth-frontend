import MainLayout from "@components/layouts/main-layout";
import React, { useEffect, useState, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth } from "@utils/firebase";
import { useRouter } from "next/router";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { updateProfile, updatePassword, signOut, getAuth } from "firebase/auth";
import { AuthContext } from "@context/AuthContext";
import withAuth from "@components/withAuth";
import {
  checkFirstName,
  checkLastName,
  validateImageInput,
} from "@utils/helpers";
import Loader from "@components/loader/loader";

const db = getFirestore();

const Profile = () => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [userId, setUserId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [photo, setPhoto] = useState(user.photoURL);
  const [photoChanged, setPhotoChanged] = useState(false);
  const [isGoogleProvider, setIsGoogleProvider] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [lastnameError, setLastnameError] = useState(false);
  const [firstnameError, setFirstnameError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

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

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      setPhotoFile(URL.createObjectURL(e.target.files[0]));
      setPhotoChanged(true);
    }
  };

  // For changing the value of display name when the valuye of the first name or last name changes.
  useEffect(() => {
    setDisplayName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email);

        const googleProvider = user.providerData.some(
          (provider) => provider.providerId === "google.com"
        );
        setIsGoogleProvider(googleProvider);

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setDisplayName(userData.displayName);
            setPhoto(userData.photoURL);
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      } else {
        router.push("/");
      }
    };

    fetchUserData();
  }, [router, user]);

  useEffect(() => {
    return () => {
      if (photo && photoChanged) {
        URL.revokeObjectURL(photoFile);
      }
    };
  }, [photoFile, photoChanged, photo]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const { dispatch } = useContext(AuthContext);
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        dispatch({ type: "LOGOUT" });
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSaveClick = async () => {
    let updatedPhotoURL = photo || user.photoURL || "/user.png";

    if (photoChanged) {
      updatedPhotoURL = await uploadProfileImage(photo, user.uid);
      await updateProfile(user, { photoURL: updatedPhotoURL });
      setPhoto(updatedPhotoURL);
      setPhotoFile(updatedPhotoURL);
    } else {
      user.photoURL;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
        firstName,
        lastName,
        photoURL: updatedPhotoURL,
      });

      // Image Error Management
      if (photo && photoChanged) {
        try {
          const imageTest = validateImageInput(photo);
        } catch (e) {
          setImageError(e);
          return;
        }
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

      // Password Error Management
      if (password) {
        if (password === passwordConfirmation) {
          await updatePassword(user, password);
        } else {
          setPasswordError("Passwords do not match");
          return;
        }
      }
      if (passwordError !== false) {
        setPasswordError(false);
      }

      setEditing(false);
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  return (
    <>
      <MainLayout allowPlayer={false}>
        <div className="bg-slate-900 flex items-center justify-center px-5 py-5">
          <div
            className="bg-slate-900 text-white rounded-3xl w-full overflow-hidden"
            style={{ maxWidth: "1000px" }}
          >
            <div className="md:flex w-full items-center">
              <div className="block w-1/2 bg-slate-900 mx-auto md:mx-0 mt-4 md:mt-0">
                <img
                  className="w-64 h-64 mb-6 mx-auto rounded-full object-cover"
                  src={
                    user
                      ? photoFile || photo || user.photoURL || "/user.png"
                      : "/user.png"
                  }
                  alt="User Avatar"
                />
              </div>
              <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                {editing ? (
                  <>
                    <div className="text-center mb-10">
                      <h1 className="font-bold text-3xl text-white">
                        Edit Profile
                      </h1>
                      <p className="text-blue-300 mt-2">
                        Update your information below
                      </p>
                    </div>
                    <div>
                      <label
                        htmlFor="Photo"
                        className="block text-cyan-300 text-sm font-medium mb-2 mt-3"
                      >
                        Profile Photo:
                      </label>
                      <input
                        type="file"
                        id="Photo"
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="w-full text-gray-900 bg-white rounded py-2 px-4"
                      />
                      {imageError && (
                        <p className="text-pink-500 font-medium text-sm mt-2">
                          {imageError}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="FirstName"
                        className="block text-cyan-300 text-sm font-medium mb-2 mt-3"
                      >
                        First Name:
                      </label>
                      <input
                        type="text"
                        id="FirstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full text-gray-900 bg-white rounded py-2 px-4"
                      />
                      <br />
                      {firstnameError && (
                        <p className="text-pink-500 font-medium text-sm mt-2">
                          {firstnameError}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="LastName"
                        className="block text-cyan-300 text-sm font-medium mb-2 mt-3"
                      >
                        Last Name:
                      </label>
                      <input
                        type="text"
                        id="LastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full text-gray-900 bg-white rounded py-2 px-4"
                      />
                      <br />
                      {lastnameError && (
                        <p className="text-pink-500 font-medium text-sm mt-2">
                          {lastnameError}
                        </p>
                      )}
                    </div>
                    {!isGoogleProvider && (
                      <>
                        <div className="mb-4">
                          <label
                            htmlFor="Password"
                            className="block text-cyan-300 text-sm font-medium mb-2 mt-3"
                          >
                            New Password:
                          </label>
                          <input
                            type="password"
                            id="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-gray-900 bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="PasswordConfirmation"
                            className="block text-cyan-300 text-sm font-medium mb-2 mt-3"
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
                            className="block w-full px-4 py-2 mt-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                            required
                          />
                        </div>
                        {passwordError && (
                          <p className="text-pink-500 font-medium text-sm mt-2">
                            {passwordError}
                          </p>
                        )}
                      </>
                    )}
                    <button
                      onClick={handleSaveClick}
                      className="w-full bg-pink-600 text-white font-bold py-2 px-4 rounded transition hover:bg-pink-500 focus:outline-none focus:ring mt-6"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-10">
                      <h1 className="font-bold text-3xl text-white">Profile</h1>
                      <p className="text-blue-300 mt-2">Your information </p>
                    </div>
                    <div>
                      <div className="text-cyan-300 text-md font-medium mb-6">
                        Email: {email}
                      </div>
                      <div className="text-cyan-300 text-md font-medium mb-6">
                        First Name: {firstName}
                      </div>
                      <div className="text-cyan-300 text-md font-medium mb-6">
                        Last Name: {lastName}
                      </div>
                      <button
                        onClick={handleEditClick}
                        className="w-full my-3 bg-pink-600 text-white font-bold py-2 px-4 rounded transition hover:bg-pink-400 focus:outline-none focus:ring"
                      >
                        Edit
                      </button>
                      <div className="flex items-center mt-4 lg:mt-0">
                        <button
                          className="w-full bg-pink-600 text-white font-bold py-2 px-4 rounded transition hover:bg-pink-400 focus:outline-none focus:ring"
                          aria-label="Logout"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default withAuth(Profile);
