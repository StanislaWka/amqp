export default {
  vhosts: {
    "/": {
      connection: {
        url: "amqp://localhost:5672",
      },
      exchanges: ["e1", "e2"],
      queues: ["q1", "q2"],
      bindings: ["e1->q1", "e2->q2"],
      publications: {
        p1: {
          vhost: "/",
          exchange: "e1",
        },
        p2: {
          vhost: "/",
          exchange: "e2",
        },
      },
      subscriptions: {
        sub1: {
          queue: "q1",
        },
        sub2: {
          queue: "q2",
        },
      },
    },
  },
};
