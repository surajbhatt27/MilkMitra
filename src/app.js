import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import sellerRouter from "./routes/seller.route.js";
import milkEntryRouter from "./routes/milkEntry.route.js";
import purchaseRouter from "./routes/purchase.route.js"
import monthlySummaryRouter from "./routes/monthlySummary.route.js";
import todaySummaryRouter from "./routes/todaySummary.route.js";

// Welcome route for base url.
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🧀 Welcome to MilkMitra API 🐄✨. The backend is working perfectly!",
        uptime: process.uptime().toFixed(0) + "s",
        environment: process.env.NODE_ENV || "development"
    });
});

//routes declaration
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/milk", milkEntryRouter);
app.use("/api/v1/purchase", purchaseRouter);
app.use("/api/v1/summary", monthlySummaryRouter);
app.use("/api/v1/today", todaySummaryRouter);

// For Invalid Endpoint
app.use(notFound);
app.use(errorHandler);

export {app};