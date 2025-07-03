import {
  createSlice,
  configureStore,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { HistoryData, OrderBookData } from "./types";

type OrderBookState = {
  asks: Record<string, string>;
  bids: Record<string, string>;
  seqNum: number;
};

type LastPriceState = {
  data: HistoryData | null;
};

export type RootState = {
  orderbook: OrderBookState;
  lastprice: LastPriceState;
};

const createOrderbookSlice = (symbol: string) => {
  const initialState: OrderBookState = {
    asks: {},
    bids: {},
    seqNum: 0,
  };

  return createSlice({
    name: `orderbook:${symbol}`,
    initialState,
    reducers: {
      init: (state, action: PayloadAction<OrderBookData["data"]>) => {
        const { seqNum, asks, bids } = action.payload;

        state.asks = {};
        state.bids = {};

        asks.forEach(([price, size]) => {
          state.asks[price] = size;
        });
        bids.forEach(([price, size]) => {
          state.bids[price] = size;
        });

        state.seqNum = seqNum;
      },
      update: (state, action: PayloadAction<OrderBookData["data"]>) => {
        const {
          seqNum,
          asks,
          bids,
          symbol: payloadSymbol,
          prevSeqNum,
        } = action.payload;

        if (payloadSymbol !== symbol) {
          throw Error("incorrect symbol");
        }

        if (state.seqNum !== prevSeqNum) {
          throw Error("discontinuous");
        }

        asks.forEach(([price, size]) => {
          if (size === "0") {
            delete state.asks[price];
          } else {
            state.asks[price] = size;
          }
        });

        bids.forEach(([price, size]) => {
          if (size === "0") {
            delete state.bids[price];
          } else {
            state.bids[price] = size;
          }
        });

        state.seqNum = seqNum;
      },
    },
  });
};

const createLastPriceSlice = (symbol: string) => {
  const initialState: LastPriceState = {
    data: null,
  };

  return createSlice({
    name: `lastprice:${symbol}`,
    initialState,
    reducers: {
      update: (state, action: PayloadAction<HistoryData>) => {
        const data = action.payload;

        state.data = data;
      },
    },
  });
};

export const createStore = (symbol: string) => {
  const orderbookSlice = createOrderbookSlice(symbol);

  const lastpriceSlice = createLastPriceSlice(symbol);

  const store = configureStore({
    reducer: {
      orderbook: orderbookSlice.reducer,
      lastprice: lastpriceSlice.reducer,
    },
  });

  const orderbookActions = orderbookSlice.actions;
  const lastpriceActions = lastpriceSlice.actions;

  return {
    store,
    lastpriceActions,
    orderbookActions,
  };
};
