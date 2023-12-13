import { Banner, Header, Circlecontent, Buttonsection, Footer } from '@Components';
import { WindowSize } from '@Modules';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import MetaTages from './metaTags/metaTags';

import axios from 'axios';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
    const device = WindowSize();
    const router = useRouter();

    const { data: session, status } = useSession();

    var HeadDetails = new MetaTages().Home;
    
    const LogUserIn = async (e) => {
        var tempLoginResult = await signIn('DB-login', { redirect: false, username: 'a', password: 'dasdsa' /* , callbackUrl: '/admin' */ });

        if (tempLoginResult?.error) {
            console.error(tempLoginResult.error);
        } else {
            if (tempLoginResult.url) router.push(tempLoginResult.url);
        }

    };


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
            </Head>
        </>
    );
}
