import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SharePage from "./SharePage";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* MAIN APP */}
      <Route path="/" element={<App />} />

      {/* SHARE PAGE */}
      <Route path="/share/:id" element={<SharePage />} />
    </Routes>
  </BrowserRouter>
);