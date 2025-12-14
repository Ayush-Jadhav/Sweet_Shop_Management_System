import { useState } from "react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../Services/auth/authService";
import { setSignupData } from "../../redux/slice/authSlice";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [visiblePass, setVisiblePass] = useState(false);
  const [visibleConfirmPass, setVisibleConfirmPass] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    role: "user", 
    password: "",
    confirmPassword: "",
  });

const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  dispatch(setSignupData(formData));   // store temp data
  dispatch(sendOTP(formData.email, formData.number, navigate));
};

  return (
    <form className="signUpForm signup-scroll" onSubmit={handleSubmit}>

      <div className="formGroup">
        <label>First Name</label>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="formGroup">
        <label>Last Name</label>
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="formGroup">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="formGroup">
        <label>Phone Number</label>
        <input
          name="number"
          value={formData.number}
          onChange={handleChange}
          required
        />
      </div>

      <div className="formGroup">
        <label>Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="formGroup">
        <label>Password</label>
        <div className="passInput">
          <input
            type={visiblePass ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span onClick={() => setVisiblePass(!visiblePass)}>
            {visiblePass ? <BiSolidHide /> : <BiSolidShow />}
          </span>
        </div>
      </div>

      <div className="formGroup">
        <label>Confirm Password</label>
        <div className="passInput">
          <input
            type={visibleConfirmPass ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span onClick={() => setVisibleConfirmPass(!visibleConfirmPass)}>
            {visibleConfirmPass ? <BiSolidHide /> : <BiSolidShow />}
          </span>
        </div>
      </div>

      <button type="submit" className="authButton">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
