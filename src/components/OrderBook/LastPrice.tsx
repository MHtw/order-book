import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const LastPrice = () => {
  const lastprice = useSelector((state: RootState) => state.lastprice);

  return (
    <div className="col-span-3">{`${lastprice.data?.price} ${lastprice.data?.side}`}</div>
  );
};

export default LastPrice;
