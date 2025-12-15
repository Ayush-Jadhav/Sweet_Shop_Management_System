import { useState } from "react";
import { updateSweetService } from "../../Services/sweetManagement/sweetManagementService";
import "./UpdateSweetModal.css";

const UpdateSweetModal = ({ sweet, onClose, refresh }) => {
  const [imagePreview, setImagePreview] = useState(sweet.image || null);
  const [removeImage, setRemoveImage] = useState(false);

  const [form, setForm] = useState({
    name: sweet.name || "",
    category: sweet.category || "",
    price: sweet.price || "",
    quantity: sweet.quantity || "",
    image: null, // Stores the new file object
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImageToggle = () => {
    const newRemoveState = !removeImage;
    setRemoveImage(newRemoveState);

    if (newRemoveState) {
      setForm((prev) => ({ ...prev, image: null }));
      setImagePreview(null);
    } else {
      setImagePreview(sweet.image || null);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (removeImage) {
        formData.append("remove_image", true);
      }

      await updateSweetService(sweet._id, formData);

      refresh();
      onClose();
    } catch (err) {
      console.error("Update sweet failed", err);
      const errorMessage =
        err?.response?.data?.message || "Failed to update sweet";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-sweet-overlay">
      <div className="update-sweet-modal">
        <h3 className="update-sweet-title">Update Sweet: {sweet.name}</h3>{" "}
        {/* Added sweet name for clarity */}
        {/* Using a form tag for proper submission handling */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="update-sweet-form"
        >
          {/* Input fields */}
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Sweet name"
            required
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            required
            min="1"
          />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            required
            min="0"
          />

          {/* Image Management Group */}
          <div className="image-management-group">
            {/* 1. Preview */}
            {imagePreview && (
              <div className="image-preview-wrapper">
                <img
                  src={imagePreview}
                  alt="Sweet Preview"
                  className="image-preview"
                />
              </div>
            )}

            {/* 2. File Input */}
            <div className="file-input-group">
              <label className="file-label">New Product Image (Optional)</label>
              <input
                type="file"
                onChange={handleImageChange}
                key={removeImage ? "removed" : "active"}
                disabled={removeImage}
                className="file-input"
              />
            </div>

            {/* 3. Removal Checkbox */}
            <div className="remove-image-checkbox-group">
              <input
                id="remove-image-checkbox"
                type="checkbox"
                checked={removeImage}
                onChange={handleRemoveImageToggle}
              />
              <label htmlFor="remove-image-checkbox">
                Remove current image
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="update-sweet-actions">
            <button
              type="button"
              className="update-btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="update-btn-save"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Sweet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSweetModal;
