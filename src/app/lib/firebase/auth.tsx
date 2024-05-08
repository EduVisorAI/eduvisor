import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
} from "firebase/auth";
import { auth } from "./firebase";

export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result;
};

export const doSignOut = async () => {
  return auth.signOut();
};

export const doPasswordReset = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = async (password: string) => {
  const user = auth.currentUser;
  if (user) {
    return updatePassword(user, password);
  }
  throw new Error("User is not authenticated.");
};

export const doSendEmailVerification = async () => {
  const user = auth.currentUser;
  if (user) {
    return sendEmailVerification(user, {
      url: `${window.location.protocol}//${window.location.host}/login`,
    });
  }
  throw new Error("User is not authenticated.");
};
