import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyATA9ZEMrDB9GhAZnMYUNDGmzhHh_qLsM0",
    authDomain: "dify-2117a.firebaseapp.com",
    projectId: "dify-2117a",
    storageBucket: "dify-2117a.firebasestorage.app",
    messagingSenderId: "435851673543",
    appId: "1:435851673543:web:e00fc631755a7625ee63e2",
    measurementId: "G-TBZ8JNY7CB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
