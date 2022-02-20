import '../styles/globals.css'
import {Toaster} from 'react-hot-toast';

import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks';
import Navbar from '../components/Navbar'

//? Learn these when u finish
//! import Head from 'next/head'
//! import Image from 'next/image'
//! import Link from 'next/link'
//! import styles from '../styles/Home.module.css'

function MyApp({ Component, pageProps }) {
  const {user, username} = useUserData()

  return (
    <UserContext.Provider value={{user, username}}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp
