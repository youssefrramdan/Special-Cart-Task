import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import ApiError from "./utils/apiError.js";
import globalError from "./middlewares/errorMiddleware.js"; 
import productRouter from "./routes/productRoute.js";

dotenv.config({ path: "./config/config.env" });

const app = express();


const corsOptions = {
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));
  app.use(compression());

  // middlewares
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
    console.log(`mode : ${process.env.NODE_ENV}`);
  }

// mount Routes
app.use("/api/v1/products", productRouter);

//  here add routes like app.use(,)


app.all("*", (req, res, next) => {
    next(new ApiError(`Cant find this route ${req.originalUrl}`, 400));
  });

  app.use(globalError);

export default app;
