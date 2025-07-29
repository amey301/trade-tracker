const dotenv = require('dotenv')
dotenv.config()

const app = require('./app')

PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`App is listening on PORT: ${PORT}`)
})