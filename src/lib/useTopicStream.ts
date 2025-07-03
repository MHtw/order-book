import { useEffect } from "react";
import type { MessageData } from "../types";
import { createStream, type OnDataCallback } from "./socket";

export const useTopicStream = <T extends MessageData>(args: {
  url: string;
  topic: string;
  onData: OnDataCallback<T>;
}) => {
  const { url, topic, onData } = args;

  useEffect(() => {
    const stream = createStream(url);

    const subscription = stream.subscribe<T>(topic, (...args) => {
      try {
        onData(...args);
      } catch (error) {
        console.error(error);
        subscription.resubscribe();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [url, topic, onData]);
};
