import { faker } from "@faker-js/faker";
import express from "express";
import { BrokerAsPromised } from "rascal";
import config from "./config";

const FIRST_QUEUE = "firstQueue";
const SECOND_QUEUE = "secondQueue";

const backendUrl = "amqp://localhost";

let broker: BrokerAsPromised;

const app = express();
const port = 8000;

app.get("/send/query1", async (req, res) => {
  try {
    const message = {
      id: faker.datatype.uuid(),
      message: faker.word.adjective(),
    };
    const publication = await broker.publish("p1", message);
    publication.on("error", (err: any, messageId: any) => {
      console.error("Publisher error", err, messageId);
    });

    res.send("Hello query1!");
  } catch (err) {
    console.error(err);
    throw err;
  }
});

app.get("/send/query2", async (req, res) => {
  try {
    const message = {
      id: 1,
      message: faker.word.adjective(),
    };

    const publish = await broker.publish("p2", message);
    publish.on("error", (err: any, messageId: any) => {
      console.error("Publisher error", err, messageId);
    });

    res.send("Hello query2!");
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, async () => {
  broker = await BrokerAsPromised.create(config);
  broker.on("error", console.error);
  console.log(`Example app listening on port ${port}`);
});
