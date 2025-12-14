import { useEffect, useState } from "react";
import {
  fetchSweetsByPageService,
  deleteSweetService,
} from "../Services/sweetManagement/sweetManagementService";
import AdminSweetCard from "../components/admin/AdminSweetCard";
import AddSweetModal from "../components/admin/AddSweetModal";

const AdminSweetManagement = () => {
  const [sweets, setSweets] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSweets();
  }, [page]);

  const loadSweets = async () => {
    const res = await fetchSweetsByPageService(page);
    setSweets(res.sweets);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sweet?")) return;
    await deleteSweetService(id);
    loadSweets();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Sweet Inventory</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Sweet
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {sweets.map((sweet) => (
          <AdminSweetCard
            key={sweet._id}
            sweet={sweet}
            onDelete={handleDelete}
            refresh={loadSweets}
          />
        ))}
      </div>

      {showModal && (
        <AddSweetModal
          onClose={() => setShowModal(false)}
          refresh={loadSweets}
        />
      )}
    </div>
  );
};

export default AdminSweetManagement;
