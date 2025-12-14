import { useState } from "react";
import { updateSweetService } from "../../Services/sweetManagement/sweetManagementService";

const UpdateSweetModal = ({ sweet, onClose, refresh }) => {
  const [form, setForm] = useState({
    name: sweet.name || "",
    category: sweet.category || "",
    price: sweet.price || "",
    quantity: sweet.quantity || "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);

      // only append image if admin selected new one
      if (form.image) {
        formData.append("image", form.image);
      }

      await updateSweetService(sweet._id, formData);

      refresh(); // refresh list
      onClose(); // close modal
    } catch (err) {
      console.error("Update sweet failed", err);
      alert("Failed to update sweet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded w-96">
        <h3 className="text-lg font-semibold mb-4">Update Sweet</h3>

        {/* Name */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Sweet name"
          className="w-full mb-2 p-2 border rounded"
        />

        {/* Category */}
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full mb-2 p-2 border rounded"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full mb-2 p-2 border rounded"
        />

        {/* Quantity */}
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          className="w-full mb-2 p-2 border rounded"
        />

        {/* Image */}
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full mb-4"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-3 py-1 bg-blue-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateSweetModal;
