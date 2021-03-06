import { useState } from 'react'
import Loader from '../components/Loader'
import { Timestamp, query, where, orderBy, limit, collectionGroup, getDocs, startAfter, getFirestore } from 'firebase/firestore';
// import toast from 'react-hot-toast'

import { firestore, postToJSON } from '../lib/firebase';
import PostFeed from '../components/PostFeed';
import Metatags from '../components/Metatags';

const LIMIT = 10

export async function getServerSideProps(context) {
  // allow us to just ref any sub groups no mater how nested
  const ref = collectionGroup(getFirestore(), 'posts');
  const postsQuery = query(
    ref,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT),
  )

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  //* set props as states to fetch more post later
  const [posts, setPosts] = useState(props.posts) //? init the prop using the prop from the server
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  //* Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    //* depend on if we get createdAt from server or client need to convert to firestore timestamp
    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

      const ref = collectionGroup(getFirestore(), 'posts');
      const postsQuery = query(
        ref,
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        startAfter(cursor),
        limit(LIMIT),
      )

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  }

  return (
    <main>
      <Metatags title="Home Page" description="Get the latest posts on our site" />

      <div className="card card-info">
        <h2>???? Next.js + Firebase - The Full Course</h2>
        <p>Welcome! This app is built with Next.js and Firebase and is loosely inspired by Dev.to.</p>
        <p>Sign up for an ??????????? account, ?????? write posts, then ???? heart content created by other users. All public content is server-rendered and search-engine optimized.</p>
      </div>
    
      <PostFeed posts={posts} admin={false} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  );
}
