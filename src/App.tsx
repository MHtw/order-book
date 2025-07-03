import "./App.css";

import OrderBook from "./components/OrderBook";

function App() {
  return <OrderBook symbol="BTCPFC" throttle={0} highlightNewRow={true} />;
}

export default App;
