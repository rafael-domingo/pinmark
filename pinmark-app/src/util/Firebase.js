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
    apiKey: "AIzaSyDnnqxI5KBRsJIeBDbkzOenxsO-8oowxhc",
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
        console.log(user);
        const q = query(collection(db, "users"), where("uid", "==", user.uid)); // check to see whether user already exists
        const docs = await getDocs(q);
        // check docs.docs.length to see if nothing is returned -- means that the user doesn't exist, so need to add a new account
        if (docs.docs.length === 0) {
            await addDoc(collection(db, "users"), {
                uid: user.uid,
                name: user.displayName,
                authProvider: 'google',
                email: user.email,                
            });
        }
    } catch(error) {
        console.log(`Google Auth Error: ${error}`);
    }
}

// Check user is sign in 
export const checkUser = async () => {
    const user = auth.currentUser;
    if (user) {
        console.log('user is signed in')
    } else {
        console.log('user is not signed in')
    }
}


// Sign user out 
export const signUserOut = async() => {
    signOut(auth).then(response => console.log(response));
}