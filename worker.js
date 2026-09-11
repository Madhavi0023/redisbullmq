const { Worker } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "order-queue",
  async (job) => {
    console.log("================================");
    console.log("Processing order...");
    console.log("Job ID:", job.id);
    console.log("Job Name:", job.name);
    console.log("Order ID:", job.data.orderId);
    console.log("Email:", job.data.email);
    console.log("Attempt:", job.attemptsMade + 1);

    // Simulate payment failure
    if (job.data.orderId === "test-fail") {
      console.log("Simulating payment service failure...");
      throw new Error("Payment service unavailable");
    }

    console.log("Payment successful!");
    console.log("Order processed successfully.");

    return {
      success: true,
      orderId: job.data.orderId,
    };
  },
  {
    connection,
  }
);

worker.on("completed", (job, result) => {
  console.log("✅ Job completed:", job.id);
  console.log("Result:", result);
});

worker.on("failed", (job, err) => {
  console.log("❌ Job failed:", job.id);
  console.log("Reason:", err.message);
});

console.log("Worker is running...");