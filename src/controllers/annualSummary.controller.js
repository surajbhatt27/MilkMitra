import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import MonthlySummary from "../models/monthlySummary.model.js";

const generateAnnualSummary = asyncHandler(async (req, res) => {
    const sellerId = req.seller._id;
    const { year } = req.query;

    if (!year) {
        throw new ApiError(400, "Year is required");
    }

    const monthlySummaries = await MonthlySummary.find({
        sellerId,
        month: { $regex: `-${year}$` } // Matches months like "1-2025", "2-2025", etc.
    });

    if (!monthlySummaries.length) {
        throw new ApiError(404, `No monthly summaries found for year ${year}`);
    }

    let totalMilkSupplied = 0;
    let totalAmountEarned = 0;
    let totalBonus = 0;
    let totalPurchaseAmount = 0;
    let netPayable = 0;

    monthlySummaries.forEach((month) => {
        totalMilkSupplied += month.totalMilkSuplied || 0;
        totalAmountEarned += month.totalAmountEarned || 0;
        totalBonus += month.totalBonus || 0;
        totalPurchaseAmount += month.totalPurchaseAmount || 0;
        netPayable += month.netPayable || 0;
    });

    const annualSummary = {
        year,
        totalMilkSupplied,
        totalAmountEarned,
        totalBonus,
        totalPurchaseAmount,
        netPayable,
        monthsIncluded: monthlySummaries.length
    };

    return res.status(200).json(
        new ApiResponse(200, annualSummary, `Annual summary for ${year} generated successfully`)
    );
});

export { generateAnnualSummary };