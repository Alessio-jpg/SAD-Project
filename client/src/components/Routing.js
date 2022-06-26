import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import ScoreBoard from "../Pages/ScoreBoard";
import App from "../main/App";

function Routing() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/App" element={<App />} />
        <Route path="/ScoreBoard" element={<ScoreBoard />} />
      </Routes>
    </Router>
  );
}

export default Routing;