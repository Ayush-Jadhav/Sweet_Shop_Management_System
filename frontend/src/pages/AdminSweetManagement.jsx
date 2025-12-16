// AdminSweetManagement.jsx

import { useEffect, useState } from "react";
import {
  fetchSweetsByPageService,
  deleteSweetService,
} from "../Services/sweetManagement/sweetManagementService";
import AdminSweetCard from "../components/admin/AdminSweetCard";
import AddSweetModal from "../components/admin/AddSweetModal";
import UpdateSweetModal from "../components/admin/UpdateSweetModal";
import "./AdminSweetManagement.css";

const AdminSweetManagement = () => {
  const [sweets, setSweets] = useState([]);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sweetToEdit, setSweetToEdit] = useState(null);

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

  const handleEdit = (sweet) => {
    setSweetToEdit(sweet);
  };

  const handleCloseUpdateModal = () => {
    setSweetToEdit(null);
  };

  return (
    <div className="admin-sweet-page">
      <div className="admin-sweet-header">
            <h2 className="admin-sweet-title">Sweet Inventory</h2> 
        <button onClick={() => setShowAddModal(true)} className="add-sweet-btn">
                + Add Sweet    
        </button>
      </div>

      {sweets.length === 0 ? (
        <p className="admin-empty">No sweets available</p>
      ) : (
        <div className="admin-sweet-grid">
          {sweets.map((sweet) => (
            <AdminSweetCard
              key={sweet._id}
              sweet={sweet}
              onDelete={handleDelete}
              refresh={loadSweets}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
      {showAddModal && (
        <AddSweetModal
          onClose={() => setShowAddModal(false)}
          refresh={loadSweets}
        />
      )}
      {sweetToEdit && (
        <UpdateSweetModal
          sweet={sweetToEdit}
          onClose={handleCloseUpdateModal}
          refresh={loadSweets}
        />
      )}
    </div>
  );
};

export default AdminSweetManagement;
