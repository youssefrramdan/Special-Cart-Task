import express from "express";
import { createProduct, getAllProducts, getSpecificProduct } from "../controllers/product.controller.js";
import createUploader from "../middlewares/uploadImageMiddleware.js";

const productRouter = express.Router();
const uploadProductImage = createUploader("products");

productRouter
    .route("/")
    .post(uploadProductImage.single("imageCover"),createProduct)
    .get(getAllProducts);

productRouter
    .route("/:id")
    .get(getSpecificProduct)

export default productRouter;

