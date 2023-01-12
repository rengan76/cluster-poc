import { SQSClient } from "@aws-sdk/client-sqs";
import { Consumer } from "sqs-consumer";

const status = {
  averageRetrivalSpeed: 0,
  apiCalls: 0,
  noOfMessagesProcessed: 0,
};

const consumer = Consumer.create({
  sqs: new SQSClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: "",
      secretAccessKey: "",
    },
  }),
  batchSize: 10,
  attributeNames: ["All"],
  queueUrl: "https://sqs.us-east-1.amazonaws.com/599942416674/docker-poc",
  waitTimeSeconds: 1,
  handleMessageBatch: async (message) => {
    status.apiCalls = status.apiCalls + 1;
    status.noOfMessagesProcessed =
      status.noOfMessagesProcessed + message.length;

    console.log("message --->", message.length);
    return Promise.resolve();
    // do some work with `message`
  },
});

(async () => {
  status.averageRetrivalSpeed = 0;
  status.apiCalls = 0;
  status.noOfMessagesProcessed = 0;

  consumer.on("error", (err) => {
    console.error("error -->", err.message);
  });

  consumer.on("processing_error", (err) => {
    console.error("processing_error --->", err.message);
  });

  consumer.on("timeout_error", (err) => {
    console.error("timeout_error --->", err.message);
  });

  consumer.on("response_processed", () => console.log("----> Batch Processed"));

  consumer.on("empty", () => {
    status.averageRetrivalSpeed =
      status.noOfMessagesProcessed / status.apiCalls;

    consumer.stop();
    console.log("---> Consumer Stopped");

    return status;
  });
  console.log("---> Consumer Starts");

  consumer.start();
})();
