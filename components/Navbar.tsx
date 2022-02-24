import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '@lib/context';
import { auth } from '@lib/firebase';
import { signOut } from 'firebase/auth';
import Image from 'next/image';

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);

  const router = useRouter();

  const signOutNow = () => {
    signOut(auth);
    router.reload();
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link passHref href="/">
            <button className="btn-logo">NXT</button>
          </Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className="push-left">
              <button onClick={signOutNow}>Sign Out</button>
            </li>
            <li>
              <Link passHref href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link passHref href={`/${username}`}>
                <Image width={50} height={50} alt={username} src={user?.photoURL || '/hacker.png'} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link passHref href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}