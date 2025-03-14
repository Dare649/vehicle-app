import { createSlice } from "@reduxjs/toolkit";
import {
    createVehicleMoveReg,
    updateVehicleMoveReg,
    getAllVehicleMoveReg,
    getVehicleMoveReg,
    deleteVehicleMoveReg,
} from "./vehMoveReg";

interface VehicleMoveRegData {
    id: string;
    veh_number: string;
    month: string;
    week: string;
    date_from: string;
    date_to: string;
    meter_start: number;
    meter_end: number;
    km: number;
    security_name: string;
}

interface VehicleMoveRegState {
    createVehicleMoveRegStatus: "idle" | "isLoading" | "succeeded" | "failed";
    updateVehicleMoveRegStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getVehicleMoveRegStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getAllVehicleMoveRegStatus: "idle" | "isLoading" | "succeeded" | "failed";
    deleteVehicleMoveRegStatus: "idle" | "isLoading" | "succeeded" | "failed";
    vehicleMoveReg: VehicleMoveRegData | null;
    allVehicleMoveRegs: VehicleMoveRegData[];
    error: string | null;
}

const initialState: VehicleMoveRegState = {
    createVehicleMoveRegStatus: "idle",
    updateVehicleMoveRegStatus: "idle",
    getVehicleMoveRegStatus: "idle",
    getAllVehicleMoveRegStatus: "idle",
    deleteVehicleMoveRegStatus: "idle",
    vehicleMoveReg: null,
    allVehicleMoveRegs: [],
    error: null,
};

const vehMoveRegSlice = createSlice({
    name: "vehMoveReg",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // Create Vehicle Log
            .addCase(createVehicleMoveReg.pending, (state) => {
                state.createVehicleMoveRegStatus = "isLoading";
            })
            .addCase(createVehicleMoveReg.fulfilled, (state, action) => {
                state.createVehicleMoveRegStatus = "succeeded";
                state.allVehicleMoveRegs.push(action.payload); // Add new log to the list
            })
            .addCase(createVehicleMoveReg.rejected, (state, action) => {
                state.createVehicleMoveRegStatus = "failed";
                state.error = action.error.message ?? "Failed to create log";
            })

            // Update Vehicle Log (by ID)
            .addCase(updateVehicleMoveReg.pending, (state) => {
                state.updateVehicleMoveRegStatus = "isLoading";
            })
            .addCase(updateVehicleMoveReg.fulfilled, (state, action) => {
                state.updateVehicleMoveRegStatus = "succeeded";
                state.allVehicleMoveRegs = state.allVehicleMoveRegs.map((log) =>
                    log.id === action.payload.id ? action.payload : log
                );
                if (state.vehicleMoveReg?.id === action.payload.id) {
                    state.vehicleMoveReg = action.payload; // Update single log if viewed
                }
            })
            .addCase(updateVehicleMoveReg.rejected, (state, action) => {
                state.updateVehicleMoveRegStatus = "failed";
                state.error = action.error.message ?? "Failed to update log";
            })

            // Get Single Vehicle Log (by ID)
            .addCase(getVehicleMoveReg.pending, (state) => {
                state.getVehicleMoveRegStatus = "isLoading";
            })
            .addCase(getVehicleMoveReg.fulfilled, (state, action) => {
                state.getVehicleMoveRegStatus = "succeeded";
                state.vehicleMoveReg = action.payload; // Store fetched log
            })
            .addCase(getVehicleMoveReg.rejected, (state, action) => {
                state.getVehicleMoveRegStatus = "failed";
                state.error = action.error.message ?? "Failed to get log";
            })

            // Get All Vehicle Logs
            .addCase(getAllVehicleMoveReg.pending, (state) => {
                state.getAllVehicleMoveRegStatus = "isLoading";
            })
            .addCase(getAllVehicleMoveReg.fulfilled, (state, action) => {
                state.getAllVehicleMoveRegStatus = "succeeded";
                state.allVehicleMoveRegs = action.payload; // Store all logs
            })
            .addCase(getAllVehicleMoveReg.rejected, (state, action) => {
                state.getAllVehicleMoveRegStatus = "failed";
                state.error = action.error.message ?? "Failed to get all logs";
            })

            // Delete Vehicle Log (by ID)
            .addCase(deleteVehicleMoveReg.pending, (state) => {
                state.deleteVehicleMoveRegStatus = "isLoading";
            })
            .addCase(deleteVehicleMoveReg.fulfilled, (state, action) => {
                state.deleteVehicleMoveRegStatus = "succeeded";
                state.allVehicleMoveRegs = state.allVehicleMoveRegs.filter(
                    (log) => log.id !== action.payload
                );
                if (state.vehicleMoveReg?.id === action.payload) {
                    state.vehicleMoveReg = null; // Clear if deleted log is currently viewed
                }
            })
            .addCase(deleteVehicleMoveReg.rejected, (state, action) => {
                state.deleteVehicleMoveRegStatus = "failed";
                state.error = action.error.message ?? "Failed to delete log";
            });
    },
});

export default vehMoveRegSlice.reducer;
