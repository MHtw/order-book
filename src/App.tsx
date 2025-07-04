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

      <div className="flex flex-col gap-2">
        <div className="text-left font-bold">Debug Panel</div>
        <div className="flex items-center gap-1">
          <div>Speed:</div>
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
          <div className="text-xs mx-2">
            (The speed of the price update, default "instant")
          </div>
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
          <label htmlFor="highlight">
            Highlight new row
            <span className="text-xs mx-2">
              (Uncheck to disable the quote highlight animation)
            </span>
          </label>
        </div>
        <div className="flex gap-1 items-center">
          <span>Click</span>
          <button
            onClick={() => {
              // @ts-expect-error debug only
              globalThis.__DEGUB_ONLY_VALUE_SKIP_ONE_MSG__ = true;
            }}
          >
            skip
          </button>
          <span>
            to skip a socket message for testing the re-subscribe flow
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
