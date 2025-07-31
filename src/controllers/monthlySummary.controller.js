import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { MilkEntry } from "../models/milkentry.model.js";
import {Purchase} from "../models/purchase.model.js";
import {MonthlySummary} from "../models/monthlySummary.model.js";

const generateMonthlySummary = asyncHandler(async (req, res) => {
    const today = new Date();
    let defaultMonth = today.getMonth();
    let defaultYear = today.getFullYear();

    if(defaultMonth == 0) {
        defaultMonth = 12;
        defaultYear -= 1;
    }
    const {
            month = defaultMonth,
            year = defaultYear
    } = req.body || {};

    const start = new Date(year, month-1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    
    const milkEntries = await MilkEntry.find({
        sellerId: req.seller._id,
        date: {$gte: start, $lte: end}
    })

    let totalMilkSuplied = 0;
    let totalAmountEarned = 0;
    let totalBonus = 0;

    milkEntries.forEach(entry => {
        totalMilkSuplied += entry.quantity;
        totalAmountEarned += entry.total;
        totalBonus += entry.bonus;
    })

    const purchase = await Purchase.find({
        sellerId: req.seller._id,
        date: {$gte: start, $lte: end}
    })

    let totalPurchaseAmount = 0;

    purchase.forEach(p => {
        totalPurchaseAmount += p.finalPrice || p.unitPrice* p.quantity;
    })

    const netPayable = totalAmountEarned - totalPurchaseAmount;

    const monthlyReport = await MonthlySummary.findOneAndUpdate({
        sellerId: req.seller._id,
        month: `${start.getMonth()+1}-${start.getFullYear()}`
    },
    {
        totalMilkSuplied,
        totalAmountEarned,
        totalPurchaseAmount,
        totalBonus,
        netPayable,
        paid: false
    },
    {upsert: true, new: true}
    )

    return res
            .status(200)
            .json(new ApiResponse(200, monthlyReport, "Monthly report is generated successfully"))
})

const getMonthlySummary = asyncHandler(async (req, res) => {

    const sellerId = req.seller._id;
    const {month, year} = req.query;
    
    let summary;
    // If month and year provided.
    if(month && year) {
        const monthKey = `${month}-${year}`;
        summary = await MonthlySummary.findOne({
            sellerId,
            month: monthKey
        })

        if(!summary) {
            throw new ApiError(404, "Monthly summary not found for the given year");
        }

        return res
                .status(200)
                .json(new ApiResponse(200, summary, "Monthly summary fetched successfully"));
    }
    // If month and year is not provided.
    summary = await MonthlySummary.find({sellerId}).sort({createdAt: -1});
    return res
            .status(200)
            .json(new ApiResponse(200, summary, "Monthly summary fetched successfully"));
})

export{
    generateMonthlySummary,
    getMonthlySummary
}