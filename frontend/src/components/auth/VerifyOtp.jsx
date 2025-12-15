import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signUp, sendOTP } from '../../Services/auth/authService';

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const {loading, signupData} = useSelector((state)=> state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(!signupData) navigate('/auth');
  }, [signupData, navigate]);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
      fullName,
      email,
      number,
      password,
      confirmPassword,
    } = signupData;

    dispatch(signUp({fullName, email, number, password, confirmPassword, otp}, navigate));
  }

  return (
    <div className="otp-content">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="content-box">
          <h1 className="content-box-heading">
            Verify Email
          </h1>
          <p className="content-box-para">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder=""
                  className="otp-input"
                />
              )}
              containerStyle="otp-container"
            />
            <button type="submit" className="verify-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>
          <div className="links">
            <Link to="/auth" className="back-to-signup">
              <p><BiArrowBack /> Back To Signup</p>
            </Link>
            <button
              type="button"
              onClick={() => dispatch(sendOTP(signupData.email))}
              className="resend-button"
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerifyEmail;
