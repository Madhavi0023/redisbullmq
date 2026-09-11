Invoke-RestMethod -Uri http://localhost:3000/order `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"orderId":"ORD-200","email":"demo@example.com"}'


  Invoke-RestMethod -Uri http://localhost:3000/order `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"orderId":"test-fail","email":"demo@example.com"}'
  Invoke-RestMethod http://localhost:3000/queue-status


  app.get("/queue-status", async (req, res) => {
  const counts = await orderQueue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed"
  );

  res.json(counts);
});

                    Client / User
                         │
                         │ POST /order
                         ▼
                ┌──────────────────┐
                │   Express API    │
                │    server.js     │
                └────────┬─────────┘
                         │
                         │ Add Job
                         ▼
                ┌──────────────────┐
                │      BullMQ      │
                │   order-queue    │
                └────────┬─────────┘
                         │
                         │ Stores queue/job data
                         ▼
                ┌──────────────────┐
                │      Redis       │
                │   localhost:6379 │
                └────────┬─────────┘
                         ▲
                         │ Fetch Job
                         │
                ┌────────┴─────────┐
                │  BullMQ Worker   │
                │    worker.js     │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Order Processing │
                │ Payment / Email  │
                │ External APIs    │
                └──────────────────┘
