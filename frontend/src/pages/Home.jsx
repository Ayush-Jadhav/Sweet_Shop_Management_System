import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SweetGrid from "../components/sweets/SweetGrid";
import {
  fetchSweetsByPageService,
  searchSweetsService,
} from "../Services/sweetManagement/sweetManagementService";
import { getCurrentUser } from "../Services/auth/authService";
import { useDebounce } from "../hooks/useDebounce";

import "./Home.css";

const Home = () => {
  const dispatch = useDispatch();

  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 get search query from redux (Navbar updates this)
  const searchQuery = useSelector((state) => state.search?.query || "");

  // 🔹 debounce search input
  const debouncedSearch = useDebounce(searchQuery, 400);

  /* =========================
     Fetch logged-in user
  ========================= */
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  /* =========================
     Load sweets (search / default)
  ========================= */
  useEffect(() => {
    loadSweets();
    // eslint-disable-next-line
  }, [debouncedSearch]);

  const loadSweets = async () => {
    try {
      setLoading(true);

      let res;

      // SEARCH MODE
      if (debouncedSearch.trim()) {
        res = await searchSweetsService({
          name: debouncedSearch,
          category: debouncedSearch,
        });
      }
      // DEFAULT MODE (page 1)
      else {
        res = await fetchSweetsByPageService(1);
      }

      setSweets(res?.sweets || []);
    } catch (err) {
      console.error("Failed to load sweets", err);
      setSweets([]);
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
