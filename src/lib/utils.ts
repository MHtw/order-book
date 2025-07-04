import type { MessageData, SubscriptionData } from "../types";

export const jsonParseSafe = (str?: string) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
};

export const formatNumber = (value?: string) => {
  if (!value) {
    return "-";
  }

  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const isSubscribtionData = (
  data: MessageData
): data is SubscriptionData => {
  return (
    "event" in data &&
    (data.event === "subscribe" || data.event === "unsubscribe")
  );
};
