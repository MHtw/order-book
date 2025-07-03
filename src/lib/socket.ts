import { jsonParseSafe } from "./utils";

export type OnDataCallback<T = any> = (data: T) => void;

const instanceMap = new Map<
  string,
  {
    socket: WebSocket;
    topics: Map<string, Set<OnDataCallback>>;
  }
>();

export const createStream = (url: string) => {
  let instance = instanceMap.get(url);

  if (!instance) {
    const socket = new WebSocket(url);
    const topics = new Map<string, Set<OnDataCallback>>();

    instance = {
      socket,
      topics,
    };

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          op: "subscribe",
          args: Array.from(topics.keys()),
        })
      );
    };

    const pingpongInterval = setInterval(() => {
      if (socket.readyState !== WebSocket.OPEN) {
        return;
      }

      socket.send(JSON.stringify({ op: "ping" }));
    }, 1e4);

    socket.addEventListener("close", () => {
      clearInterval(pingpongInterval);
    });

    socket.onmessage = (e) => {
      const msgData = jsonParseSafe(e.data);

      if (!msgData) {
        return;
      }

      const { topic } = msgData;

      const topicListeners = instance?.topics.get(topic);

      topicListeners?.forEach((onData) => {
        onData(msgData);
      });
    };

    instanceMap.set(url, instance);
  }

  return {
    subscribe<T = any>(topic: string, onData: OnDataCallback<T>) {
      const { socket, topics } = instance;

      let topicCallbacks = topics.get(topic);

      if (topicCallbacks) {
        topicCallbacks.add(onData);
      } else {
        topicCallbacks = new Set([onData]);
        topics.set(topic, topicCallbacks);

        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              op: "subscribe",
              args: [topic],
            })
          );
        }
      }

      const unsubscribe = () => {
        topicCallbacks.delete(onData);

        if (topicCallbacks.size === 0) {
          socket.send(
            JSON.stringify({
              op: "unsubscribe",
              args: [topic],
            })
          );
        }
      };

      return {
        unsubscribe,
        resubscribe: () => {
          socket.send(
            JSON.stringify({
              op: "unsubscribe",
              args: [topic],
            })
          );
          socket.send(
            JSON.stringify({
              op: "subscribe",
              args: [topic],
            })
          );
        },
      };
    },
  };
};
