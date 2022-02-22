import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';

import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth } from '../../lib/firebase';
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';
import ImageUploader from '../../components/ImageUploader';

export default function AdminPostEdit(props) {
    return (
        <AuthCheck>
            <PostManager /> {/* //? fetch the document from firestore and other controls */}
        </AuthCheck>
    );
}

function PostManager() {
    const [preview, setPreview] = useState(false); //? to switch between doc views

    const router = useRouter();
    const { slug } = router.query;

    // const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
    const postRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'posts', slug)
    const [post] = useDocumentDataOnce(postRef)//? will fetch the data once when the component is initialized

    return (
        <main className={styles.container}>
        {post && (
            <>
                <section>
                    <h1>{post.title}</h1>
                    <p>ID: {post.slug}</p>
        
                    <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                </section>
    
                <aside>
                    <h3>Tools</h3>
                    <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
                    <Link passHref href={`/${post.username}/${post.slug}`}>
                        <button className="btn-blue">Live view</button>
                    </Link>
                    {/* <DeletePostButton postRef={postRef} /> */}
                </aside>
            </>
        )}
        </main>
    );
}

function PostForm({ defaultValues, postRef, preview }) {//? default value is data from our firestore document
    //* this hook provide features that help connect our html forms to react and it take an object with configs as it option 
    const { register, handleSubmit, formState, reset, watch } = useForm({ defaultValues, mode: 'onChange' });//? mode act like state

    const { isValid, isDirty, errors } = formState; //? isValid is validation and isDirty is interacted form yet

    const updatePost = async ({ content, published }) => {
        await updateDoc(postRef, {//? firestore function to update
            content,
            published,
            updatedAt: serverTimestamp(),
        });
    
        reset({ content, published });//? reset the form
    
        toast.success('Post updated successfully!');
    };

    return (
        //$ pass our own code into the useForm function to handle the default haviours for us
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
            <div className="card">
                {/*//$ next is the watch function will 'watch' the content field in the form and treat it like state and changes */}
                <ReactMarkdown>{watch('content')}</ReactMarkdown>{/*  convert the markdown to html */}
            </div>
            )}
    
            <div className={preview ? styles.hidden : styles.controls}>
                <ImageUploader />{/*//? upload then get the url for the image */}
    
                <textarea
                    name="content" //? for the watch function
                    //$ from the register function tell react to include this textarea as part of the greater form and validate with all the other field
                    {...register('content',{ //? with added html validation
                        maxLength: { value: 20000, message: 'content is too long' },
                        minLength: { value: 10, message: 'content is too short' },
                        required: { value: true, message: 'content is required' },
                    })}
                ></textarea>
        
                {errors.content && <p className="text-danger">{errors.content.message}</p>}{/* if there error in content then show it */}
        
                <fieldset>
                    {/*//$ register for this checkbox as well to validate */}
                    <input className={styles.checkbox} name="published" type="checkbox" {...register('published')} />
                    <label>Published</label>
                </fieldset>
        
                <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>{/*//? disabled if either of these are false */}
                    Save Changes
                </button>
            </div>
        </form>
    );
}