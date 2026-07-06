import express from "express"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"

import connectDB from "./db/db.js"

const app = express()

const PORT = process.env.PORT

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening at PORT: ${PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB Connection Failed")
})