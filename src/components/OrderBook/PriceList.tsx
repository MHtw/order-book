import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { FC } from "react";
import { formatNumber } from "../../lib/utils";
import clsx from "clsx";

const PriceList: FC<{ side: "SELL" | "BUY" }> = ({ side }) => {
  const data = useSelector((state: RootState) => {
    if (side === "BUY") {
      return state.orderbook.bids;
    } else {
      return state.orderbook.asks;
    }
  });

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

  const components = rows.map(([key, value]) => {
    const currTotal = accTotal.toString();
    const valueNum = Number(value);

    accTotal -= valueNum;

    const bar = valueNum / total;

    return (
      <div
        key={key}
        className="grid grid-cols-3 relative hover:bg-quotehover tabular-nums text-sm"
      >
        <div
          className={clsx("text-center", {
            "text-buy": side === "BUY",
            "text-sell": side === "SELL",
          })}
        >
          {formatNumber(key)}
        </div>
        <div className="text-right">{formatNumber(value)}</div>
        <div className="text-right">{formatNumber(currTotal)}</div>
        <div
          className={clsx("h-full absolute right-0 top-0", {
            "bg-buy-alpha": side === "BUY",
            "bg-sell-alpha": side === "SELL",
          })}
          style={{
            width: `${bar * 100}%`,
          }}
        />
      </div>
    );
  });

  if (reverse) {
    components.reverse();
  }

  return <div className="flex flex-col gap-1 p-1">{components}</div>;
};

export default PriceList;
