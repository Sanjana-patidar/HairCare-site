import Brand from "../Model/BrandModel.js";

export const createBrand = async (req, res) => {
  const { name, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Brand logo is required" });
  }

  const brand = await Brand.create({
    name,
    logo: req.file.filename,
    description,
  });

  res.status(201).json(brand);
};

export const getAllBrands = async (req, res) => {
  const brands = await Brand.find().sort({ createdAt: -1 });
  res.json(brands);
};

export const deleteBrand = async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return res.status(404).json({ message: "Brand not found" });
  }

  await brand.deleteOne();
  res.json({ message: "Brand deleted" });
};
