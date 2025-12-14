const mongoose = require("mongoose");
const Sweet = require("../models/sweet");
const { uploadFile, deleteFile } = require("../utils/uploadFile");

const DEFAULT_SWEET_IMAGE = process.env.DEFAULT_SWEET_IMAGE;

/**
 * POST /api/sweets
 * Create new sweet
 */
exports.createSweet = async (req, res) => {
  const session = await mongoose.startSession();
  let imageUrl = DEFAULT_SWEET_IMAGE;

  try {
    const { name, category, price, quantity } = req.body;

    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    session.startTransaction();

    // Upload image only if provided
    if (req.files && req.files.image) {
      imageUrl = await uploadFile({
        file: req.files.image,
        folderName: "sweets",
        quality: "auto:good",
      });
    }

    const sweet = await Sweet.create(
      [
        {
          name,
          category,
          price,
          quantity,
          image: imageUrl,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      sweet: sweet[0],
      message: "Sweet created successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Rollback uploaded image if DB fails
    if (imageUrl && imageUrl !== DEFAULT_SWEET_IMAGE) {
      await deleteFile(imageUrl).catch(() => {});
    }

    console.error("Create sweet error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create sweet",
    });
  }
};

/**
 * GET /api/sweets/pages
 */
exports.getSweetPagesCount = async (req, res) => {
  try {
    const PAGE_SIZE = 10;
    const totalSweets = await Sweet.countDocuments();
    const totalPages = Math.ceil(totalSweets / PAGE_SIZE);

    return res.status(200).json({
      success: true,
      pageSize: PAGE_SIZE,
      totalPages,
      totalSweets,
    });
  } catch (error) {
    console.error("Error fetching sweets page count:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/sweets/page/:pageNumber
 */
exports.getSweetsByPage = async (req, res) => {
  try {
    const PAGE_SIZE = 10;
    const page = parseInt(req.params.pageNumber, 10);

    if (isNaN(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page number",
      });
    }

    const skip = (page - 1) * PAGE_SIZE;

    const sweets = await Sweet.find()
      .skip(skip)
      .limit(PAGE_SIZE)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      page,
      pageSize: PAGE_SIZE,
      count: sweets.length,
      sweets,
    });
  } catch (error) {
    console.error("Error fetching sweets by page:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * GET /api/sweets/search
 */
exports.searchSweets = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query);

    return res.status(200).json({
      success: true,
      count: sweets.length,
      sweets,
    });
  } catch (error) {
    console.error("Error searching sweets:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * PUT /api/sweets/:id
 */
exports.updateSweet = async (req, res) => {
  const session = await mongoose.startSession();
  let newImageUrl = null;

  try {
    const { id } = req.params;

    session.startTransaction();

    const sweet = await Sweet.findById(id).session(session);
    if (!sweet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    // Image update (concurrent delete + upload)
    if (req.files && req.files.image) {
      const uploadPromise = uploadFile({
        file: req.files.image,
        folderName: "sweets",
        quality: "auto:good",
      });

      const deletePromise =
        sweet.image && sweet.image !== DEFAULT_SWEET_IMAGE
          ? deleteFile(sweet.image)
          : Promise.resolve();

      const [uploadedUrl] = await Promise.all([uploadPromise, deletePromise]);

      newImageUrl = uploadedUrl;
      sweet.image = newImageUrl;
    }

    // Update fields
    ["name", "category", "price", "quantity"].forEach((field) => {
      if (req.body[field] !== undefined) {
        sweet[field] = req.body[field];
      }
    });

    await sweet.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      sweet,
      message: "Sweet updated successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (newImageUrl) {
      await deleteFile(newImageUrl).catch(() => {});
    }

    console.error("Update sweet error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update sweet",
    });
  }
};

/**
 * DELETE /api/sweets/:id
 */
exports.deleteSweet = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    session.startTransaction();

    const sweet = await Sweet.findById(id).session(session);
    if (!sweet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Sweet not found",
      });
    }

    const imageUrl = sweet.image;

    await sweet.deleteOne({ session });

    await session.commitTransaction();
    session.endSession();

    // Delete image only if not default
    if (imageUrl && imageUrl !== DEFAULT_SWEET_IMAGE) {
      await deleteFile(imageUrl).catch(() => {});
    }

    return res.status(200).json({
      success: true,
      message: "Sweet deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Delete sweet error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
