import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ScoreBoard from "./Pages/ScoreBoard";
import App from "./Pages/App";

function Routing() {
  return (
    <Router>
      <nav>
        <Link to="/"> HomePage </Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/App" element={<App />} />
        <Route path="/ScoreBoard" element={<ScoreBoard />} />
      </Routes>
    </Router>
  );
}

export default Routing;