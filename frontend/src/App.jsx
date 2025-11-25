import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateLink from "./pages/CreateLink";
import OpenLink from "./pages/OpenLink";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateLink />} />

        <Route path="/:code" element={<OpenLink />} />
      </Routes>
    </BrowserRouter>
  );
}
