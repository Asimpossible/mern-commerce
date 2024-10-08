import catchAsyncErrors from '../middlewares/catchAsyncErrors.js';
import Product from '../models/product.js'
import APIFilters from '../utils/apiFilters.js';
import ErrorHandler from '../utils/ErrorHandler.js';

// Get All Products => api/v1/products
export const getProducts = catchAsyncErrors(async (req, res) => {
    const resPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();
    let products = await apiFilters.query;
    let filteredProductsCount = products.length;
    apiFilters.pagination(resPerPage)
    products = await apiFilters.query.clone()

    res.status(200).json({
        resPerPage,
        filteredProductsCount,
        products
    })
});

// Create the new Product => api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.create(req.body)

    res.status(200).json({
        product
    })
});

//Get Product By Id => api/v1/products/:id
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        product
    })
});

//Update The Product Details => api/v1/products/:id
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req?.params?.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true })

    // Connect MongoDB at default port 27017.
    mongoose.connect('mongodb://localhost:27017/DB Name', {
        useNewUrlParser: true,
        useCreateIndex: true,
    }, (err) => {
        if (!err) {
            console.log('MongoDB Connection Succeeded.')
        } else {
            console.log('Error in DB connection: ' + err)
        }
    });

    res.status(200).json({
        product
    })
});

//Delete Product => api/v1/products/:id
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    await product.deleteOne();

    res.status(200).json({
        message: "Product Deleted"
    })
});