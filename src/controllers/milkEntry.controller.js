import MilkEntry from "../models/milkentry.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { application } from "express";


const addMilkEntry = asyncHandler(async (req, res) => {
    const milkEntry = await Seller.findById(req.seller._id);
    const {
        date = new Date(),
        time = new Date().toLocaleTimeString(),
        slot,
        fat,
        snf,
        quantity,
        total,
        bonus = 0
    } = req.body;
    
    if(!slot || !fat || !snf || !quantity || !total) {
        throw new ApiError(400, "required fields are missing");
    }

    const newEntry = await MilkEntry.create({
        code: req.seller._id,
        date,
        time,
        slot,
        fat,
        snf,
        quantity,
        total,
        bonus
    })

    return res.status(201).json(
        new ApiResponse(201, newEntry, "Milk entry added successfully")
    );
})

const getMilkEntries = asyncHandler(async (req, res) => {

    const {date, month, year, slot} = req.query;

    const filter = {code: req.seller._id};

    if(date) {
        filter.date = new Date(date);
    }

    if(month && year) {
        const start = new Date(year, month-1, 1);
        const end = new Date(year, month, 0, 23, 59, 59);
        filter.date({$gte: start, $lte: end});
    }

    if(slot) {
        filter.slot = slot;
    }

    const entries = await MilkEntry.find(filter).sort({date: -1})

    return res
            .status(200)
            .json(new ApiResponse(200, entries, "Milk entries fetched successfully"))

})

const updateMilkEntry = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {
        date,
        time,
        slot,
        fat,
        snf,
        quantity,
        total,
        bonus
    } = req.body;

    const milkEntry = await MilkEntry.find({
        _id: id,
        code: req.seller._id
    });

    if (!milkEntry) {
        throw new ApiError(404, "Milk entry not found");
    }

    if (date) milkEntry.date = date;
    if (time) milkEntry.time = time;
    if (slot) milkEntry.slot = slot;
    if (fat) milkEntry.fat = fat;
    if (snf) milkEntry.snf = snf;
    if (quantity) milkEntry.quantity = quantity;
    if (total) milkEntry.total = total;
    if (bonus) milkEntry.bonus = bonus;

    await milkEntry.save();

    return res
            .status(200)
            .json(new ApiResponse(200, milkEntry, "Milk entry updated successfully"));
})

const deleteMilkEntry = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const deleteEntry = await MilkEntry.findOneAndDelete({
        _id: id,
        code: req.seller._id
    })

    if(!deleteEntry) {
        throw new ApiError(400, "Milk entry not found or already deleted");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Milk entry deleted successfully"));
})

export{
    addMilkEntry,
    getMilkEntries,
    updateMilkEntry,
    deleteMilkEntry
}