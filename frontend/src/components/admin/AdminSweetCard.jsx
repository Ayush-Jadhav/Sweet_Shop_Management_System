import UpdateSweetModal from "./UpdateSweetModal";
import { useState } from "react";

const AdminSweetCard = ({ sweet, onDelete, refresh }) => {
  const [edit, setEdit] = useState(false);

  return (
    <div className="border rounded p-3 shadow">
      <img
        src={sweet.image}
        alt={sweet.name}
        className="h-40 w-full object-cover rounded"
      />

      <h3 className="font-semibold mt-2">{sweet.name}</h3>
      <p>₹{sweet.price}</p>
      <p>Stock: {sweet.quantity}</p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => setEdit(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(sweet._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
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
