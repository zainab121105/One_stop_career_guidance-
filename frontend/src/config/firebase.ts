import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB8GASMo1Qp9E57uiZNf8rNKcb1ZHWUtXA",
  authDomain: "genai-exchange-hackathon-97263.firebaseapp.com",
  projectId: "genai-exchange-hackathon-97263",
  storageBucket: "genai-exchange-hackathon-97263.appspot.com",
  messagingSenderId: "923600432439",
  appId: "1:923600432439:web:1af24e442a712f760afeb2",
  measurementId: "G-1ZHHD2L01S"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export const googleProvider = new GoogleAuthProvider();