import { useEffect, useRef, useState, type FC } from "react";
import { formatNumber } from "../../lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import clsx from "clsx";

const PriceRow: FC<{
  side: "BUY" | "SELL";
  price: string;
  size: string;
  total: string;
  barWidth: string;
}> = ({ side, price, size, total, barWidth }) => {
  const prevSizeRef = useRef(size);
  const [sizeDirection, setSizeDirection] = useState<"same" | "down" | "up">(
    "same"
  );

  const highlightNewRow = useSelector(
    (state: RootState) => state.orderbook.config.highlightNewRow
  );

  useEffect(() => {
    let nextDirection: typeof sizeDirection;
    const prevSize = prevSizeRef.current;

    if (size === prevSize) {
      nextDirection = "same";
    } else if (size > prevSize) {
      nextDirection = "up";
    } else {
      nextDirection = "down";
    }

    prevSizeRef.current = size;

    setSizeDirection(nextDirection);
  }, [size]);

  return (
    <div className="hover:bg-quotehover">
      <div
        className={clsx("grid grid-cols-3 relative tabular-nums text-sm", {
          "animate-buy-flash": highlightNewRow && side === "BUY",
          "animate-sell-flash": highlightNewRow && side === "SELL",
        })}
      >
        <div
          className={clsx("text-center", {
            "text-buy": side === "BUY",
            "text-sell": side === "SELL",
          })}
        >
          {formatNumber(price)}
        </div>
        <div
          className={clsx("text-right", {
            "animate-buy-flash": sizeDirection === "up",
            "animate-sell-flash": sizeDirection === "down",
          })}
        >
          {formatNumber(size)}
        </div>
        <div className="text-right">{formatNumber(total)}</div>
        <div
          className={clsx("h-full absolute right-0 top-0", {
            "bg-buy-alpha": side === "BUY",
            "bg-sell-alpha": side === "SELL",
          })}
          style={{
            width: barWidth,
          }}
        />
      </div>
    </div>
  );
};

export default PriceRow;
