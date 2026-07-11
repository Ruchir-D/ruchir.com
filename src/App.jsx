import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ACTIVE_DESIGN } from "./config.js";
import MangaPortfolio from "./designs/manga/MangaPortfolio.jsx";
import MangaCreator from "./designs/manga/MangaCreator.jsx";
import SimplePortfolio from "./designs/simple/SimplePortfolio.jsx";

const designs = {
  manga: MangaPortfolio,
  simple: SimplePortfolio,
};

export default function App() {
  const Design = designs[ACTIVE_DESIGN];
  return (
    <>
      <Routes>
        <Route path="/create" element={<MangaCreator />} />
        <Route
          path="*"
          element={
            Design ? (
              <Design />
            ) : (
              <div style={{ fontFamily: "monospace", padding: 40, color: "red" }}>
                Unknown design: "{ACTIVE_DESIGN}". Check src/config.js.
              </div>
            )
          }
        />
      </Routes>
      <Analytics />
    </>
  );
}
