<img width="1920" height="1080" alt="Screenshot (29)" src="https://github.com/user-attachments/assets/be16f16f-0105-4052-ae4e-d26b88268391" />
<img width="1920" height="1080" alt="Screenshot (26)" src="https://github.com/user-attachments/assets/96e0c6c4-0f44-4564-8d44-4aa1c6138f63" />


Invoke-RestMethod -Uri http://localhost:3000/order `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"orderId":"ORD-200","email":"demo@example.com"}'

<img width="1920" height="1080" alt="Screenshot (28)" src="https://github.com/user-attachments/assets/4040231c-6b64-49a9-9e94-ec0f57fc9a3f" />

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

<img width="1920" height="1080" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/9303d10a-f276-457b-a601-46b852372dcb" />


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
                <img width="1920" height="1080" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/fe807b2b-d351-bcbe-c16c3932aa81" />

                └──────────────────┘
