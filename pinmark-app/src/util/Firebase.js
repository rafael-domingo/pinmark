import {
    initializeApp
} from 'firebase/app';
import {
    GoogleAuthProvider, 
    getAuth, 
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,    
} from 'firebase/auth';
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    setDoc,
    doc,
    updateDoc,
    getDoc
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
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

// fetch user by email
export const fetchUserInfo = async () => {
    const userList = await getDocs(collection(db, "users"))
    const userArray = [];
    userList.forEach((doc) => {        
        userArray.push(doc.data());        
    })
    return userArray;
}


// Sign in with email/password
export const signInWithEmail = async (registering, email, password) => {   
        
    // check with sign-in methods have been performed -- useful for people who have signed in with google/facebook and try to sign in with email 
   var signInMethods = [];
    return fetchSignInMethodsForEmail(auth, email).then(result => {
    console.log(result)
    signInMethods = result;
    // placed firebase call inside fetchSignInMethodsForEmail to wait for that method to finish
    // // check if 'registering' or 'signing in'
    if (registering) {           
        return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('registering');
            // signed in
            const user = userCredential.user;
            setDoc(doc(db, "users", user.uid), {
                userName: user.displayName,
                email: user.email,
                phone: user.phoneNumber,
                profilePicture: user.photoURL,
                uid: user.uid,
                authType: 'email'
            })     
            console.log(user);
            return user;
        })
        .catch((error) => {
            console.log(error.code)
            console.log(signInMethods)
            return error.code;
            
            
        })
    } else {
        return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // signed in
            const user = userCredential.user;
            console.log(user);
            return user;
        })
        .catch((error) => {            
            console.log(error.code)            
            if (signInMethods.includes('google.com',0) && error.code == 'auth/wrong-password') {
                return 'auth/sign-in-with-google';
            } else {
                return error.code;
            }                     
        })
    }
});
    
    
}

// Check user is sign in 
export const checkUser = async () => {
    const user = auth.currentUser;
    if (user) {
        console.log('user is signed in')
        return user;        
    } else {
        console.log('user is not signed in')
        return 'not signed in';
    }
}

// Sign user out 
export const signUserOut = async() => {
    signOut(auth).then(response => console.log(response));
}

// Add user if new 
export const addUser = async(userId) => {
    await setDoc(doc(db, "pinmarks", userId), {
        pinmark: {}
    })
}

export const getUser = async(userId) => {
    const docExists = await getDoc(doc(db, "pinmarks", userId));
    if (docExists.exists()) {
        console.log(docExists.data());
        return docExists.data();
    } else {
        // if no userId found, then create a user in pinmarks firestore
        await setDoc(doc(db, "pinmarks", userId), {
            pinmark: {
                locations: [],
                pinmarks: [],
                tripLists: []
            }
        })
        return 'new user';
    }
}

// Update user
export const updateUser = async(userId, userObject) => {
    const docExists = await getDoc(doc(db, "pinmarks", userId));    
    if (docExists.exists()) {                
        await updateDoc(doc(db, "pinmarks", userId), {
            pinmark: userObject
        }).catch(e => console.log(e))
    } else {
        await setDoc(doc(db, "pinmarks", userId), {
            pinmark: {}
        })
    }    
}

// Updated shared trips
export const updatedSharedTrips = async(sharedTripObject) => {
    console.log(sharedTripObject);
    const docExists = await getDoc(doc(db, "sharedTrips", 'shared'))
    if (docExists.exists()) {
        await updateDoc(doc(db, "sharedTrips", 'shared'), {
            shared: sharedTripObject
        })
    } else {
        await setDoc(doc(db, "sharedTrips", 'shared'), {
            shared: sharedTripObject
        })
    }
}

// get shared trips
export const fetchSharedTrips = async() => {
    const sharedTrips = await getDoc(doc(db, "sharedTrips", 'shared'));
    const sharedTripsArray = [];
    console.log(sharedTrips.data());
    sharedTrips.data().shared.forEach((trip) => {
        sharedTripsArray.push(trip);
    })
    console.log(sharedTripsArray);
    return sharedTripsArray;
    }

// get specific trip
export const getTrip = async(sharedTripObject) => {
    const sendingUser = await getDoc(doc(db, "pinmarks", sharedTripObject.sendingUserId));
    if (sendingUser.exists()) {
        return sendingUser.data();
    } else {
        return 'user not found';
    }
}