// components/admin/AddSweetModal.jsx
import { useState } from "react";
import { createSweetService } from "../../Services/sweetManagement/sweetManagementService";
import "./AddSweetModal.css";

const AddSweetModal = ({ onClose, refresh }) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: null,
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("category", form.category);
      fd.append("price", form.price);
      fd.append("quantity", form.quantity);

      // Append image ONLY if selected
      if (form.image) {
        fd.append("image", form.image);
      }

      await createSweetService(fd);
      refresh();
      onClose();
    } catch (error) {
      alert(error?.message || "Failed to create sweet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-sweet-overlay">
      <div className="add-sweet-modal">
        <h3 className="add-sweet-title">Add Sweet</h3>

        <div className="add-sweet-form">
          <input
            type="text"
            placeholder="Sweet Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm({ ...form, image: e.target.files[0] })
            }
          />
        </div>

        <div className="add-sweet-actions">
          <button
            className="add-sweet-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="add-sweet-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSweetModal;
