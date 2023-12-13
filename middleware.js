import { withAuth } from 'next-auth/middleware';

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            /*  console.log('Authorized callback, token: ', token); */
            return !!token;
        }
    },
    secret: process.env.SECRET
});

export const config = {
    matcher: ['/admin/:path*', '/']
};
