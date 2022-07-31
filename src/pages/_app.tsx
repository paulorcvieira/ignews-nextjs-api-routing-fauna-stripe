import { SessionProvider } from "next-auth/react";
import { AppProps } from 'next/app';

import { Header } from '../components/Header';

import '../styles/global.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />

      <Component {...pageProps} />
    </SessionProvider>
  );
}