import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { Fragment } from "react/jsx-runtime";
import type { FC } from "react";

const PriceList: FC<{ side: "asks" | "bids" }> = ({ side }) => {
  const data = useSelector((state: RootState) => state.orderbook[side]);

  const reverse = side === "bids";

  const rows = Object.entries(data)
    .sort(([keyA], [keyB]) =>
      reverse ? Number(keyA) - Number(keyB) : Number(keyB) - Number(keyA)
    )
    .slice(0, 8);

  let total = rows.reduce((acc, cur) => {
    return acc + Number(cur[1]);
  }, 0);

  const components = rows.map(([key, value]) => {
    const curTotal = total;

    total -= Number(value);

    return (
      <Fragment key={key}>
        <div className="">{key}</div>
        <div className="">{value}</div>
        <div className="">{curTotal}</div>
      </Fragment>
    );
  });

  if (reverse) {
    components.reverse();
  }

  return <>{components}</>;
};

export default PriceList;
