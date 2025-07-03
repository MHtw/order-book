import { useEffect, useRef } from "react";
import type { MessageData } from "../types";
import { createStream, type OnDataCallback } from "./socket";

export const useTopicStream = <T extends MessageData>(args: {
  url: string;
  topic: string;
  onData: OnDataCallback<T>;
  pingpong?: boolean;
}) => {
  const { url, topic, onData, pingpong } = args;

  const onDataRef = useRef(onData);

  onDataRef.current = onData;

  useEffect(() => {
    const stream = createStream(url, pingpong);

    const subscription = stream.subscribe<T>(topic, (...args) => {
      try {
        onDataRef.current(...args);
      } catch (error) {
        console.error(error);
        subscription.resubscribe();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [url, topic]);
};
