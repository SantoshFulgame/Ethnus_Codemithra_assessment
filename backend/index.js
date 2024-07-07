const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const port = 3001;
const app = express();
app.use(cors());

const dbUrl = process.env.MONGODB_URL;
const dbName = "salesDatabase";
let db;

const initializeDBAndServer = async () => {
  try {
    const client = new MongoClient(dbUrl);
    await client.connect();
    db = client.db(dbName);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/sales", async (request, response) => {
  try {
    const { month = 1, search_q = "", page = 1 } = request.query;
    const skip = (page - 1) * 10;

    const sales = await db.collection("salesData")
      .find({
        $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
        $or: [
          { title: { $regex: search_q, $options: "i" } },
          { price: { $regex: search_q, $options: "i" } },
          { description: { $regex: search_q, $options: "i" } }
        ]
      })
      .limit(10)
      .skip(skip)
      .toArray();

    response.send(sales);
  } catch (error) {
    response.status(400).json(error.message);
  }
});

app.get("/statistics", async (request, response) => {
  try {
    const { month = 1 } = request.query;

    const result = await db.collection("salesData").aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        }
      },
      {
        $group: {
          _id: null,
          sales: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, "$price", 0]
            }
          },
          soldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, 1, 0]
            }
          },
          unSoldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", false] }, 1, 0]
            }
          }
        }
      }
    ]).toArray();

    response.send(result[0]);
  } catch (error) {
    response.status(400).json(error.message);
  }
});

app.get("/items", async (request, response) => {
  try {
    const { month } = request.query;

    const result = await db.collection("salesData").aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        }
      },
      {
        $facet: {
          priceRanges: [
            { $bucket: { groupBy: "$price", boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity], default: "Other", output: { count: { $sum: 1 } } } }
          ]
        }
      }
    ]).toArray();

    response.status(200).json(result[0].priceRanges);
  } catch (error) {
    response.status(400).json(error.message);
  }
});

app.get("/categories", async (request, response) => {
  try {
    const { month = 1 } = request.query;

    const result = await db.collection("salesData").aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] }
        }
      },
      {
        $group: {
          _id: "$category",
          items: { $sum: 1 }
        }
      }
    ]).toArray();

    response.status(200).json(result);
  } catch (error) {
    response.status(400).json(error.message);
  }
});

const monthsData = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

app.get("/all-statistics", async (request, response) => {
  try {
    const { month = 3 } = request.query;

    const api1Response = await fetch(
      `https://backendof.onrender.com/statistics?month=${month}`
    );
    const api1Data = await api1Response.json();

    const api2Response = await fetch(
      `https://backendof.onrender.com/items?month=${month}`
    );
    const api2Data = await api2Response.json();

    const api3Response = await fetch(
      `https://backendof.onrender.com/categories?month=${month}`
    );
    const api3Data = await api3Response.json();

    response.status(200).json({
      monthName: monthsData[month],
      statistics: api1Data,
      itemPriceRange: api2Data,
      categories: api3Data,
    });
  } catch (error) {
    response.status(400).json(error.message);
  }
});
