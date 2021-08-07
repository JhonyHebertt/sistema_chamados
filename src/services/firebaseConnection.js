import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

let firebaseConfig = {
  apiKey: "AIzaSyBKiq6ViUH4mqFLWT6faGnpWK2sQw4OH9U",
  authDomain: "sistema-crm-4c419.firebaseapp.com",
  projectId: "sistema-crm-4c419",
  storageBucket: "sistema-crm-4c419.appspot.com",
  messagingSenderId: "381712098275",
  appId: "1:381712098275:web:6e0bd58a335967b5daf6d6",
  measurementId: "G-VC3VS912CW"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;