import MainLayout from "@components/layouts/main-layout";
import React, { useEffect, useState, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
// TODO aman - fix this import - there is no updateEmail oor updatePassword
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
const db = getFirestore();

const Profile = () => {
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
  const [errorMessage, setErrorMessage] = useState("");
  const [isGoogleProvider, setIsGoogleProvider] = useState(false);
  const router = useRouter();

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

  const handleEditClick = () => {
    setEditing(true);
    console.log(photo);
    console.log(user.photoURL);
  };

  const { dispatch } = useContext(AuthContext);
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Successfully Logged Out!");
        dispatch({ type: "LOGOUT" });
        router.push("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSaveClick = async () => {
    let updatedPhotoURL = photo || user.photoURL || "/user.png";
    console.log(updatedPhotoURL);
    if (photoChanged) {
      updatedPhotoURL = await uploadProfileImage(photo, user.uid);
      await updateProfile(user, { photoURL: updatedPhotoURL });
      setPhoto(updatedPhotoURL);
    } else {
      user.photoURL;
    }
    console.log(updatedPhotoURL);

    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
        firstName,
        lastName,
        photoURL: updatedPhotoURL,
      });

      if (password) {
        if (password === passwordConfirmation) {
          await updatePassword(user, password);
        } else {
          setErrorMessage("Error: Passwords do not match");
          return;
        }
      }

      setEditing(false);
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MainLayout>
        <div className="max-w-xl lg:max-w-3xl mx-auto py-8">
          <img
            className="w-24 h-24 mb-6 mx-auto rounded-full object-cover"
            src={user ? photo || user.photoURL || "/user.png" : "/user.png"}
            alt="User"
          />
          {editing ? (
            <>
              <div className="mb-4">
                <label
                  htmlFor="Photo"
                  className="block text-white text-lg font-bold mb-2"
                >
                  Profile Photo:
                </label>
                <input
                  type="file"
                  id="Photo"
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="w-full text-white bg-blue-700 rounded py-2 px-4"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="FirstName"
                  className="block text-white text-lg font-bold mb-2"
                >
                  First Name:
                </label>
                <input
                  type="text"
                  id="FirstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-white bg-blue-700 rounded py-2 px-4"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="LastName"
                  className="block text-white text-lg font-bold mb-2"
                >
                  Last Name:
                </label>
                <input
                  type="text"
                  id="LastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-white bg-blue-700 rounded py-2 px-4"
                />
              </div>
              {!isGoogleProvider && (
                <>
                  <div className="mb-4">
                    <label
                      htmlFor="Password"
                      className="block text-white text-lg font-bold mb-2"
                    >
                      New Password:
                    </label>
                    <input
                      type="password"
                      id="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-gray-700 bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      for="PasswordConfirmation"
                      className="block text-white text-lg font-bold mb-2"
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
                  </div>
                </>
              )}
              {errorMessage && (
                <div className="text-red-500 mt-2">{errorMessage}</div>
              )}
              <button
                onClick={handleSaveClick}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded transition hover:bg-blue-500 focus:outline-none focus:ring"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <h3 className="text-white text-xl font-bold mb-6">
                Email: {email}
              </h3>
              <button
                onClick={handleEditClick}
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded transition hover:bg-blue-500 focus:outline-none focus:ring"
              >
                Edit
              </button>

              <div className="flex items-center mt-4 lg:mt-0">
                <button
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded transition hover:bg-blue-500 focus:outline-none focus:ring"
                  aria-label="show notifications"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default withAuth(Profile);
