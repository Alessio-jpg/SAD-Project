import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "../Pages/HomePage/HomePage";
import ScoreBoard from "../Pages/ScoreBoard/ScoreBoard";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import App from "../main/App";

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/App" element={<App />} />
        <Route path="/ScoreBoard" element={<ScoreBoard />} />
      </Routes>
    </Router>
  );
}

export default Routing;