import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore, collection, where, getDocs, query, limit } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAq0A1noYVXOx7hPL8PNm8KTxSUzrH1cHY",

    authDomain: "frn-rinc.firebaseapp.com",

    databaseURL: "https://frn-rinc-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "frn-rinc",

    storageBucket: "frn-rinc.appspot.com",

    messagingSenderId: "900700689476",

    appId: "1:900700689476:web:cc02014cb8b472da8d1811",

    measurementId: "G-8NBLCT16X5"
}

//$ get the app or initialize it 
function createFirebaseApp(config) {
    try {
        return getApp()
    } catch {
        return initializeApp(config)
    }
}
const firebaseApp = createFirebaseApp(firebaseConfig)

//* Auth exports
export const auth = getAuth(firebaseApp)
export const googleAuthProvider = new GoogleAuthProvider()

//* Firestore exports
export const firestore = getFirestore(firebaseApp) //? in firebase version 9+ every firestore's functions is in getFirestore

//* Storage exports
export const storage = getStorage(firebaseApp);
//$ a special firebase event that we can listen to which will tell us the progress of the file being upload
export const STATE_CHANGED = 'state_changed';

/**`
 * $ Gets a users/{uid} document with username
 * @param  {string} username
 */
 export async function getUserWithUsername(username) {
    // const usersRef = collection(firestore, 'users');
    // const query = usersRef.where('username', '==', username).limit(1);

    const q = query(
        collection(firestore, 'users'), 
        where('username', '==', username),
        limit(1)
    )
    const userDoc = ( await getDocs(q) ).docs[0];
    return userDoc;
}

/**`
 * $ Converts a firestore document to JSON specifically the createdAt and updatedAt 
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
        createdAt: data?.createdAt.toMillis() || 0,
        updatedAt: data?.updatedAt.toMillis() || 0,
    };
}