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
    setDoc,
    doc
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
        signInWithPopup(auth, provider).then((res) => {
            // TODO: Need to add functionality to check whether user already exists
            // add user to firestore 
            setDoc(doc(db, "users", res.user.uid), {
                userName: res.user.displayName,
                email: res.user.email,
                phone: res.user.phoneNumber,
                profilePicture: res.user.photoURL,
                uid: res.user.uid,
                authType: 'google'
            })                                  
        })
    } catch(error) {
        console.log(`Google Auth Error: ${error}`);
    }    
}

// Check user is sign in 
export const checkUser = async () => {
    const user = auth.currentUser;
    if (user) {
        console.log('user is signed in')
        return user;        
    } else {
        console.log('user is not signed in')
    }
}

// Sign user out 
export const signUserOut = async() => {
    signOut(auth).then(response => console.log(response));
}

// Add 