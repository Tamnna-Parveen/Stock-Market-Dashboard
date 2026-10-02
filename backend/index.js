require("dotenv").config();

const cron=require('node-cron');
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model/User');
const GTTModel=require('./model/GTTModel');
const FundsModel = require('./model/FundsModel');

const bodyParser = require("body-parser");
const cors = require("cors");

const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const HoldingsModel = require("./model/HoldingsModel");
const PositionsModel = require("./model/PositionsModel");
const OrdersModel = require('./model/OrdersModel');

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

app.use(cors());
app.use(bodyParser.json());


// Live price fetch karne ka helper function
async function getLivePrice(stockName) {
  try {
    // NSE stocks ke liye ".NS" suffix lagana padta hai (jaise RELIANCE.NS)
    const quote = await yahooFinance.quote(`${stockName}.NS`);

    // Agar quote hi undefined hai ya price field missing hai (jaise illiquid/delisted symbols)
    if (!quote || quote.regularMarketPrice === undefined) {
      console.warn(`No live data available for ${stockName}, using stored price`);
      return null;
    }

    return quote.regularMarketPrice;
  } catch (error) {
    console.error(`Price fetch failed for ${stockName}:`, error.message);
    return null; // agar fail ho to null return karo
  }
}

// ✅ SIGNUP route
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Saari fields fill karo' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email pehle se registered hai' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ LOGIN route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ya password galat hai' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ya password galat hai' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ⚠️ Ye route sirf EK BAAR chalana hai, fresh data seed karne ke liye
// app.get("/addHoldings", async (req, res) => {
//   let tempHoldings = [
//     { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
//     { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
//     { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
//     { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", isLoss: true },
//     { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
//     { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
//     { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%", isLoss: true },
//     { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
//     { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%", isLoss: true },
//     { name: "SGBMAY29I", qty: 2, avg: 4727.0, price: 4719.0, net: "-0.17%", day: "+0.15%" },
//     { name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%", isLoss: true },
//     { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true },
//     { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
//   ];

//   await HoldingsModel.deleteMany({}); // ✅ pehle purana data clear karo (duplicate se bachne ke liye)

//   tempHoldings.forEach((item) => {
//     let newHolding = new HoldingsModel({
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//     });
//     newHolding.save();
//   });

//   res.send("Done!");
// });

// // ⚠️ Ye bhi sirf EK BAAR chalana hai
// app.get("/addPositions", async (req, res) => {
//   let tempPositions = [
//     { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
//     { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
//   ];

//   await PositionsModel.deleteMany({}); // ✅ purana data clear karo

//   tempPositions.forEach((item) => {
//     let newPosition = new PositionsModel({
//       product: item.product,
//       name: item.name,
//       qty: item.qty,
//       avg: item.avg,
//       price: item.price,
//       net: item.net,
//       day: item.day,
//       isLoss: item.isLoss,
//     });
//     newPosition.save();
//   });

//   res.send("Done!");
// });


app.get('/allHoldings', async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});

    // Har holding ke liye live price fetch karo
    const updatedHoldings = await Promise.all(
      allHoldings.map(async (holding) => {
        const livePrice = await getLivePrice(holding.name);

        return {
          ...holding._doc,
          price: livePrice !== null ? livePrice : holding.price, // fail ho to purani price use karo
        };
      })
    );

    res.json(updatedHoldings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching holdings' });
  }
});

app.get('/allPositions', async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});

    const updatedPositions = await Promise.all(
      allPositions.map(async (position) => {
        const livePrice = await getLivePrice(position.name);

        return {
          ...position._doc,
          price: livePrice !== null ? livePrice : position.price,
        };
      })
    );

    res.json(updatedPositions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching positions' });
  }
});

