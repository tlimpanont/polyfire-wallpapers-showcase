"use strict";
var firebase = require('firebase');
firebase.initializeApp({
    authDomain: "upload-photos-to-mansory.firebaseapp.com",
    databaseURL: "https://upload-photos-to-mansory.firebaseio.com",
    apiKey: "AIzaSyAR4lli8h6duFUefebMo6oQ9D1e0QF_Ge0",
    messengerSenderId: "787414860998",
    storageBucket: "upload-photos-to-mansory.appspot.com",
});
var my_app_1 = require('./my-app');
my_app_1.MyApp.register();
var photos_grid_1 = require('./photos-grid');
photos_grid_1.PhotosGrid.register();
var firebase_storage_uploader_1 = require('./firebase-storage-uploader');
firebase_storage_uploader_1.FirebaseStorageUpload.register();
