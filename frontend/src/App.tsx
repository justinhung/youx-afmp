import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import NewApplication from "./pages/NewApplication";
import ViewApplication from "./pages/ViewApplication";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/application/new" element={<NewApplication />} />
        <Route path="/application/:id" element={<ViewApplication />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
