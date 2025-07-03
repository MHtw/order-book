import Header from "./Header";
import LastPrice from "./LastPrice";
import PriceList from "./PriceList";

const OrderBook = () => {
  return (
    <div className="w-60 flex flex-col text-defaultfg bg-defaultbg gap-1">
      <div className="text-left font-bold px-2 py-1 border-b border-quotehead/10">
        Order Book
      </div>
      <Header />
      <PriceList side="SELL" />
      <LastPrice />
      <PriceList side="BUY" />
    </div>
  );
};

export default OrderBook;
