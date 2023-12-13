import { Banner, Header, Circlecontent, Buttonsection, Footer, FormElement, Button } from '@Components';
import { WindowSize } from '@Modules';
import Head from 'next/head';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

import MetaTages from './metaTags/metaTags';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
    const device = WindowSize();
    const router = useRouter();
    const loginFields = [
        { ref: useRef(), id: 'UserField_1', label: 'Email', name: 'FEmail', type: 'email', required: true, variant: 'darkBackground', autoComplete: 'off' },
        { ref: useRef(), id: 'UserField_2', label: 'Password', name: 'LPassword', type: 'password', required: true, variant: 'darkBackground', autoComplete: 'new-password' }
    ];
    const { data: session } = useSession();
    var HeadDetails = new MetaTages().Home;
    const LogUserIn = async (e) => {
        Swal.fire({
            title: 'Please wait...',
            showConfirmButton: false,
            toast: true,
            willOpen: () => {
                Swal.showLoading();
            }
        });

        var valid = loginFields.reduce((validSoFar, field) => {
            var valid = field.ref.current.reportValidity();
            return validSoFar && valid;
        }, true);

        if (valid) {
            const email = loginFields[0].ref.current.value.toString();

            const password = loginFields[1].ref.current.value.toString();
            var tempLoginResult = await signIn('DB-login', { redirect: false, UserEmail: email, Password: password });
            Swal.close();
            if (tempLoginResult?.error) {
                Swal.fire({
                    title: 'Incorrect details',
                    icon: 'error',
                    timer: '2000'
                });
            } else {
                router.push('/admin/Tests/ViewTests');
            }

            //}else{}
        } else {
            Swal.close();
            Swal.fire({
                title: 'Please check details',
                icon: 'error',
                timer: '2000'
            });
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
            <div className="section" style={{ height: '100%' }}>
                <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="grid grid-wrap grid_align-center text-color_copper-dark margin-around_small" style={{ maxWidth: '600px', outline: '1px solid', padding: '30px' }}>
                        <img src="/logo.png" style={{ maxHeight: '200px' }} />
                        <h1 className="padding-top_medium size_1-of-1 text-align_center">Staff Assessment Portal</h1>
                        <h2 className="padding-top_medium size_1-of-1 text-align_center">Login</h2>
                        <form
                            autoComplete="off"
                            onSubmit={(ev) => {
                                ev.preventDefault();
                            }}
                        >
                            {loginFields.map((field, iCount) => {
                                return (
                                    <div key={iCount} className="size_1-of-1 padding-top_medium">
                                        <FormElement ref={field.ref} {...field} />
                                    </div>
                                );
                            })}
                        </form>
                        <div className="size_1-of-1 padding-top_large">
                            <Button onClick={() => LogUserIn()} label="Login" variant="CopperBackgroundLight"></Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
