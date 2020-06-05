import firebase from "firebase/app"
import "firebase/database"
import "firebase/storage"
import "firebase/auth"

var firebaseConfig = {
    apiKey: "AIzaSyAwCbc1benTG0f4ZqcVBRGzn0WzE4MNCFU",
    authDomain: "arearth-6503b.firebaseapp.com",
    databaseURL: "https://arearth-6503b.firebaseio.com/",
    projectId: "arearth-6503b",
    storageBucket: "arearth-6503b.appspot.com",
    messagingSenderId: "932369438684",
    appId: "1:932369438684:web:8028dac6cf1ef0e517e119"
};
firebase.initializeApp(firebaseConfig);

const AppDB = firebase.database();
const Storage = firebase.storage();
const AppAuth = firebase.auth();

export { AppDB, Storage, AppAuth };
