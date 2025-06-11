const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    experimental: {
        serverActions: true,
    },
};

module.exports = withPWA(withNextIntl(nextConfig));