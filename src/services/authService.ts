import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// Helper function to check if email exists
const checkEmailExists = async (email: string): Promise<boolean> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email.toLowerCase()));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// ✨ Signup: Create Auth user + Save user info in Firestore
export const signup = async (email: string, password: string, fullName: string, role: string) => {
  // Check if email already exists
  const emailExists = await checkEmailExists(email);
  if (emailExists) {
    throw new Error("An account with this email already exists.");
  }

  // Create the user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Save user data in Firestore
  await setDoc(doc(db, "users", user.uid), {
    fullName,
    email: email.toLowerCase(), // Store email in lowercase for consistency
    role,
    createdAt: new Date(),
  });
};

// ✨ Login: Sign in and fetch user data (fullName, email, role)
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    return userDoc.data(); // { fullName, email, role }
  } else {
    throw new Error("No user profile found in database.");
  }
};

// ✨ Google Sign In (popup)
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// ✨ Forgot Password: Send reset email
export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// ✨ Logout
export const logout = async () => {
  return signOut(auth);
};
