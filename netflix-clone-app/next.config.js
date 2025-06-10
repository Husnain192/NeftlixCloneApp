/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    domains: ['img.youtube.com', 'cdn.pixabay.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = {
        ...config.externals,
        bcrypt: 'bcrypt',
        'node-pre-gyp': 'node-pre-gyp',
        'detect-libc': 'detect-libc',
        'https-proxy-agent': 'https-proxy-agent',
      };
    }
    return config;
  },
};
