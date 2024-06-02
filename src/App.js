import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import { Navbar } from "./components/common/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { About } from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import OpenRoute from "./components/core/Auth/OpenRoute";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="bg-richblack-900">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        z
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
