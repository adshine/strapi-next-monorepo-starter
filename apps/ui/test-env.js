// Quick test to verify environment variables are loaded
const dotenv = require('dotenv')
const path = require('path')

// Load .env.local
dotenv.config({ path: path.join(__dirname, '.env.local') })

console.log('STRAPI_REST_READONLY_API_KEY:', process.env.STRAPI_REST_READONLY_API_KEY ? 'SET (length: ' + process.env.STRAPI_REST_READONLY_API_KEY.length + ')' : 'NOT SET')
console.log('STRAPI_URL:', process.env.STRAPI_URL)
console.log('APP_PUBLIC_URL:', process.env.APP_PUBLIC_URL)