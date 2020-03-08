import firebase from "firebase/app"
import "firebase/database"
import "firebase/storage"

var firebaseConfig = {
    apiKey: "AIzaSyDbwck1s6siv4l-hwqrRbkvJ_Gu1pQstqY",
    authDomain: "ar-gallery-test.firebaseapp.com",
    databaseURL: "https://ar-gallery-test.firebaseio.com",
    projectId: "ar-gallery-test",
    storageBucket: "ar-gallery-test.appspot.com",
    messagingSenderId: "527978315902",
    appId: "1:527978315902:web:3cc2871507585163e8d82f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const AppDB = firebase.database();
const Storage = firebase.storage();
export { AppDB, Storage };
