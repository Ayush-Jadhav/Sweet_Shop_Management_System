import { useState } from "react";
import { createSweetService } from "../../Services/sweetManagement/sweetManagementService";

const AddSweetModal = ({ onClose, refresh }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image: null,
  });

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    await createSweetService(fd);
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-5 rounded w-96">
        <h3 className="text-lg font-semibold mb-3">Add Sweet</h3>

        <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})} />
        <input placeholder="Category" onChange={(e)=>setForm({...form,category:e.target.value})} />
        <input type="number" placeholder="Price" onChange={(e)=>setForm({...form,price:e.target.value})} />
        <input type="number" placeholder="Quantity" onChange={(e)=>setForm({...form,quantity:e.target.value})} />
        <input type="file" onChange={(e)=>setForm({...form,image:e.target.files[0]})} />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} className="bg-green-600 text-white px-3 py-1 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSweetModal;