// ✅ Saare orders fetch karo
app.get('/allOrders', async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({});
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// ✅ Naya order place karo + Holdings automatically update karo
app.post('/newOrder', async (req, res) => {
  try {
    const { name, qty, price, mode, orderType,product} = req.body;

    // Agar orderType nahi bheja gaya, default MARKET maano
    const type = orderType || 'MARKET';

    // MARKET order turant "EXECUTED" hoga, LIMIT order "OPEN" rahega
    const status = type === 'LIMIT' ? 'OPEN' : 'EXECUTED';

    // 1. Order ko save karo
    let newOrder = new OrdersModel({
      name,
      qty,
      price,
      mode,
      orderType:type,
      product,
    });
    await newOrder.save();

     // ✅ Sirf EXECUTED orders ka effect Holdings pe turant padega
    if (status === 'EXECUTED') {
      const existingHolding = await HoldingsModel.findOne({ name });

      if (mode === 'BUY') {
        if (existingHolding) {
          // Pehle se stock hai to average price aur qty update karo
          const totalQty = existingHolding.qty + Number(qty);
          const totalCost = (existingHolding.avg * existingHolding.qty) + (price * qty);
          existingHolding.avg = totalCost / totalQty;
          existingHolding.qty = totalQty;
          existingHolding.price = price;
          await existingHolding.save();
        } else {
          // Naya stock hai, fresh holding banao
          const newHolding = new HoldingsModel({
            name,
            qty: Number(qty),
            avg: price,
            price: price,
            net: "+0.00%",
            day: "+0.00%",
          });
          await newHolding.save();
        }
      } else if (mode === 'SELL') {
        if (existingHolding) {
          existingHolding.qty -= Number(qty);

          if (existingHolding.qty <= 0) {
            // Poora stock bech diya, holding delete kardo
            await HoldingsModel.deleteOne({ name });
          } else {
            await existingHolding.save();
          }
        }
        // Agar holding hai hi nahi aur sell try kiya, to kuch nahi hota (edge case, chaho to error bhej sakte ho)
      }
    }

    res.status(201).json({ message: 'Order placed!', order: newOrder });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error placing order' });
  }
});

app.delete('/cancelOrder/:id', async (req, res) => {
  try {
    const order = await OrdersModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order nahi mila' });
    }

    if (order.status !== 'OPEN') {
      return res.status(400).json({ message: 'Sirf Open orders hi cancel ho sakte hain' });
    }

    await OrdersModel.findByIdAndDelete(req.params.id);

    res.json({ message: 'Order cancelled successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
});

app.get('/checkLimitOrders', async (req, res) => {
  try {
    const openOrders = await OrdersModel.find({ status: 'OPEN' });

    for (const order of openOrders) {
      const livePrice = await getLivePrice(order.name);
      if (livePrice === null) continue;

      let shouldExecute = false;

      if (order.mode === 'BUY' && livePrice <= order.price) shouldExecute = true;
      if (order.mode === 'SELL' && livePrice >= order.price) shouldExecute = true;

      if (shouldExecute) {
        order.status = 'EXECUTED';
        await order.save();

        const existingHolding = await HoldingsModel.findOne({ name: order.name });
        if (order.mode === 'BUY') {
          if (existingHolding) {
            const totalQty = existingHolding.qty + order.qty;
            const totalCost = (existingHolding.avg * existingHolding.qty) + (order.price * order.qty);
            existingHolding.avg = totalCost / totalQty;
            existingHolding.qty = totalQty;
            await existingHolding.save();
          } else {
            await new HoldingsModel({
              name: order.name, qty: order.qty, avg: order.price, price: order.price,
              net: "+0.00%", day: "+0.00%",
            }).save();
          }
        } else if (order.mode === 'SELL' && existingHolding) {
          existingHolding.qty -= order.qty;
          if (existingHolding.qty <= 0) {
            await HoldingsModel.deleteOne({ name: order.name });
          } else {
            await existingHolding.save();
          }
        }
      }
    }

    res.json({ message: 'Limit orders checked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error checking limit orders' });
  }
});

// ✅ Naya GTT banao
app.post('/newGtt', async (req, res) => {
  try {
    const { name, qty, mode, triggerPrice, orderPrice, product } = req.body;

    const newGtt = new GTTModel({
      name,
      qty,
      mode,
      triggerPrice,
      orderPrice,
      product: product || 'CNC',
      status: 'ACTIVE',
    });
    await newGtt.save();

    res.status(201).json({ message: 'GTT created', gtt: newGtt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating GTT' });
  }
});

// ✅ Saare GTT fetch karo
app.get('/allGtt', async (req, res) => {
  try {
    const allGtt = await GTTModel.find({});
    res.json(allGtt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching GTT orders' });
  }
});

// ✅ Active GTT delete/cancel karo
app.delete('/deleteGtt/:id', async (req, res) => {
  try {
    const gtt = await GTTModel.findById(req.params.id);

    if (!gtt) {
      return res.status(404).json({ message: 'GTT nahi mila' });
    }

    if (gtt.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Sirf Active GTT hi cancel ho sakte hain' });
    }

    await GTTModel.findByIdAndDelete(req.params.id);

    res.json({ message: 'GTT cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting GTT' });
  }
});

// ✅ Manual button se GTT triggers check karo
app.get('/checkGtt', async (req, res) => {
  try {
    const activeGtts = await GTTModel.find({ status: 'ACTIVE' });
    let triggeredCount = 0;

    for (const gtt of activeGtts) {
      const livePrice = await getLivePrice(gtt.name);
      if (livePrice === null) continue;

      let shouldTrigger = false;
      if (gtt.mode === 'BUY' && livePrice <= gtt.triggerPrice) shouldTrigger = true;
      if (gtt.mode === 'SELL' && livePrice >= gtt.triggerPrice) shouldTrigger = true;

      if (shouldTrigger) {
        // ✅ Trigger hone par ek real order place karo
        const newOrder = new OrdersModel({
          name: gtt.name,
          qty: gtt.qty,
          price: gtt.orderPrice,
          mode: gtt.mode,
          orderType: 'LIMIT',
          status: 'EXECUTED',
          product: gtt.product,
        });
        await newOrder.save();

        // Holdings update karo
        const existingHolding = await HoldingsModel.findOne({ name: gtt.name });

        if (gtt.mode === 'BUY') {
          if (existingHolding) {
            const totalQty = existingHolding.qty + gtt.qty;
            const totalCost = (existingHolding.avg * existingHolding.qty) + (gtt.orderPrice * gtt.qty);
            existingHolding.avg = totalCost / totalQty;
            existingHolding.qty = totalQty;
            await existingHolding.save();
          } else {
            await new HoldingsModel({
              name: gtt.name,
              qty: gtt.qty,
              avg: gtt.orderPrice,
              price: gtt.orderPrice,
              net: "+0.00%",
              day: "+0.00%",
            }).save();
          }
        } else if (gtt.mode === 'SELL' && existingHolding) {
          existingHolding.qty -= gtt.qty;
          if (existingHolding.qty <= 0) {
            await HoldingsModel.deleteOne({ name: gtt.name });
          } else {
            await existingHolding.save();
          }
        }

        gtt.status = 'TRIGGERED';
        await gtt.save();
        triggeredCount++;
      }
    }

    res.json({
      message: `${triggeredCount} GTT order(s) triggered`,
      checked: activeGtts.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error checking GTT' });
  }
});

// ✅ Funds document fetch/create karo
async function getFunds() {
  let funds = await FundsModel.findOne({});
  if (!funds) {
    funds = new FundsModel({ balance: 100000 });
    await funds.save();
  }
  return funds;
}

// ✅ Order ke hisaab se balance adjust karo (BUY = minus, SELL = plus)
async function adjustFundsForOrder(mode, qty, price) {
  const funds = await getFunds();
  const amount = Number(qty) * Number(price);

  if (mode === 'BUY') {
    funds.balance -= amount;
  } else if (mode === 'SELL') {
    funds.balance += amount;
  }
  await funds.save();
}

// ✅ Funds summary fetch karo
app.get('/funds', async (req, res) => {
  try {
    const funds = await getFunds();
    const holdings = await HoldingsModel.find({});
    const usedMargin = holdings.reduce((sum, h) => sum + (h.avg * h.qty), 0);

    res.json({
      availableMargin: funds.balance,
      usedMargin,
      availableCash: funds.balance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching funds' });
  }
});

// ✅ Funds add karo
app.post('/addFunds', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount daalo' });
    }
    const funds = await getFunds();
    funds.balance += Number(amount);
    await funds.save();
    res.json({ message: 'Funds added', balance: funds.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error adding funds' });
  }
});

// ✅ Funds withdraw karo
app.post('/withdrawFunds', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount daalo' });
    }
    const funds = await getFunds();
    if (amount > funds.balance) {
      return res.status(400).json({ message: 'Itna balance available nahi hai' });
    }
    funds.balance -= Number(amount);
    await funds.save();
    res.json({ message: 'Funds withdrawn', balance: funds.balance });
  } catch (error) {
    res.status(500).json({ message: 'Error withdrawing funds' });
  }
});

// ✅ MIS orders ko square-off karne wala function
async function squareOffMISOrders() {
  try {
    console.log('Running MIS square-off check...');

    const misOrders = await OrdersModel.find({
      product: 'MIS',
      status: 'EXECUTED',
      squaredOff: false,
    });

    for (const order of misOrders) {
      const livePrice = await getLivePrice(order.name);
      const exitPrice = livePrice !== null ? livePrice : order.price;

      // Opposite mode se square-off karo (jo BUY tha wo SELL hoga, aur vice versa)
      const exitMode = order.mode === 'BUY' ? 'SELL' : 'BUY';

      // Holdings adjust karo
      const existingHolding = await HoldingsModel.findOne({ name: order.name });

      if (exitMode === 'SELL' && existingHolding) {
        existingHolding.qty -= order.qty;
        if (existingHolding.qty <= 0) {
          await HoldingsModel.deleteOne({ name: order.name });
        } else {
          await existingHolding.save();
        }
      } else if (exitMode === 'BUY') {
        if (existingHolding) {
          const totalQty = existingHolding.qty + order.qty;
          const totalCost = (existingHolding.avg * existingHolding.qty) + (exitPrice * order.qty);
          existingHolding.avg = totalCost / totalQty;
          existingHolding.qty = totalQty;
          await existingHolding.save();
        } else {
          await new HoldingsModel({
            name: order.name,
            qty: order.qty,
            avg: exitPrice,
            price: exitPrice,
            net: "+0.00%",
            day: "+0.00%",
          }).save();
        }
      }

      // Original order ko squared-off mark karo
      order.squaredOff = true;
      await order.save();

      // Ek naya "auto square-off" order bhi record karo (history ke liye)
      await new OrdersModel({
        name: order.name,
        qty: order.qty,
        price: exitPrice,
        mode: exitMode,
        orderType: 'MARKET',
        status: 'EXECUTED',
        product: 'MIS',
        squaredOff: true,
      }).save();

      console.log(`Squared off: ${order.name} (${order.mode} -> ${exitMode})`);
    }

    console.log(`${misOrders.length} MIS order(s) squared off.`);
  } catch (error) {
    console.error('Error during MIS square-off:', error);
  }
}

// ✅ Har roz 3:20 PM par automatically chalega
cron.schedule('20 15 * * *', () => {
  squareOffMISOrders();
});

// ✅ Testing ke liye manual route (jab chaho turant chala sakte ho)
app.get('/testSquareOff', async (req, res) => {
  await squareOffMISOrders();
  res.json({ message: 'Square-off process complete' });
});

// app.get('/fixOldProducts', async (req, res) => {
//   try {
//     const result = await OrdersModel.updateMany(
//       { product: { $exists: false } },   // jin orders mein product field hi nahi hai
//       { $set: { product: 'CNC' } }        // sabko default 'CNC' set kar do
//     );
//     res.json({ message: `${result.modifiedCount} orders update ho gaye` });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating orders' });
//   }
// });

app.listen(PORT, () => {
  console.log("App Started!");
  mongoose.connect(uri)
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("DB connection error:", err));
});