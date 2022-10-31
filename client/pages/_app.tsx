import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout';
import React from 'react';
import Auth from '../utils/Auth';

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
  const pathname = appProps.router.pathname;
  const isLayoutNeeded = pathname.includes('chatrooms') || pathname.includes('friends');

  const LayoutComponent = isLayoutNeeded ? Layout : React.Fragment;

  return ( 
    <LayoutComponent>
      <Component />
    </LayoutComponent>
    );
}

export default MyApp
