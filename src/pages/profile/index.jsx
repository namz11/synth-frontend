import MainLayout from "@components/layouts/main-layout";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, updateEmail, updatePassword } from "../../firebase";
import { useRouter } from "next/router";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const db = getFirestore();
import withAuth from "../../components/withauth";

const profile = () => {
  const [user, loading] = useAuthState(auth);
  const [userId, setUserId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email);

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirstName(userData.firstName);
            setLastName(userData.lastName);
            setDisplayName(userData.displayName);
          }
        } catch (error) {
          console.log("Error fetching user data:", error);
        }
      } else {
        router.push("/");
      }
    };

    fetchUserData();
  }, [user]);

  const handleEditGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const userEmail = auth.currentUser?.email;
    if (!userEmail) {
      // Handle Case
      return;
    }

    provider.setCustomParameters({
      login_hint: userEmail, // Pre-fill email
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        window.open(
          `https://myaccount.google.com/personal-info?hl=en&authuser=${user.email}`,
          "_blank"
        );
      } else {
        // TODO Handle Case
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleEditClick = () => {
    if (user.providerData[0].providerId === "google.com") {
      handleEditGoogle();
    } else {
      setEditing(true);
    }
  };

  const handleSaveClick = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        displayName,
        firstName,
        lastName,
      });

      if (password) {
        await updatePassword(user, password);
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
        <div className="max-w-xl lg:max-w-3xl">
          <h1>Hey, this is the user profile</h1>
          <img
            src={user ? user.photoURL || "/user.png" : "/user.png"}
            alt="User"
          />
          {editing ? (
            <>
              <div>
                <label htmlFor="FirstName">First Name:</label>
                <input
                  type="text"
                  id="FirstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="LastName">Last Name:</label>
                <input
                  type="text"
                  id="LastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="Password">New Password:</label>
                <input
                  type="password"
                  id="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring"
                />
              </div>
              <button
                onClick={handleSaveClick}
                className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 mt-4 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <h3>Email: {email}</h3>
              <button
                onClick={handleEditClick}
                className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 mt-4 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default withAuth(profile);
