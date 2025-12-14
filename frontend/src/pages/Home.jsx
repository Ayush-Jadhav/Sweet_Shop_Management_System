import { useEffect, useState } from "react";
import SweetGrid from "../components/sweets/SweetGrid";
import { fetchSweetsByPageService } from "../Services/sweetManagement/sweetManagementService";
import "./Home.css";

const Home = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSweets();
  }, []);

  const loadSweets = async () => {
    try {
      const res = await fetchSweetsByPageService(1);

      // IMPORTANT: axios response shape
      setSweets(res?.sweets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>Available Sweets</h1>
      </div>

      {loading ? (
        <div className="loader">Loading sweets...</div>
      ) : (
        <SweetGrid sweets={sweets} />
      )}
    </div>
  );
};

export default Home;
