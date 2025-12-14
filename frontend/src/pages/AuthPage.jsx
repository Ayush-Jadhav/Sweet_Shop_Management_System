import { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import SignUpForm from "../components/auth/SignUpForm";
import "./AuthPage.css";

const AuthPage = () => {
  const [form, setForm] = useState("login");

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Toggle */}
        <div className="auth-toggle">
          <button
            className={form === "login" ? "active" : ""}
            onClick={() => setForm("login")}
          >
            Login
          </button>
          <button
            className={form === "signup" ? "active" : ""}
            onClick={() => setForm("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Forms */}
        <div className="auth-content">
          {form === "login" && <LoginForm />}
          {form === "signup" && <SignUpForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
