import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import RedirectPage from "./pages/RedirectPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:url" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
