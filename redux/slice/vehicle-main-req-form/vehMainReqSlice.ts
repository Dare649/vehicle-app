import { createSlice } from "@reduxjs/toolkit";
import {
    createVehicleMainReq,
    updateVehicleMainReq,
    getAllVehicleMainReq,
    getVehicleMainReq,
    deleteVehicleMainReq
} from "./vehMainReq";

interface VehicleMainLogData {
    id: string;
    veh_number: string;
    filled_by: string;
    report_date: string;
    mechanic_notes: string;
    description_of_problem: string;
    completed_date: string;
    mechanic_name: string;
}

interface VehicleMainLogState {
    createVehicleMainReqStatus: "idle" | "isLoading" | "succeeded" | "failed";
    updateVehicleMainReqStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getVehicleMainReqStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getAllVehicleMainReqStatus: "idle" | "isLoading" | "succeeded" | "failed";
    deleteVehicleMainReqStatus: "idle" | "isLoading" | "succeeded" | "failed";
    vehicleMainReq: VehicleMainLogData | null;
    allVehicleMainReqs: VehicleMainLogData[];
    error: string | null;
}

const initialState: VehicleMainLogState = {
    createVehicleMainReqStatus: "idle",
    updateVehicleMainReqStatus: "idle",
    getVehicleMainReqStatus: "idle",
    getAllVehicleMainReqStatus: "idle",
    deleteVehicleMainReqStatus: "idle",
    vehicleMainReq: null,
    allVehicleMainReqs: [],
    error: null,
};

const vehMainReqSlice = createSlice({
    name: "vehMainReq",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // Create form
            .addCase(createVehicleMainReq.pending, (state) => {
                state.createVehicleMainReqStatus = "isLoading";
            })
            .addCase(createVehicleMainReq.fulfilled, (state, action) => {
                state.createVehicleMainReqStatus = "succeeded";
                state.allVehicleMainReqs.push(action.payload); // Add new log to the list
            })
            .addCase(createVehicleMainReq.rejected, (state, action) => {
                state.createVehicleMainReqStatus = "failed";
                state.error = action.error.message ?? "Failed to create log";
            })

            // Update form (by ID)
            .addCase(updateVehicleMainReq.pending, (state) => {
                state.updateVehicleMainReqStatus = "isLoading";
            })
            .addCase(updateVehicleMainReq.fulfilled, (state, action) => {
                state.updateVehicleMainReqStatus = "succeeded";
                state.allVehicleMainReqs = state.allVehicleMainReqs.map((log) =>
                    log.id === action.payload.id ? action.payload : log
                );
                if (state.vehicleMainReq?.id === action.payload.id) {
                    state.vehicleMainReq = action.payload; // Update single log if viewed
                }
            })
            .addCase(updateVehicleMainReq.rejected, (state, action) => {
                state.updateVehicleMainReqStatus = "failed";
                state.error = action.error.message ?? "Failed to update log";
            })

            // Get Single form (by ID)
            .addCase(getVehicleMainReq.pending, (state) => {
                state.getVehicleMainReqStatus = "isLoading";
            })
            .addCase(getVehicleMainReq.fulfilled, (state, action) => {
                state.getVehicleMainReqStatus = "succeeded";
                state.vehicleMainReq = action.payload; // Store fetched log
            })
            .addCase(getVehicleMainReq.rejected, (state, action) => {
                state.getVehicleMainReqStatus = "failed";
                state.error = action.error.message ?? "Failed to get log";
            })

            // Get All forms
            .addCase(getAllVehicleMainReq.pending, (state) => {
                state.getAllVehicleMainReqStatus = "isLoading";
            })
            .addCase(getAllVehicleMainReq.fulfilled, (state, action) => {
                state.getAllVehicleMainReqStatus = "succeeded";
                state.allVehicleMainReqs = action.payload; // Store all logs
            })
            .addCase(getAllVehicleMainReq.rejected, (state, action) => {
                state.getAllVehicleMainReqStatus = "failed";
                state.error = action.error.message ?? "Failed to get all logs";
            })

            // Delete form (by ID)
            .addCase(deleteVehicleMainReq.pending, (state) => {
                state.deleteVehicleMainReqStatus = "isLoading";
            })
            .addCase(deleteVehicleMainReq.fulfilled, (state, action) => {
                state.deleteVehicleMainReqStatus = "succeeded";
                state.allVehicleMainReqs = state.allVehicleMainReqs.filter(
                    (log) => log.id !== action.payload
                );
                if (state.vehicleMainReq?.id === action.payload) {
                    state.vehicleMainReq = null; // Clear if deleted log is currently viewed
                }
            })
            .addCase(deleteVehicleMainReq.rejected, (state, action) => {
                state.deleteVehicleMainReqStatus = "failed";
                state.error = action.error.message ?? "Failed to delete log";
            });
    },
});

export default vehMainReqSlice.reducer;
