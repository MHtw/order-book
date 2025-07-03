import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { formatNumber } from "../../lib/utils";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const LastPrice = () => {
  const { data } = useSelector((state: RootState) => state.lastprice);

  const { price } = data ?? {};

  const [direction, setDirection] = useState<"same" | "down" | "up">("same");

  const prevPriceRef = useRef<number>(null);

  useEffect(() => {
    if (typeof price !== "number") {
      return;
    }

    let nextDirection: typeof direction;
    const prevPrice = prevPriceRef.current;

    if (prevPrice === null || price === prevPrice) {
      nextDirection = "same";
    } else if (price > prevPrice) {
      nextDirection = "up";
    } else {
      nextDirection = "down";
    }

    prevPriceRef.current = price;

    setDirection(nextDirection);
  }, [price]);

  return (
    <div
      className={clsx("p-0.5 text-lg tabular-nums font-bold", {
        "bg-buy-alpha text-buy": direction === "up",
        "bg-same-alpha": direction === "same",
        "bg-sell-alpha text-sell": direction === "down",
      })}
    >
      {typeof price === "number" ? formatNumber(price.toFixed(1)) : ""}
    </div>
  );
};

export default LastPrice;
