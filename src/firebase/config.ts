import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBn_UjiMdjjAtUTl0nbt8oizD6a-iNAwKw",
    authDomain: "dev-797d5.firebaseapp.com",
    projectId: "dev-797d5",
    storageBucket: "dev-797d5.firebasestorage.app",
    messagingSenderId: "844148405023",
    appId: "1:844148405023:web:ed3efee9998619f55ab62a",
    measurementId: "G-WH7FK9Z4TB"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
