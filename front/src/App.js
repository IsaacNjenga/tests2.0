import React from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.js";
import Home from "./pages/home.js";
import UploadPdf from "./pages/uploadPDF/uploadPDF.js";
import Chatbot from "./pages/chatbot/chatbot.js";

axios.defaults.baseURL = "http://localhost:3001/back";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path="upload-pdf" element={<UploadPdf />} />
            <Route path="chatbot" element={<Chatbot />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
