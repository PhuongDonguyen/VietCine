import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider
} from 'firebase/auth';

// Your Firebase configuration object from the Firebase Console
const firebaseConfig = {
    apiKey: import.meta.env._FIREBASE_API_KEY,
    authDomain: import.meta.env._FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env._FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env._FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env._FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env._FIREBASE_APP_ID
};

// console.log("firebase apikey:", import.meta.env.REACT_APP_FIREBASE_API_KEY);
console.log("server api:", import.meta.env.VITE_SERVER_API_URL);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and set up the Google provider
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

export { auth, googleProvider, facebookProvider, twitterProvider };