import React from 'react';
import { ACTIVE_DESIGN } from './config.js';
import MangaPortfolio from './designs/manga/MangaPortfolio.jsx';

const designs = {
  manga: MangaPortfolio,
};

export default function App() {
  const Design = designs[ACTIVE_DESIGN];
  if (!Design) {
    return (
      <div style={{ fontFamily: 'monospace', padding: 40, color: 'red' }}>
        Unknown design: "{ACTIVE_DESIGN}". Check src/config.js.
      </div>
    );
  }
  return <Design />;
}
