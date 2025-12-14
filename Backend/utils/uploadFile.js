const cloudinary = require("cloudinary").v2;

exports.uploadFile = async ({file,folderName,height,quality}) =>{
    const options = {
        folder: folderName,
        width: 450,
        height: 280,
        crop: "fill", 
        quality: quality || "auto:good", 
        resource_type: "auto", // Auto-detect image or video
      };
    
    
    // auto detect resource type
    options.resource_type = "auto";
    
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    console.log(result);
    return result.secure_url;
}


exports.deleteFile = async (fileUrl) => {
    try {
        // Extract public ID from file URL
        const publicId = fileUrl.split('/').slice(-2).join('/').split('.')[0]; 

        // Delete the file using public ID
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (err) {
        console.error("Error deleting file from Cloudinary:", err);
        throw new Error("Failed to delete file from Cloudinary");
    }
};


