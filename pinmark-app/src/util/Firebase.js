import {
    initializeApp
} from 'firebase/app';
import {
    GoogleAuthProvider, 
    getAuth, 
    signInWithPopup,
    signOut
} from 'firebase/auth';
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "heroic-glyph-345202.firebaseapp.com",
    projectId: "heroic-glyph-345202",
    storageBucket: "heroic-glyph-345202.appspot.com",
    messagingSenderId: "1049387159304",
    appId: "1:1049387159304:web:19af752559e90fd07ce6bd",
    measurementId: "G-4NEZ5FVQ0M"
};

// intialize app and declare firebase variables
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Sign in with  Google
const provider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, provider);
        const user = res.user;       
        return user;
    } catch(error) {
        console.log(`Google Auth Error: ${error}`);
    }    
}

// Check user is sign in 
export const checkUser = async () => {
    const user = auth.currentUser;
    if (user) {
        return user;
        console.log('user is signed in')
    } else {
        console.log('user is not signed in')
    }
}


// Sign user out 
export const signUserOut = async() => {
    signOut(auth).then(response => console.log(response));
}