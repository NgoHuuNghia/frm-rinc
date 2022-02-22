import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Link from 'next/link';
import { useContext } from 'react'

import styles from '../../styles/Post.module.css'
import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import PostContent from '../../components/PostContent';
import Metatags from '../../components/Metatags';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton'
import { UserContext } from '../../lib/context';

//$ tell next to fetch data on the server at build to prerender this page in advance
export async function getStaticProps({ params }) { //? params instead of query like ssr
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post
    let path

    if (userDoc) {
        const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug)

        post = postToJSON(await getDoc(postRef) )
        path = postRef.path //? use to hydrate the realtime data bellow
    }

    return {
        props: { post, path },
        revalidate: 5000,
    };
}

//$ which actual page to render since it all render in advance. 
//$ So next have no idea which path to render, we can tell next which path to render here
export async function getStaticPaths() {
    // Improve my using Admin SDK to select empty docs
    const q = query(
        collectionGroup(getFirestore(), 'posts'),
        limit(20)
    )
    const snapshot = await getDocs(q);

    const paths = snapshot.docs.map((doc) => {
        const { slug, username } = doc.data();
            return {
            params: { username, slug },
        };
    });

    return {
        // must be in this format:
        // paths: [
        //   { params: { username, slug }}
        // ],
        paths,
        
        //? since we are working with dynamic data, static page generation will have no way to knowing we added a new post to
        //? the database so it just default to a 404 page no found. But with adding a fallback value of 'blocking' can solve
        //? this issue for us. Telling next to fallback to regular server side rendering, when it rendered the page than it can
        //? be cached on the cdn like any other pages. Which is awesome since we normally have to rebuild and redeploy your site
        //? with regular static generation 
        fallback: 'blocking',
    };
}

export default function Post(props) { //? prop to the path of the content in our server rendered content
    const postRef = doc(getFirestore(), props.path)
    const [realtimePost] = useDocumentData(postRef) //? hook to get the feed of that data in real time

    //* value post will default to the realtime data but fallback to prerender data on server
    const post = realtimePost || props.post;
    
    const { user: currentUser } = useContext(UserContext);

    return (
        <main className={styles.container}>
            <Metatags title={post.title} description={post.title} />
            
            <section>
            <PostContent post={post} />
            </section>
            <p></p>
    
            <aside className="card">
            <p>
                <strong>{post.heartCount || 0} 🤍</strong>
            </p>
    
            <AuthCheck
                fallback={ //? link back to sign in page if they aren't signed in
                <Link href="/enter">
                    <button>💗 Sign Up</button>
                </Link>
                }
            >
                <HeartButton postRef={postRef} />
            </AuthCheck>
    
            {currentUser?.uid === post.uid && (
                <Link href={`/admin/${post.slug}`}>
                <button className="btn-blue">Edit Post</button>
                </Link>
            )}
            </aside>
        </main>
    )
}