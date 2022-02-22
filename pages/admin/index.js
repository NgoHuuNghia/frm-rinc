import { useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { useCollection } from 'react-firebase-hooks/firestore'
import kebabCase from 'lodash.kebabcase'
import toast from 'react-hot-toast'
import { serverTimestamp, query, collection, orderBy, getFirestore, setDoc, doc } from 'firebase/firestore'

import AuthCheck from '../../components/AuthCheck'
import styles from '../../styles/Admin.module.css'
import PostFeed from '../../components/PostFeed'
import { UserContext } from '../../lib/context'
import { firestore, auth } from '../../lib/firebase'

export default function AdminPostsPage(props) {
    return (
        <main>
            <AuthCheck>
            <PostList />
            <CreateNewPost />
            </AuthCheck>
        </main>
    )
}

function PostList() {
    const ref = collection(getFirestore(), 'users', auth.currentUser.uid, 'posts')
    const postQuery = query(ref, orderBy('createdAt'))

    const [querySnapshot] = useCollection(postQuery) //? from react-firebase-hooks to read this collection in realtime
    

    const posts = querySnapshot?.docs.map((doc) => doc.data()); //? map the snapshot down to document data for us to use

    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts} admin />
        </>
    )
}

function CreateNewPost() {
    const router = useRouter(); //? to change url with push later
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title)); //? compute the slug value with encodeURI is built in while kebabcase is imported

    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create a new post in firestore
    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;

        //* since we don't want the doc.id to be automatically generated, make a ref to a doc that doesn't exist yet with value of slug
        const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

        //$ Give all fields a default value here to avoid bugs
        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: '# hello world!',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await setDoc(ref, data);

        toast.success('Post created! directing to edit now.'); //? flavour text to tell that we succeed

        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
    };

    return (
    <form onSubmit={createPost}>
        <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Article!"
            className={styles.input}
        />
        <p>
            <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-green">
            Create New Post
        </button>
    </form>
    );
}