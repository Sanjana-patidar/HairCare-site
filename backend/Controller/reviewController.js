import { reviewModel } from "../Model/ReviewModel.js";
import { productModel } from "../Model/ProductModel.js";
import { UserModel } from "../Model/UserModel.js"; // required so Mongoose registers User schema for populate()

/* ── Helper: recalculate & save avg rating on product ── */
const updateProductRating = async (productId) => {
  const reviews = await reviewModel.find({ product: productId });
  if (reviews.length === 0) {
    await productModel.findByIdAndUpdate(productId, { rating: 0 });
    return;
  }
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await productModel.findByIdAndUpdate(productId, {
    rating: Math.round(avg * 10) / 10, // round to 1 decimal
  });
};

/* ── POST /api/reviews/:productId  (logged-in user) ── */
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;
    const userId    = req.user.id;
    const name      = req.user.name || "User";

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Check duplicate
    const existing = await reviewModel.findOne({ product: productId, user: userId });
    if (existing) {
      return res.status(409).json({ message: "You have already reviewed this product" });
    }

    const review = await reviewModel.create({
      product: productId,
      user: userId,
      name,
      rating: Number(rating),
      comment,
    });

    await updateProductRating(productId);

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ── GET /api/reviews/:productId  (public) ── */
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find({ product: req.params.productId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── GET /api/reviews  (admin — all reviews) ── */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find()
      .populate("product", "name image")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ── DELETE /api/reviews/:id  (admin) ── */
export const deleteReview = async (req, res) => {
  try {
    const review = await reviewModel.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const productId = review.product;
    await reviewModel.findByIdAndDelete(req.params.id);
    await updateProductRating(productId);

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
