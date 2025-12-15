import React from "react";
import "./AdminSweetCard.css";

const AdminSweetCard = ({ sweet, onDelete, refresh, onEdit }) => {
  // Removed local 'edit' state.

  const isLowStock = sweet.quantity > 0 && sweet.quantity < 5;
  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="admin-sweet-card">
      <div className="admin-sweet-image-wrapper">
        <img src={sweet.image} alt={sweet.name} className="admin-sweet-image" />
        {(isLowStock || isOutOfStock) && (
          <span
            className={`stock-status-badge ${
              isOutOfStock ? "out-of-stock" : "low-stock"
            }`}
          >
            {isOutOfStock ? "OUT OF STOCK" : "LOW STOCK"}       
          </span>
        )}
      </div>
      <div className="admin-sweet-content">
                <h3 className="admin-sweet-name">{sweet.name}</h3>       
        <div className="admin-sweet-meta">
                    <p className="admin-sweet-price">₹{sweet.price}</p>         
          <p
            className={`admin-sweet-stock ${
              isLowStock || isOutOfStock ? "attention" : ""
            }`}
          >
            Stock:            
            <span className="admin-sweet-stock-value">{sweet.quantity}</span>   
          </p>
        </div>
      </div>
           
      <div className="admin-sweet-actions">
        <button onClick={() => onEdit(sweet)} className="admin-btn edit-btn">
          Edit        
        </button>
        <button
          onClick={() => onDelete(sweet._id)}
          className="admin-btn delete-btn"
        >
          Delete      
        </button>
      </div>
    </div>
  );
};

export default AdminSweetCard;
