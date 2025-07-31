import asyncHandler from "../utils/asyncHandler.js";
import {MilkEntry} from "../models/milkentry.model.js"
import ApiResponse from "../utils/ApiResponse.js";

const getTodaySummary = asyncHandler(async (req, res) => {
    const sellerId = req.seller._id

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayEntries = await MilkEntry.find({
        sellerId,
        date: {$gte: todayStart, $lte: todayEnd}
    })

    let totalMilk = 0;
    let totalAmount = 0;
    let totalBonus = 0;

    todayEntries.forEach(entry => {
        totalMilk += entry.quantity;
        totalAmount += entry.total;
        totalBonus += entry.bonus || 0;
    })

    return res
            .status(200)
            .json(new ApiResponse(
                200, 
                {
                    totalMilk,
                    totalAmount,
                    totalBonus,
                    entries: todayEntries
                },
                "Today's data is fetched successfully"
            ));
})

export {getTodaySummary}