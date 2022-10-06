import client, { Connection, Channel, ConsumeMessage } from "amqplib";
import amqp from "amqplib/callback_api";

import { BrokerAsPromised } from "rascal";
import config from "./config";

const FIRST_QUEUE = "firstQueue";
const SECOND_QUEUE = "secondQueue";

const backendUrl = "amqp://localhost";

(async () => {
  try {
    const broker = await BrokerAsPromised.create(config as any);
    broker.on("error", console.error);

    // Consume a message
    const subscription = await broker.subscribe("sub1");
    subscription
      .on("message", (message, content, ackOrNack) => {
        console.log("First queue", content);
        ackOrNack();
      })
      .on("error", (err) => {
        console.error("Subscriber error", err);
      });

    const secondSub = await broker.subscribe("sub2");
    secondSub
      .on("message", (message, content, ackOrNack) => {
        console.log("Second queue", content);

        ackOrNack(new Error(), [
            { strategy: "republish", defer: 1000, attempts: 5 },
            { strategy: "nack" },
          ]);
      })
      .on("error", (err) => {
        console.error("Subscriber error", err);
      })
  } catch (err) {
    console.error(err);
  }
})();
