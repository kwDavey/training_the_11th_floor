import '@Styles/main.scss';
import Head from 'next/head';
import MetaTages from './metaTags/metaTags';
import { SessionProvider } from 'next-auth/react';
import React from 'react';

import Swal from 'sweetalert2';


export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    var HeadDetails = new MetaTages().Home;






    return (
        <>
            <Head>
                {/* <!-- HTML Meta Tags --> */}
                <title>{HeadDetails.title}</title>
                <meta name="description" content={HeadDetails.description} />

                {/* <!-- Google / Search Engine Tags --> */}
                <meta itemProp="name" content={HeadDetails.title} />
                <meta itemProp="description" content={HeadDetails.description} />
                <meta itemProp="image" content={HeadDetails.image} />

                {/* <!-- Facebook Meta Tags --> */}
                <meta property="og:url" content={HeadDetails.url} />
                <meta property="og:type" content={HeadDetails.website} />
                <meta property="og:title" content={HeadDetails.title} />
                <meta property="og:description" content={HeadDetails.description} />
                <meta property="og:image" content={HeadDetails.image} />

                {/* <!-- Twitter Meta Tags --> */}
                <meta name="twitter:card" content={HeadDetails.cardSize} />
                <meta name="twitter:title" content={HeadDetails.title} />
                <meta name="twitter:description" content={HeadDetails.description} />
                <meta name="twitter:image" content={HeadDetails.image} />

                {/* <!-- Favicons --> */}
                <link rel="icon" href="/favicon-48x48.ico" />
                <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
                <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            </Head>

            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    );
}
