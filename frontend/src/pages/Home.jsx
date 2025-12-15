import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SweetGrid from "../components/sweets/sweetGrid";
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

  // get search query from redux (Navbar updates this)
  const searchQuery = useSelector((state) => state.search?.query || "");

  // debounce search input
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch logged-in user
  useEffect(() => {
    dispatch(getCurrentUser());
  }, []);

  useEffect(() => {
    loadSweets();
  }, [debouncedSearch]);

  const loadSweets = async () => {
    try {
      setLoading(true);

      let res;

      if (debouncedSearch.trim()) {
        res = await searchSweetsService({
          name: debouncedSearch,
          category: debouncedSearch,
        });
      } else {
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
    <div className="home-page">
      <div className="home-page__title-area">
        <h1>
          {debouncedSearch.trim()
            ? `Search Results for "${debouncedSearch}"`
            : "Sweets Collection"}
        </h1>
      </div>

      {loading ? (
        <div className="loader">
          <p>Loading the finest treats...</p>
          {/* You might add a spinning icon here for better UX */}
        </div>
      ) : sweets.length > 0 ? (
        <SweetGrid sweets={sweets} />
      ) : (
        <div className="home-page__empty-state">
          <h2>No Sweets Found</h2>
          <p>
            {debouncedSearch.trim()
              ? `We couldn't find any sweets matching "${debouncedSearch}". Try a different search term!`
              : "It looks like our shelves are empty right now. Check back soon!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
