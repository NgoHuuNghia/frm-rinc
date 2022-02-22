import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context'

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
    const { username } = useContext(UserContext)

    return username 
        ? props.children //? if username is authenticated render the whatever in the AuthCheck component in the where it called
        : props.fallback || <Link href="/enter">You must be signed in</Link>; //? else just fall back to this
}