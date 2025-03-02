import { initializeApp, getApps, getApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyAVQvlkL3uQE3B-CE_MvhTvfLDZrgEcsjg",
    authDomain: "momentum-f7245.firebaseapp.com",
    projectId: "momentum-f7245",
    storageBucket: "momentum-f7245.firebasestorage.app",
    messagingSenderId: "588238324245",
    appId: "1:588238324245:web:694d1de1d9ea51996cc41c"
};

// Initialising firebase and firebase authentication
// const app = initializeApp(firebaseConfig);
// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage)
// })

// https://github.com/firebase/firebase-js-sdk/discussions/4510#discussioncomment-5080526
let app, auth;

if (!getApps().length) {
    try {
        app = initializeApp(firebaseConfig);
        auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
        });
    } catch (error) {
        console.log("Error initializing app: " + error);
    }
} else {
    app = getApp();
    auth = getAuth(app);
}

export {auth}