// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmc21jsVFmT9QNsgwqIAEU_21m9bp7usY",
  authDomain: "islandgame-9d369.firebaseapp.com",
  projectId: "islandgame-9d369",
  storageBucket: "islandgame-9d369.firebasestorage.app",
  messagingSenderId: "684607656866",
  appId: "1:684607656866:web:cfa5c31bbce784d4e958fb",
  measurementId: "G-V521HE535G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence for Firestore
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required for persistence
      console.log('Persistence not supported by this browser');
    }
  });

console.log('Firebase initialized');
