/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 15+ dev overlay can throw releasePointerCapture NotFoundError in the browser when
  // dragging the dev-tools handle; disabling the floating indicator avoids that (dev-only).
  devIndicators: false,
  // Avoid forwarding WebView console to the terminal (Capacitor + empty `{}` from plugins spams logFromNative).
  logging: {
    browserToTerminal: false,
  },
  // Capacitor live reload loads the dev server from https://127.0.0.1 (WebView); allow dev/HMR.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Required for Capacitor - static export
  output: 'export',
  // Disable trailing slashes for Capacitor compatibility
  trailingSlash: false,
}

export default nextConfig
