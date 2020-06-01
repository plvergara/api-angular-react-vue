const cors = require('cors')

const corsMiddleware = cors({
	origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
	credentials: true
})

module.exports = corsMiddleware