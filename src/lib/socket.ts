import { isSubscribtionData, jsonParseSafe } from "./utils";

export type OnDataCallback<T = any> = (data: T) => void;

const instanceMap = new Map<
  string,
  {
    socket: WebSocket;
    topics: Map<string, Set<OnDataCallback>>;
    resubscribingTopics: Set<string>;
  }
>();

export const createStream = (url: string, pingpong?: boolean) => {
  let instance = instanceMap.get(url);

  if (!instance) {
    const socket = new WebSocket(url);
    const topics = new Map<string, Set<OnDataCallback>>();
    const resubscribingTopics = new Set<string>();

    instance = {
      socket,
      topics,
      resubscribingTopics,
    };

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          op: "subscribe",
          args: Array.from(topics.keys()),
        })
      );
    };

    if (pingpong) {
      const pingpongInterval = setInterval(() => {
        if (socket.readyState !== WebSocket.OPEN) {
          return;
        }

        socket.send(JSON.stringify({ op: "ping" }));
      }, 1e4);

      socket.addEventListener("close", () => {
        clearInterval(pingpongInterval);
      });
    }

    socket.onmessage = (e) => {
      const msgData = jsonParseSafe(e.data);

      if (!msgData) {
        return;
      }

      const topic =
        msgData.topic === "tradeHistoryApi"
          ? `${msgData.topic}:${msgData.data[0].symbol}` // workaround
          : msgData.topic;

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
        resubscribe: async () => {
          const resubscribingTopics = instance.resubscribingTopics;

          if (resubscribingTopics.has(topic)) {
            return;
          }

          const action = (event: "subscribe" | "unsubscribe") => {
            return new Promise<void>((resolve) => {
              const handleMessage = (e: MessageEvent) => {
                const msgData = jsonParseSafe(e.data);

                if (!msgData || !isSubscribtionData(msgData)) {
                  return;
                }

                if (
                  msgData.event !== event ||
                  !msgData.channel.includes(topic)
                ) {
                  return;
                }

                socket.removeEventListener("message", handleMessage);
                resolve();
              };

              socket.addEventListener("message", handleMessage);

              socket.send(
                JSON.stringify({
                  op: event,
                  args: [topic],
                })
              );
            });
          };

          resubscribingTopics.add(topic);

          await action("unsubscribe");
          await action("subscribe");

          resubscribingTopics.delete(topic);
        },
      };
    },
  };
};
