import '../styles/globals.css'
import {Toaster} from 'react-hot-toast';

import { UserContext } from '../lib/context'
import { useUserData } from '../lib/hooks';
import Navbar from '../components/Navbar'

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