import UpdateSweetModal from "./UpdateSweetModal";
import { useState } from "react";
import "./AdminSweetCard.css";

const AdminSweetCard = ({ sweet, onDelete, refresh }) => {
  const [edit, setEdit] = useState(false);

  return (
    <div className="admin-sweet-card">
  <img
    src={sweet.image}
    alt={sweet.name}
    className="admin-sweet-image"
  />

  <div className="admin-sweet-content">
    <h3 className="admin-sweet-name">{sweet.name}</h3>
    <p className="admin-sweet-price">₹{sweet.price}</p>
    <p className="admin-sweet-stock">Stock: {sweet.quantity}</p>
  </div>

  <div className="admin-sweet-actions">
    <button
      onClick={() => setEdit(true)}
      className="admin-btn edit"
    >
      Edit
    </button>

    <button
      onClick={() => onDelete(sweet._id)}
      className="admin-btn delete"
    >
      Delete
    </button>
  </div>

  {edit && (
    <UpdateSweetModal
      sweet={sweet}
      onClose={() => setEdit(false)}
      refresh={refresh}
    />
  )}
</div>

  );
};

export default AdminSweetCard;
