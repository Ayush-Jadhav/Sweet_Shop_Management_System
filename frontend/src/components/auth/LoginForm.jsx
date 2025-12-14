import { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logIn } from "../../Services/auth/authService";

const LoginForm = () => {
  const [visiblePass, setVisiblePass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) return;

    dispatch(logIn(formData, navigate));
  };

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <h2 className="authTitle">Welcome Back</h2>

      <div className="formGroup">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="formGroup">
        <label>Password</label>
        <div className="passInput">
          <input
            type={visiblePass ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <span
            className="visibleIcon"
            onClick={() => setVisiblePass(!visiblePass)}
          >
            {visiblePass ? <BiSolidHide /> : <BiSolidShow />}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="authButton"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
