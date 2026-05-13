import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListPage from "./pages/ListPage";
import UploadPage from "./pages/UploadPage";
import PostDetailPage from "./pages/PostDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ListPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;