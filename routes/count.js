item



 
  app.get("/api/stocks/total", async (req, res) => {
    const totalStock = await Stock.sum("jumlah_stok");
    res.json({ totalStock });
  });
  