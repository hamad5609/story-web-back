import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import postRouter from "./Routes/post.js";
import userRoutes from "./Routes/user.js";

const app = express();

// PORT

const PORT = process.env.PORT || 5000;

// APP MIDDLEWARES

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: "true" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true" }));

// ROUTES

app.use('/', postRouter);
app.use('/user', userRoutes);

// CONNNECTING DATABASE

const CONNECTION_URL = "mongodb+srv://storyweb123:storyweb123@cluster0.7klwj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Connected to Db and port ${PORT}`)))
    .catch((err) => console.log(err.message));

