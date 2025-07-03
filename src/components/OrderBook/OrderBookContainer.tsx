import { useEffect, useMemo, type FC } from "react";
import { createStore } from "../../store";
import { WS_URL, ORDER_BOOK_WS_URL } from "../../constants";
import OrderBook from "./OrderBook";
import { Provider } from "react-redux";
import type { OrderBookData, TradeHistoryData } from "../../types";
import { useTopicStream } from "../../lib/useTopicStream";

const OrderBookContainer: FC<{
  symbol: string;
  throttle?: number;
  highlightNewRow?: boolean;
}> = ({ symbol, throttle = 0, highlightNewRow = true }) => {
  const { store, lastpriceActions, orderbookActions } = useMemo(() => {
    return createStore(symbol);
  }, [symbol]);

  useTopicStream<TradeHistoryData>({
    url: WS_URL,
    topic: `tradeHistoryApi:${symbol}`,
    pingpong: true,
    onData: (msgData) => {
      const lastHistory = msgData.data[0];

      if (!lastHistory) {
        return;
      }

      store.dispatch(lastpriceActions.update(lastHistory));
    },
  });

  useTopicStream<OrderBookData>({
    url: ORDER_BOOK_WS_URL,
    topic: `update:${symbol}`,
    onData: (msgData) => {
      if (msgData.data.type === "snapshot") {
        store.dispatch(orderbookActions.init(msgData.data));
      } else {
        store.dispatch(orderbookActions.update(msgData.data));
      }
    },
  });

  useEffect(() => {
    store.dispatch(
      orderbookActions.setConfig({
        throttle,
        highlightNewRow,
      })
    );
  }, [throttle, highlightNewRow]);

  return (
    <Provider store={store}>
      <OrderBook />
    </Provider>
  );
};

export default OrderBookContainer;
