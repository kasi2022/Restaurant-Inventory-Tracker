const Item = require('../models/product_model');
const Transaction = require('../models/transaction_model')
const logConsumption = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityUsed, consumer } = req.body;

    console.log("🛠️ Received:", { id, quantityUsed, consumer }); // ✅ Add this

    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    const remainingQty = item.quantity - quantityUsed;
    item.quantity = remainingQty >= 0 ? remainingQty : 0;
    await item.save();

    const transaction = new Transaction({
      productId: id,
      productName: item.name,
      quantityUsed,
      unit: item.unit,
      consumer,
      createdBy: 'admin'
    });
    await transaction.save();

    res.status(200).json({ success: true, message: 'Consumption logged', item });
  } catch (err) {
    console.error("❌ Error in logConsumption:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


// Predict depletion alerts 
const predictDepletion = async (req, res) => {
  const thresholdDays = 3;

  try {
    const items = await Item.find();
    const alerts = [];

    for (const item of items) {
      const transactions = await Transaction.find({ productId: item._id })
        .sort({ createdAt: -1 })
        .limit(14);

      if (!transactions.length) continue;

      const dailyUsageMap = {};
      for (const tx of transactions) {
        const date = new Date(tx.createdAt).toISOString().slice(0, 10);
        dailyUsageMap[date] = (dailyUsageMap[date] || 0) + tx.quantityUsed;
      }

      const last7DaysUsage = Object.values(dailyUsageMap).slice(0, 7);
      const avgDailyUsage = last7DaysUsage.reduce((a, b) => a + b, 0) / last7DaysUsage.length;

      const daysLeft = avgDailyUsage > 0 ? Math.floor(item.quantity / avgDailyUsage) : null;

      if (daysLeft !== null && daysLeft <= thresholdDays) {
        alerts.push({
          name: item.name,
          unit: item.unit,
          quantity: item.quantity,
          daysLeft,
          reorderRecommendation: Math.ceil(avgDailyUsage * 7)
        });
      }
    }

    res.status(200).json({ success: true, alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Generate weekly restock calendar
const generateRestockCalendar = async (req, res) => {
  try {
    const items = await Item.find();
    const calendar = [];

    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      calendar.push({ date: date.toISOString().slice(0, 10), restockItems: [] });
    }

    for (const item of items) {
      const transactions = await Transaction.find({ productId: item._id }).sort({ createdAt: -1 }).limit(7);
      const avgDaily = transactions.length
        ? transactions.reduce((sum, tx) => sum + tx.quantityUsed, 0) / transactions.length
        : 0;

      const daysLeft = avgDaily > 0 ? Math.floor(item.quantity / avgDaily) : null;

      if (daysLeft !== null && daysLeft < 7) {
        const restockDay = new Date();
        restockDay.setDate(today.getDate() + daysLeft);
        const restockDateStr = restockDay.toISOString().slice(0, 10);

        const target = calendar.find(d => d.date === restockDateStr);
        if (target) {
          target.restockItems.push({
            name: item.name,
            quantityLeft: item.quantity,
            reorderQty: Math.ceil(avgDaily * 7),
          });
        }
      }
    }

    res.status(200).json({ success: true, calendar });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  logConsumption,
  predictDepletion,
  generateRestockCalendar,
};