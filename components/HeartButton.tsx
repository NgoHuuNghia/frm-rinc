import { firestore, auth } from '../lib/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { increment, writeBatch, doc, getFirestore } from "firebase/firestore";

// Allows user to heart or like a post
export default function Heart({ postRef }) {
    // Listen to heart document for currently logged in user
    const heartRef = doc(getFirestore(), postRef.path, 'hearts', auth.currentUser.uid);
    const [heartDoc] = useDocument(heartRef);

    // Create a user-to-post relationship
    const addHeart = async () => {
        const uid = auth.currentUser.uid;
        //$ need to update the 2 docs at the same and they need to succeed or fail tgt
        const batch = writeBatch(getFirestore()); 

        batch.update(postRef, { heartCount: increment(1) });
        batch.set(heartRef, { uid });

        await batch.commit();
    };

    // Remove a user-to-post relationship
    const removeHeart = async () => {
        const batch = writeBatch(getFirestore());

        batch.update(postRef, { heartCount: increment(-1) });
        batch.delete(heartRef);

        await batch.commit();
    };
    
    return heartDoc?.exists() ? ( //? if the document exist than the user already hearted this post if not they have not
    <button onClick={removeHeart}>💔 Unheart</button>
    ) : (
    <button onClick={addHeart}>💗 Heart</button>
    );
}