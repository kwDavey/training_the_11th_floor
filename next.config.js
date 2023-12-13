/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/SignIn',
                permanent: true
            },
            {
                source: '/admin',
                destination: '/admin/Tests/ViewTests',
                permanent: true
            }
        ];
    }
};

module.exports = nextConfig;
