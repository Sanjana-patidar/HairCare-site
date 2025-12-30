// Controller/ProductController.js
import { productModel } from "../Model/ProductModel.js";
import fs from "fs";
import path from "path";

// ADD product 
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, discountprice,  discountpercentage, rating, category, stock, status } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image file is required (form-data key: image)" });

    
    const product = new productModel({
      name,
      description,
      price,
      discountprice,
      discountpercentage,
      rating,
      category,
      stock,
      image: req.file.filename,
      status: status || "active"
    });

    await product.save();
    res.status(201).json({ message: "Product added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const products = await productModel.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single product by id
export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE product (image optional)
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      // delete old image file
      const existing = await productModel.findById(req.params.id);
      if (existing && existing.image) deleteFile(existing.image);
      updateData.image = req.file.filename;
    }

    const updated = await productModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE product + image
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // If you store image path locally
    // deleteFile(product.image);  // remove if unused

    await productModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update product status
export const updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive", "outofstock"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Status updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await productModel.find({
      category: category,     
      status: "active",       
      stock: { $gt: 0 }      
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

