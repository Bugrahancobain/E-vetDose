const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb', // 🔥 10 MB sınır koyduk (gerekirse artırılabilir)
        },
    },
    async rewrites() {
        return [
            {
                source: "/firebase-messaging-sw.js",
                destination: "/firebase-messaging-sw.js",
            },
        ];
    },
};

module.exports = withPWA(withNextIntl(nextConfig));