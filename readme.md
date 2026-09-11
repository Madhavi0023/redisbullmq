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