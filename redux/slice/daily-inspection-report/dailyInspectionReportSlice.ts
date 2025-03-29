import { createSlice } from "@reduxjs/toolkit";
import {
    createDailyInspectionReport,
    deleteDailyInspectionReport,
    getAllDailyInspectionReport,
    getDailyInspectionReport,
    updateDailyInspectionReport
} from "./dailyInspectionReport";


interface InspectionItem {
    item: string;
    status: number;
}

interface DailyInspectionReportData {
    createdAt?: string;
    _id?: string;
    id: string;
    date: string; 
    driver_name: string; 
    total_mileage: number; 
    general_items: InspectionItem[]; 
    driver_area_items: InspectionItem[]; 
    front_rare_items: InspectionItem[]; 
}


interface DailyInspectionReportState {
    createDailyInspectionReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    updateDailyInspectionReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getDailyInspectionReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getAllDailyInspectionReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    deleteDailyInspectionReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    dailyInspectionReport: DailyInspectionReportData | null;
    allDailyInspectionReport: DailyInspectionReportData[];
    error: string | null;
}


const initialState: DailyInspectionReportState = {
    createDailyInspectionReportStatus: "idle",
    updateDailyInspectionReportStatus: "idle",
    getDailyInspectionReportStatus: "idle",
    getAllDailyInspectionReportStatus: "idle",
    deleteDailyInspectionReportStatus: "idle",
    dailyInspectionReport: null,
    allDailyInspectionReport: [],
    error: null,
}



const dailyInspectionReportSlice = createSlice({
    name: "dailyInspectionReport",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ✅ Create Vehicle Log
            .addCase(createDailyInspectionReport.pending, (state) => {
                state.createDailyInspectionReportStatus = "isLoading";
            })
            .addCase(createDailyInspectionReport.fulfilled, (state, action) => {
                state.createDailyInspectionReportStatus = "succeeded";
                state.allDailyInspectionReport = Array.isArray(state.allDailyInspectionReport)
                    ? [...state.allDailyInspectionReport, action.payload]
                    : [action.payload]; // ✅ Ensure it's always an array
            })
            .addCase(createDailyInspectionReport.rejected, (state, action) => {
                state.createDailyInspectionReportStatus = "failed";
                state.error = action.error.message ?? "Failed to create log";
            })

            .addCase(updateDailyInspectionReport.pending, (state) => {
                state.updateDailyInspectionReportStatus = "isLoading";
            })
            .addCase(updateDailyInspectionReport.fulfilled, (state, action) => {
                state.updateDailyInspectionReportStatus = "succeeded";
                state.allDailyInspectionReport = Array.isArray(state.allDailyInspectionReport)
                    ? state.allDailyInspectionReport.map((log) =>
                          log._id === action.payload._id ? action.payload : log
                      )
                    : [action.payload];
            
                if (state.dailyInspectionReport?._id === action.payload._id) {
                    state.dailyInspectionReport = action.payload;
                }
            })
            
            .addCase(updateDailyInspectionReport.rejected, (state, action) => {
                state.updateDailyInspectionReportStatus = "failed";
                state.error = action.error.message ?? "Failed to update log";
            })

            .addCase(getDailyInspectionReport.pending, (state) => {
                state.getDailyInspectionReportStatus = "isLoading";
            })
            .addCase(getDailyInspectionReport.fulfilled, (state, action) => {
                state.getDailyInspectionReportStatus = "succeeded";
                state.dailyInspectionReport = action.payload;
            })
            .addCase(getDailyInspectionReport.rejected, (state, action) => {
                state.getDailyInspectionReportStatus = "failed";
                state.error = action.error.message ?? "Failed to get log";
            })


            .addCase(getAllDailyInspectionReport.pending, (state) => {
                state.getAllDailyInspectionReportStatus = "isLoading";
            })
            .addCase(getAllDailyInspectionReport.fulfilled, (state, action) => {
                state.getAllDailyInspectionReportStatus = "succeeded";
                state.allDailyInspectionReport = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure it's an array
            })            
            .addCase(getAllDailyInspectionReport.rejected, (state, action) => {
                state.getAllDailyInspectionReportStatus = "failed";
                state.error = action.error.message ?? "Failed to get all logs";
            })

            // ✅ Delete Vehicle Log
            .addCase(deleteDailyInspectionReport.pending, (state) => {
                state.deleteDailyInspectionReportStatus = "isLoading";
            })
            .addCase(deleteDailyInspectionReport.fulfilled, (state, action) => {
                state.deleteDailyInspectionReportStatus = "succeeded";
                state.allDailyInspectionReport = Array.isArray(state.allDailyInspectionReport)
                    ? state.allDailyInspectionReport.filter((log) => log._id !== action.payload)
                    : [];
            
                if (state.dailyInspectionReport?._id === action.payload) {
                    state.dailyInspectionReport = null; // ✅ Remove if currently selected
                }
            })
            
            .addCase(deleteDailyInspectionReport.rejected, (state, action) => {
                state.deleteDailyInspectionReportStatus = "failed";
                state.error = action.error.message ?? "Failed to delete log";
            });
    },
});

export default dailyInspectionReportSlice.reducer;