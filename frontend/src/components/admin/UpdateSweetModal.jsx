import { useState } from "react";
import { updateSweetService } from "../../Services/sweetManagement/sweetManagementService";
import "./UpdateSweetModal.css";

const UpdateSweetModal = ({ sweet, onClose, refresh }) => {
    
    // State for image preview: initialized to the current sweet image URL or null
    const [imagePreview, setImagePreview] = useState(sweet.image || null); 
    
    // State to track if the user wants to remove the existing image
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
        
        // Show file preview and reset the remove flag
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setRemoveImage(false); // If a new file is selected, removal is cancelled
        }
    };
    
    const handleRemoveImageToggle = () => {
        const newRemoveState = !removeImage;
        setRemoveImage(newRemoveState);
        
        // If enabling removal: clear the new file input and remove the preview
        if (newRemoveState) {
            setForm((prev) => ({ ...prev, image: null }));
            setImagePreview(null); 
        } 
        // If disabling removal: restore the original image URL for preview
        else {
            setImagePreview(sweet.image || null); 
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            
            // Append all fields, even if they haven't changed, to ensure data consistency
            formData.append("name", form.name);
            formData.append("category", form.category);
            formData.append("price", form.price);
            formData.append("quantity", form.quantity);

            // Append new image ONLY if selected
            if (form.image) {
                formData.append("image", form.image);
            }

            // Append the removal flag ONLY if it's true
            // This flag is what your backend controller checks: req.body.remove_image === 'true'
            if (removeImage) {
                formData.append("remove_image", true);
            }

            await updateSweetService(sweet._id, formData);

            refresh(); 
            onClose(); 
        } catch (err) {
            console.error("Update sweet failed", err);
            // Better error reporting
            const errorMessage = err?.response?.data?.message || "Failed to update sweet";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="update-sweet-overlay">
            <div className="update-sweet-modal">
                <h3 className="update-sweet-title">Update Sweet</h3>

                <div className="update-sweet-form">
                    {/* Input fields */}
                    <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Sweet name" />
                    <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" />
                    <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" />
                    <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" />

                    {/* Image Preview */}
                    {imagePreview && (
                        <img 
                            src={imagePreview} 
                            alt="Sweet Preview" 
                            style={{ 
                                maxWidth: '100px', 
                                maxHeight: '100px',
                                objectFit: 'cover',
                                marginBottom: '10px' 
                            }} 
                        />
                    )}
                    
                    {/* File Input */}
                    <input 
                        type="file" 
                        onChange={handleImageChange} 
                        // Key trick resets the input when removeImage changes, clearing the file name
                        key={removeImage ? 'removed' : 'active'}
                        disabled={removeImage}
                    />

                    {/* Small Checkbox for Removal */}
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                        <input 
                            id="remove-image-checkbox"
                            type="checkbox" 
                            checked={removeImage} 
                            onChange={handleRemoveImageToggle}
                            style={{ marginRight: '5px' }} 
                        />
                        <label 
                            htmlFor="remove-image-checkbox" 
                            style={{ fontSize: '14px', color: '#555' }} 
                        >
                            Remove current image
                        </label>
                    </div>
                </div>

                <div className="update-sweet-actions">
                    <button 
                        className="update-btn-cancel" 
                        onClick={onClose} 
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        className="update-btn-save" 
                        onClick={handleSubmit} 
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