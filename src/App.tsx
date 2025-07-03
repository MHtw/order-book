import { useState } from "react";
import "./App.css";

import OrderBook from "./components/OrderBook";

function App() {
  const [throttle, setThrottle] = useState(0);
  const [highlightNewRow, setHighlightNewRow] = useState(true);

  return (
    <div className="flex flex-col gap-5 items-center">
      <OrderBook
        symbol="BTCPFC"
        throttle={throttle}
        highlightNewRow={highlightNewRow}
      />

      <div role="separator" className="border h-px w-full border-gray-500" />

      <div className="flex flex-col gap-1">
        <div className="text-left font-bold">Debug Panel</div>
        <div className="flex items-center gap-1">
          <label>Speed:</label>
          <button
            onClick={() => {
              setThrottle(0);
            }}
          >
            instant
          </button>
          <button
            onClick={() => {
              setThrottle(10);
            }}
          >
            fast
          </button>
          <button
            onClick={() => {
              setThrottle(100);
            }}
          >
            slow
          </button>
        </div>
        <div className="flex gap-1">
          <input
            id="highlight"
            type="checkbox"
            checked={highlightNewRow}
            onChange={(e) => {
              setHighlightNewRow(e.target.checked);
            }}
          />
          <label htmlFor="highlight">Highlight new row</label>
        </div>
      </div>
    </div>
  );
}

export default App;
