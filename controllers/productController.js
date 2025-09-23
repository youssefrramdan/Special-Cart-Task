import slugify from "slugify"
import asyncHandler from "express-async-handler";
import { productModel } from "../models/productModel.js";
import ApiError from "../utils/apiError.js";

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private
 */

const createProduct = asyncHandler(async (req, res, next) => {
    req.body.slug = slugify(req.body.name)
    if (req.file && req.file.path) {
        req.body.imageCover = req.file.path; 
    }
    const product = await productModel.create(req.body);
    res.status(201).json({message: "success", data: product });
});

/**
 * @desc    Get list of products
 * @route   GET /api/v1/products
 * @access  Public
 */

const getAllProducts = asyncHandler(async (req, res, next) => {
    const page = req.query.page * 1 || 1 ;
    const limit = req.query.limit * 1 || 5;
    const skip = (page -1) * limit
    const products = await productModel.find({}).skip(skip).limit(limit);
    res.status(200).json({ message: "success", results: products.length, page, data: products });
});

/**
 * @desc    Get specific product by id
 * @route   GET /api/v1/products/:id
 * @access  Public
 */

const getSpecificProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await productModel.findById({ _id: id });
    if (!product) {
        new ApiError(`product not found for this ${id}`, 400)
    }
    res.status(200).json({ message: "success", data: product });
});


export{
    createProduct,
    getAllProducts,
    getSpecificProduct,
}