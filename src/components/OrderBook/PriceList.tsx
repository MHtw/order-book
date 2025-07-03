import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { type FC } from "react";
import PriceRow from "./PriceRow";

const PriceList: FC<{ side: "SELL" | "BUY" }> = ({ side }) => {
  const [data] = useSelector(
    (state: RootState) => {
      const priceData =
        side === "BUY" ? state.orderbook.bids : state.orderbook.asks;

      return [
        priceData,
        state.orderbook.seqNum,
        state.orderbook.config.throttle,
      ] as const;
    },
    (prev, next) => {
      const [prevData, prevSeq] = prev;
      const [nextData, nextSeq, throttle] = next;

      if (nextSeq > prevSeq + throttle) {
        return prevData === nextData;
      }

      return true;
    }
  );

  const reverse = side === "BUY";

  const rows = Object.entries(data)
    .sort(([keyA], [keyB]) =>
      reverse ? Number(keyA) - Number(keyB) : Number(keyB) - Number(keyA)
    )
    .slice(0, 8);

  const total = rows.reduce((acc, cur) => {
    return acc + Number(cur[1]);
  }, 0);

  let accTotal = total;

  const components = rows.map(([price, size]) => {
    const currTotal = accTotal.toString();
    const sizeNum = Number(size);

    accTotal -= sizeNum;

    const bar = sizeNum / total;

    return (
      <PriceRow
        key={price}
        side={side}
        price={price}
        size={size}
        total={currTotal}
        barWidth={`${bar * 100}%`}
      />
    );
  });

  if (reverse) {
    components.reverse();
  }

  return <div className="flex flex-col gap-1 p-1">{components}</div>;
};

export default PriceList;
