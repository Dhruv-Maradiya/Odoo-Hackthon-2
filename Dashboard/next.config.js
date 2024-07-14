const path = require('path')

/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL
  },
  trailingSlash: true,
  reactStrictMode: false,
  experimental: {
    esmExternals: true
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}'
    }
  }
}
