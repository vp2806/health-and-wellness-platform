const { Queue, Worker } = require("bullmq");
const csvWriter = require("csv-writer");
const path = require("path");

const medicationReportQueue = new Queue("reportQueue", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});

const sendReportWorker = new Worker(
  "reportQueue",
  async (job) => {
    console.log("Job is successfully processed by worker.....", job.data);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

// medicationReportQueue.add(
//   "demoReport",
//   { type: "demo job" },
//   {
//     delay: 5000,
//   }
// );

module.exports = medicationReportQueue;
