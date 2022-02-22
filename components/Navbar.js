import Link from 'next/link'
import Image from 'next/image'
import { useContext } from 'react'
import { UserContext } from '../lib/context'

export default function Navbar() {
    const { user, username } = useContext(UserContext)

    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link passHref href='/'>
                        <button className="btn-logo">FEED</button>
                    </Link>
                </li>
                {username &&(
                    <>
                        <li className="push-left">
                            <Link passHref href='/admin'>
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link passHref href={`/${username}`}>
                                <Image height={50} width={50} alt={username} src={user?.photoURL}></Image>
                            </Link>
                        </li>
                    </>
                )}
                {!username && (
                    <li>
                        <Link passHref href='/enter'>
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}