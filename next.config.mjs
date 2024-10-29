/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // List of allowed image domains for Next.js Image Optimization
    // img.youtube.com - Allow YouTube video thumbnails
    // utfs.io - Allow UploadThing images
    remotePatterns: [
      {
        hostname: 'img.youtube.com',
      },
      {
        hostname: 'utfs.io',
      },
    ],

    // Supported image formats that Next.js can optimize and serve
    // image/webp - Support WebP format for better compression
    formats: ['image/webp'],

    // Content Security Policy for images
    // default-src 'self' - Only allow images from same origin
    // script-src 'none' - Disable script execution in images
    // sandbox - Apply sandbox restrictions to images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
