import * as firebase from 'firebase';

firebase.initializeApp({
    authDomain: "upload-photos-to-mansory.firebaseapp.com",
    databaseURL: "https://upload-photos-to-mansory.firebaseio.com",
    apiKey: "AIzaSyAR4lli8h6duFUefebMo6oQ9D1e0QF_Ge0",
    messengerSenderId: "787414860998",
    storageBucket: "upload-photos-to-mansory.appspot.com",
});


import {MyApp} from './my-app'; MyApp.register();
import {PhotosGrid} from './photos-grid'; PhotosGrid.register();
import {FirebaseStorageUpload} from './firebase-storage-uploader'; FirebaseStorageUpload.register();

