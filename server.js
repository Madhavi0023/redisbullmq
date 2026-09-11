const express = require("express");
const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const app = express();

app.use(express.json());

// =========================
// Redis connection
// =========================

const connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null,
});

// =========================
// BullMQ Queue
// =========================

const orderQueue = new Queue("order-queue", {
  connection,
});

// =========================
// Create Order API
// =========================

app.post("/order", async (req, res) => {
  try {
    const { orderId, email } = req.body;

    if (!orderId || !email) {
      return res.status(400).json({
        message: "orderId and email are required",
      });
    }

    const job = await orderQueue.add(
      "process-order",
      {
        orderId,
        email,
      },
      {
        attempts: 3,

        // Exponential retry:
        // 2 sec → 4 sec → 8 sec
        backoff: {
          type: "exponential",
          delay: 2000,
        },

        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    console.log(`Job added: ${job.id}`);

    res.status(201).json({
      message: "Order added to queue successfully",
      jobId: job.id,
      orderId,
    });
  } catch (error) {
    console.error("Error adding job:", error);

    res.status(500).json({
      message: "Failed to add order to queue",
    });
  }
});
// =========================
// Queue Status API
// =========================

app.get("/queue-status", async (req, res) => {
  try {
    const counts = await orderQueue.getJobCounts(
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed"
    );

    res.json({
      queue: "order-queue",
      status: counts,
    });
  } catch (error) {
    console.error("Error getting queue status:", error);

    res.status(500).json({
      message: "Failed to get queue status",
    });
  }
});
// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.send("Redis + BullMQ Order Processing System is running");
});

// =========================
// Start Server
// =========================

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
