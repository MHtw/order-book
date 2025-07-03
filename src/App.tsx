import "./App.css";

import OrderBook from "./components/OrderBook";

function App() {
  return (
    <div className="w-60 h-fit flex flex-col">
      <div className="">Order Book</div>
      <OrderBook symbol="BTCPFC" />
    </div>
  );
}

export default App;
