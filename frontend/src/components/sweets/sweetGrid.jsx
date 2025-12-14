import SweetCard from "./SweetCard";
import "./sweetGrid.css";

const SweetGrid = ({ sweets }) => {
  if (!sweets || sweets.length === 0) {
    return (
      <div className="empty-grid">
        <p>No sweets available 🍬</p>
      </div>
    );
  }

  return (
    <div className="sweet-grid">
      {sweets.map((sweet) => (
        <SweetCard key={sweet._id} sweet={sweet} />
      ))}
    </div>
  );
};

export default SweetGrid;
