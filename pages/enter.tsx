import { UserContext } from "../lib/context"
import { auth, googleAuthProvider, firestore } from "../lib/firebase" //? No difference between firestore and getFirestore
import { doc, writeBatch, getDoc, getFirestore } from 'firebase/firestore'
import { signInWithPopup, signInAnonymously, signOut } from 'firebase/auth'

import { useContext, useState, useEffect, useCallback } from "react"
//import Image from "next/image"
import debounce from 'lodash.debounce'

export default function Page({ }) {
    const { user, username } = useContext(UserContext)

    // 1. user signed out <SignInButton />
    // 2. user signed in, but missing username <UsernameForm />
    // 3. user signed in, has username <SignOutButton />
    return (
        <main>
        {user ? 
            !username ? <UsernameForm /> : <SignOutButton /> 
            : 
            <SignInButton />
        }
        </main>
    )
}

//* Sign in with google button
function SignInButton() {
    const signInWithGoogle = async () => {
        await signInWithPopup(auth, googleAuthProvider)
    }

    return (
        <>
            <button className='btn-google' onClick={signInWithGoogle}>
                <img src={'/google.png'} alt="google" /> Sign in with google
            </button>
            <button onClick={() => signInAnonymously(auth)}>
                Sign in Anonymously
            </button>
        </>
    )
}

//* Sign out button
function SignOutButton() {
    return <button onClick={() => signOut(auth)}>Sign Out</button>
}

//* User form
function UsernameForm() {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username } = useContext(UserContext)

    useEffect(() => {
        checkUsername(formValue)
    }, [formValue])

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase()
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val)
            setLoading(false)
            setIsValid(false)
        }
    
        // make sure the value match the format
        if (re.test(val)) {
            setFormValue(val)
            setLoading(true)
            setIsValid(false)
        }
    }

    const checkUsername = useCallback ( //* to use rebounce wrap in useCallBack allow this function to be memorized
        debounce(async (username) => { //? uses a npm helper fuction to optimize, not calling everytime we form change
            if (username.length >= 3) {
                const ref = doc(getFirestore(), 'usernames', username)
                const snap = await getDoc(ref)
                console.log('Firestore read executed!', snap.exists())
                setIsValid(!snap.exists())
                setLoading(false)
            }
        }, 500), //? 500 milisecond
        []
    )

    const onSubmit = async (e) => {
        e.preventDefault()
    
        // Create refs for both documents
        const userDoc = doc(getFirestore(), 'users', user.uid)
        const usernameDoc = doc(getFirestore(), 'usernames', formValue)
    
        // Commit both docs together as a batch write.
        const batch = writeBatch(getFirestore())
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
        batch.set(usernameDoc, { uid: user.uid })
    
        await batch.commit()
    }

    return (
        !username && (
            <section>
                <h3>Choose username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}> Choose </button>
                </form>

                <h3>Debug State</h3>
                <div>
                    Username: {formValue}
                    <br />
                    Loading: {loading.toString()}
                    <br />
                    Username Valid: {isValid.toString()}
                </div>
            </section>
        )
    )
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>
    } else {
        return <p></p>
    }
}