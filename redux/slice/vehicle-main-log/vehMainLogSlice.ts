import { createSlice } from "@reduxjs/toolkit";
import {
    createVehicleMainLog,
    updateVehicleMainLog,
    getAllVehicleMainLog,
    getVehicleMainLog,
    deleteVehicleMainLog
} from "./vehMainLog";

interface VehicleMainLogData {
    createdAt?: string;
    _id?: string;
    id: string;
    make: string;
    model: string;
    year: number;
    veh_id_number: string;
    engine: string;
    date_of_service: string;
    milage_of_service: number;
    performed_by_name: string;
    work_performed_by_service_schedule: string;
    cost: number;
    invoice: string;
    notes: string;
}

interface VehicleMainLogState {
    createVehicleMainLogStatus: "idle" | "isLoading" | "succeeded" | "failed";
    updateVehicleMainLogStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getVehicleMainLogStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getAllVehicleMainLogStatus: "idle" | "isLoading" | "succeeded" | "failed";
    deleteVehicleMainLogStatus: "idle" | "isLoading" | "succeeded" | "failed";
    vehicleMainLog: VehicleMainLogData | null;
    allVehicleMainLogs: VehicleMainLogData[];
    error: string | null;
}

const initialState: VehicleMainLogState = {
    createVehicleMainLogStatus: "idle",
    updateVehicleMainLogStatus: "idle",
    getVehicleMainLogStatus: "idle",
    getAllVehicleMainLogStatus: "idle",
    deleteVehicleMainLogStatus: "idle",
    vehicleMainLog: null,
    allVehicleMainLogs: [],
    error: null,
};

const vehMainLogSlice = createSlice({
    name: "vehMainLog",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            // Create Vehicle Log
            .addCase(createVehicleMainLog.pending, (state) => {
                state.createVehicleMainLogStatus = "isLoading";
            })
            .addCase(createVehicleMainLog.fulfilled, (state, action) => {
                state.createVehicleMainLogStatus = "succeeded";
                state.allVehicleMainLogs = Array.isArray(state.allVehicleMainLogs)
                    ? [...state.allVehicleMainLogs, action.payload]
                    : [action.payload]; // ✅ Ensure it's always an array
            })
            
            .addCase(createVehicleMainLog.rejected, (state, action) => {
                state.createVehicleMainLogStatus = "failed";
                state.error = action.error.message ?? "Failed to create log";
            })

            // Update Vehicle Log (by ID)
            .addCase(updateVehicleMainLog.pending, (state) => {
                state.updateVehicleMainLogStatus = "isLoading";
            })
            
            .addCase(updateVehicleMainLog.fulfilled, (state, action) => {
                state.updateVehicleMainLogStatus = "succeeded";
                state.allVehicleMainLogs = Array.isArray(state.allVehicleMainLogs)
                    ? state.allVehicleMainLogs.map((log) =>
                            log._id === action.payload._id ? action.payload : log
                        )
                    : [action.payload];
            
                if (state.vehicleMainLog?._id === action.payload._id) {
                    state.vehicleMainLog = action.payload;
                }
            })
            
            .addCase(updateVehicleMainLog.rejected, (state, action) => {
                state.updateVehicleMainLogStatus = "failed";
                state.error = action.error.message ?? "Failed to update log";
            })

            // Get Single Vehicle Log (by ID)
            .addCase(getVehicleMainLog.pending, (state) => {
                state.getVehicleMainLogStatus = "isLoading";
            })
            .addCase(getVehicleMainLog.fulfilled, (state, action) => {
                state.getVehicleMainLogStatus = "succeeded";
                state.vehicleMainLog = action.payload; // Store fetched log
            })
            .addCase(getVehicleMainLog.rejected, (state, action) => {
                state.getVehicleMainLogStatus = "failed";
                state.error = action.error.message ?? "Failed to get log";
            })

            // Get All Vehicle Logs
            .addCase(getAllVehicleMainLog.pending, (state) => {
                state.getAllVehicleMainLogStatus = "isLoading";
            })
            .addCase(getAllVehicleMainLog.fulfilled, (state, action) => {
                state.getAllVehicleMainLogStatus = "succeeded";
                state.allVehicleMainLogs = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure it's an array
            })
            .addCase(getAllVehicleMainLog.rejected, (state, action) => {
                state.getAllVehicleMainLogStatus = "failed";
                state.error = action.error.message ?? "Failed to get all logs";
            })

            // Delete Vehicle Log (by ID)
            .addCase(deleteVehicleMainLog.pending, (state) => {
                state.deleteVehicleMainLogStatus = "isLoading";
            })
            .addCase(deleteVehicleMainLog.fulfilled, (state, action) => {
                state.deleteVehicleMainLogStatus = "succeeded";
                state.allVehicleMainLogs = Array.isArray(state.allVehicleMainLogs)
                    ? state.allVehicleMainLogs.filter((log) => log._id !== action.payload)
                    : [];
            
                if (state.vehicleMainLog?._id === action.payload) {
                    state.vehicleMainLog = null; // ✅ Remove if currently selected
                }
            })
            .addCase(deleteVehicleMainLog.rejected, (state, action) => {
                state.deleteVehicleMainLogStatus = "failed";
                state.error = action.error.message ?? "Failed to delete log";
            });
    },
});

export default vehMainLogSlice.reducer;
