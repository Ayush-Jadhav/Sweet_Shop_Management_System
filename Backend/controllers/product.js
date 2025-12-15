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
  console.log(imageUrl);

  try {
    session.startTransaction();

    const { name, category, price, quantity } = req.body;

    // Convert price & quantity (FormData sends strings)
    const parsedPrice = Number(price);
    const parsedQuantity = Number(quantity);

    console.log(name, category, price, quantity);

    if (
      !name ||
      !category ||
      Number.isNaN(parsedPrice) ||
      Number.isNaN(parsedQuantity)
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required and must be valid",
      });
    }

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
          price: parsedPrice,
          quantity: parsedQuantity,
          image: imageUrl,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      sweet: sweet[0],
      message: "Sweet created successfully",
    });
  } catch (error) {
    await session.abortTransaction();

    // Rollback uploaded image if DB fails
    if (imageUrl && imageUrl !== DEFAULT_SWEET_IMAGE) {
      await deleteFile(imageUrl).catch(() => {});
    }

    console.error("Create sweet error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create sweet",
    });
  } finally {
    session.endSession();
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

    const filters = [];

    // Keyword search (name OR category)
    if (name) {
      filters.push(
        { name: { $regex: name, $options: "i" } },
        { category: { $regex: name, $options: "i" } }
      );
    }

    // Explicit category filter
    if (category) {
      filters.push({
        category: { $regex: category, $options: "i" },
      });
    }

    const query = {};

    if (filters.length > 0) {
      query.$or = filters;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    console.log("Final Mongo Query:", query);

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
    let oldSweetImageUrl = null; // Store the original image URL for rollback

    try {
        const { id } = req.params;

        // 1. Convert numerical fields from string (FormData/req.body sends strings)
        // If the fields are not present, they remain undefined.
        const parsedPrice = req.body.price !== undefined ? Number(req.body.price) : undefined;
        const parsedQuantity = req.body.quantity !== undefined ? Number(req.body.quantity) : undefined;

        // Basic Validation
        if (req.body.price !== undefined && Number.isNaN(parsedPrice)) {
             return res.status(400).json({ success: false, message: "Price must be a valid number" });
        }
        if (req.body.quantity !== undefined && Number.isNaN(parsedQuantity)) {
             return res.status(400).json({ success: false, message: "Quantity must be a valid number" });
        }

        session.startTransaction();

        const sweet = await Sweet.findById(id).session(session);
        if (!sweet) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Sweet not found" });
        }
        
        oldSweetImageUrl = sweet.image; // Save for safety in case of DB failure later

        // 2. IMAGE UPDATE LOGIC
        // =================================================================
        if (req.files && req.files.image) {
            // A. New image is uploaded: Upload new image and delete old one concurrently
            const uploadPromise = uploadFile({
                file: req.files.image,
                folderName: "sweets",
            });

            // Delete old image ONLY if it's not the default image
            const deletePromise =
                sweet.image && sweet.image !== DEFAULT_SWEET_IMAGE
                    ? deleteFile(sweet.image)
                    : Promise.resolve();

            const [uploadedUrl] = await Promise.all([uploadPromise, deletePromise]);

            newImageUrl = uploadedUrl;
            sweet.image = newImageUrl; // Set the new URL
            
        } else if (req.body.remove_image === 'true' && sweet.image !== DEFAULT_SWEET_IMAGE) {
            // B. User explicitly requested to remove the image (e.g., a checkbox in the form)
            await deleteFile(sweet.image).catch(() => {});
            sweet.image = DEFAULT_SWEET_IMAGE;
        } 
        // C. No image sent and no remove_image flag means sweet.image remains unchanged.
        // =================================================================

        // 3. UPDATE OTHER FIELDS
        // Update fields only if they are present in the request body
        if (req.body.name !== undefined) sweet.name = req.body.name;
        if (req.body.category !== undefined) sweet.category = req.body.category;
        
        // Use the parsed numerical values
        if (parsedPrice !== undefined) sweet.price = parsedPrice;
        if (parsedQuantity !== undefined) sweet.quantity = parsedQuantity;

        // 4. Save and Finish
        const updatedSweet = await sweet.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            sweet: updatedSweet,
            message: "Sweet updated successfully",
        });

    } catch (error) {
        await session.abortTransaction();

        // 5. ROLLBACK LOGIC
        // If a new image was uploaded successfully but the DB save failed, delete the new image.
        if (newImageUrl) {
            await deleteFile(newImageUrl).catch(() => {});
        }

        console.error("Update sweet error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update sweet",
        });
    } finally {
        session.endSession();
    }
};/**
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
