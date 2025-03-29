import { createSlice } from "@reduxjs/toolkit";
import {
    createMonthlyVehMainChecklist,
    deleteMonthlyVehMainChecklist,
    getAllMonthlyVehMainChecklist,
    getMonthlyVehMainChecklist,
    updateMonthlyVehMainChecklist
} from './monthlyVehMainChecklist';


interface MonthlyVehMainChecklistData {
    createdAt?: string;
    _id?: string;
    id: string;
    veh_name: string;
    date: string;
    checked_by: string;
    current_mileage: number;
    date_of_last_oil_change: string;
    date_of_last_oil_filter_change: string;
    date_of_last_air_filter_change: string;
    date_of_carbin_filter_change: string;
    date_engine_tune_up: string;
    mileage_of_last_oil_change: number;
    mileage_of_last_air_filter_change: number;
    mileage_of_last_tire_rotation: number;
    checklist_items: ChecklistItem[];
    performed_by_user: string;
  }
  
  interface ChecklistItem {
    item: string;
    status: number;
    remark: string;
  }


  interface MonthlyVehMainChecklistState {
    createMonthlyVehMainChecklistStatus: "idle" | "isLoading" | "succeeded" | "failed";
    updateMonthlyVehMainChecklistStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getAllMonthlyVehMainChecklistStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getMonthlyVehMainChecklistStatus: "idle" | "isLoading" | "succeeded" | "failed";
    deleteMonthlyVehMainChecklistStatus: "idle" | "isLoading" | "succeeded" | "failed";
    monthlyVehMainChecklist: MonthlyVehMainChecklistData | null;
    allMonthlyVehMainChecklist: MonthlyVehMainChecklistData[],
    error: string | null;
  }


  const initialState: MonthlyVehMainChecklistState = {
    createMonthlyVehMainChecklistStatus: "idle",
    updateMonthlyVehMainChecklistStatus: "idle",
    deleteMonthlyVehMainChecklistStatus: "idle",
    getMonthlyVehMainChecklistStatus: "idle",
    getAllMonthlyVehMainChecklistStatus: "idle",
    monthlyVehMainChecklist: null,
    allMonthlyVehMainChecklist: [],
    error: null,
  }



  const monthlyVehMainChecklistSlice = createSlice({
      name: "monthlyVehMainChecklist",
      initialState,
      reducers: {},
      extraReducers: (builder) => {
          builder
              // ✅ Create Vehicle Log
              .addCase(createMonthlyVehMainChecklist.pending, (state) => {
                  state.createMonthlyVehMainChecklistStatus = "isLoading";
              })
              .addCase(createMonthlyVehMainChecklist.fulfilled, (state, action) => {
                  state.createMonthlyVehMainChecklistStatus = "succeeded";
                  state.allMonthlyVehMainChecklist = Array.isArray(state.allMonthlyVehMainChecklist)
                      ? [...state.allMonthlyVehMainChecklist, action.payload]
                      : [action.payload]; // ✅ Ensure it's always an array
              })
              .addCase(createMonthlyVehMainChecklist.rejected, (state, action) => {
                  state.createMonthlyVehMainChecklistStatus = "failed";
                  state.error = action.error.message ?? "Failed to create log";
              })
  
              // ✅ Update Vehicle Log
              .addCase(updateMonthlyVehMainChecklist.pending, (state) => {
                  state.updateMonthlyVehMainChecklistStatus = "isLoading";
              })
              .addCase(updateMonthlyVehMainChecklist.fulfilled, (state, action) => {
                  state.updateMonthlyVehMainChecklistStatus = "succeeded";
                  state.allMonthlyVehMainChecklist = Array.isArray(state.allMonthlyVehMainChecklist)
                      ? state.allMonthlyVehMainChecklist.map((log) =>
                            log._id === action.payload._id ? action.payload : log
                        )
                      : [action.payload];
              
                  if (state.monthlyVehMainChecklist?._id === action.payload._id) {
                      state.monthlyVehMainChecklist = action.payload;
                  }
              })
              
              .addCase(updateMonthlyVehMainChecklist.rejected, (state, action) => {
                  state.updateMonthlyVehMainChecklistStatus = "failed";
                  state.error = action.error.message ?? "Failed to update log";
              })
  
              // ✅ Get Single Vehicle Log
              .addCase(getMonthlyVehMainChecklist.pending, (state) => {
                  state.getMonthlyVehMainChecklistStatus = "isLoading";
              })
              .addCase(getMonthlyVehMainChecklist.fulfilled, (state, action) => {
                  state.getMonthlyVehMainChecklistStatus = "succeeded";
                  state.monthlyVehMainChecklist = action.payload;
              })
              .addCase(getMonthlyVehMainChecklist.rejected, (state, action) => {
                  state.getMonthlyVehMainChecklistStatus = "failed";
                  state.error = action.error.message ?? "Failed to get log";
              })
  
              // ✅ Get All Vehicle Logs
              .addCase(getAllMonthlyVehMainChecklist.pending, (state) => {
                  state.getAllMonthlyVehMainChecklistStatus = "isLoading";
              })
              .addCase(getAllMonthlyVehMainChecklist.fulfilled, (state, action) => {
                  state.getAllMonthlyVehMainChecklistStatus = "succeeded";
                  state.allMonthlyVehMainChecklist = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure it's an array
              })            
              .addCase(getAllMonthlyVehMainChecklist.rejected, (state, action) => {
                  state.getAllMonthlyVehMainChecklistStatus = "failed";
                  state.error = action.error.message ?? "Failed to get all logs";
              })
  
              // ✅ Delete Vehicle Log
              .addCase(deleteMonthlyVehMainChecklist.pending, (state) => {
                  state.deleteMonthlyVehMainChecklistStatus = "isLoading";
              })
              .addCase(deleteMonthlyVehMainChecklist.fulfilled, (state, action) => {
                  state.deleteMonthlyVehMainChecklistStatus = "succeeded";
                  state.allMonthlyVehMainChecklist = Array.isArray(state.allMonthlyVehMainChecklist)
                      ? state.allMonthlyVehMainChecklist.filter((log) => log._id !== action.payload)
                      : [];
              
                  if (state.monthlyVehMainChecklist?._id === action.payload) {
                      state.monthlyVehMainChecklist = null; // ✅ Remove if currently selected
                  }
              })
              
              .addCase(deleteMonthlyVehMainChecklist.rejected, (state, action) => {
                  state.deleteMonthlyVehMainChecklistStatus = "failed";
                  state.error = action.error.message ?? "Failed to delete log";
              });
      },
  });
  
  export default monthlyVehMainChecklistSlice.reducer;