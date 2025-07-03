import Header from "./Header";
import LastPrice from "./LastPrice";
import PriceList from "./PriceList";

const OrderBook = () => {
  return (
    <div className="w-60 grid grid-cols-3">
      <Header />
      <PriceList side="asks" />
      <LastPrice />
      <PriceList side="bids" />
    </div>
  );
};

export default OrderBook;
