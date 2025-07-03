export type HistoryData = {
  symbol: string;
  side: "SELL" | "BUY";
  size: number;
  price: number;
  tradeId: number;
  timestamp: number;
};

export type TradeHistoryData = {
  topic: string;
  data: HistoryData[];
};

export type Quote = [number, number];

export type OrderBookData = {
  topic: string;
  data: {
    bids: Quote[];
    asks: Quote[];
    prevSeqNum: number;
    seqNum: number;
    symbol: string;
    timestamp: number;
    type: "snapshot" | "delta";
  };
};

export type MessageData = TradeHistoryData | OrderBookData;
