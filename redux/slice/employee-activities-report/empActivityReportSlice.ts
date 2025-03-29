import { createSlice } from "@reduxjs/toolkit";
import {
    createEmployeeActivityReport,
    deleteEmployeeActivityReport,
    getAllEmployeeActivityReport,
    getEmployeeActivityReport,
    updateEmployeeActivityReport
} from "./empActivityReport";

interface ApprovedBy {
    approval_name: string;
    designation: string;
}

interface TaskItem {
    description: string;
    responsibility_delegate: string;
    status: string;
    challenges: string;
    recovery_plan: string;
    comment_remark: string;
    approved_by: ApprovedBy[];
}


interface EmployeeActivityReportData {
    createdAt?: string;
    _id?: string;
    performed_by_user: string;
    id: string;
    employee_name: string;
    department: string;
    designation: string;
    supervisor: string;
    date_of_reporting: string;
    week: string;
    task_items: TaskItem[];
}


interface EmployeeActivityReportState {
    createEmployeeActivityReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    updateEmployeeActivityReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getEmployeeActivityReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    deleteEmployeeActivityReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    getAllEmployeeActivityReportStatus: "idle" | "isLoading" | "succeeded" | "failed";
    employeeActivityReport: EmployeeActivityReportData | null;
    allEmployeeActivityReport: EmployeeActivityReportData[];
    error: string | null;
}


const initialState: EmployeeActivityReportState = {
    createEmployeeActivityReportStatus: "idle",
    updateEmployeeActivityReportStatus: "idle",
    getAllEmployeeActivityReportStatus: "idle",
    getEmployeeActivityReportStatus: "idle",
    deleteEmployeeActivityReportStatus: "idle",
    employeeActivityReport: null,
    allEmployeeActivityReport: [],
    error: null,
}


const employeeActivityReport = createSlice({
    name: "employeeActivityReport",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ✅ Create Vehicle Log
            .addCase(createEmployeeActivityReport.pending, (state) => {
                state.createEmployeeActivityReportStatus = "isLoading";
            })
            .addCase(createEmployeeActivityReport.fulfilled, (state, action) => {
                state.createEmployeeActivityReportStatus = "succeeded";
                state.allEmployeeActivityReport = Array.isArray(state.allEmployeeActivityReport)
                    ? [...state.allEmployeeActivityReport, action.payload]
                    : [action.payload]; // ✅ Ensure it's always an array
            })
            .addCase(createEmployeeActivityReport.rejected, (state, action) => {
                state.createEmployeeActivityReportStatus = "failed";
                state.error = action.error.message ?? "Failed to create log";
            })

            // ✅ Update Vehicle Log
            .addCase(updateEmployeeActivityReport.pending, (state) => {
                state.updateEmployeeActivityReportStatus = "isLoading";
            })
            .addCase(updateEmployeeActivityReport.fulfilled, (state, action) => {
                state.updateEmployeeActivityReportStatus = "succeeded";
                state.allEmployeeActivityReport = Array.isArray(state.allEmployeeActivityReport)
                    ? state.allEmployeeActivityReport.map((log) =>
                          log._id === action.payload._id ? action.payload : log
                      )
                    : [action.payload];
            
                if (state.employeeActivityReport?._id === action.payload._id) {
                    state.employeeActivityReport = action.payload;
                }
            })
            
            .addCase(updateEmployeeActivityReport.rejected, (state, action) => {
                state.updateEmployeeActivityReportStatus = "failed";
                state.error = action.error.message ?? "Failed to update log";
            })

            // ✅ Get Single Vehicle Log
            .addCase(getEmployeeActivityReport.pending, (state) => {
                state.getEmployeeActivityReportStatus = "isLoading";
            })
            .addCase(getEmployeeActivityReport.fulfilled, (state, action) => {
                state.getEmployeeActivityReportStatus = "succeeded";
                state.employeeActivityReport = action.payload;
            })
            .addCase(getEmployeeActivityReport.rejected, (state, action) => {
                state.getEmployeeActivityReportStatus = "failed";
                state.error = action.error.message ?? "Failed to get log";
            })

            // ✅ Get All Vehicle Logs
            .addCase(getAllEmployeeActivityReport.pending, (state) => {
                state.getAllEmployeeActivityReportStatus = "isLoading";
            })
            .addCase(getAllEmployeeActivityReport.fulfilled, (state, action) => {
                state.getAllEmployeeActivityReportStatus = "succeeded";
                state.allEmployeeActivityReport = Array.isArray(action.payload) ? action.payload : []; // ✅ Ensure it's an array
            })            
            .addCase(getAllEmployeeActivityReport.rejected, (state, action) => {
                state.getAllEmployeeActivityReportStatus = "failed";
                state.error = action.error.message ?? "Failed to get all logs";
            })

            // ✅ Delete Vehicle Log
            .addCase(deleteEmployeeActivityReport.pending, (state) => {
                state.deleteEmployeeActivityReportStatus = "isLoading";
            })
            .addCase(deleteEmployeeActivityReport.fulfilled, (state, action) => {
                state.deleteEmployeeActivityReportStatus = "succeeded";
                state.allEmployeeActivityReport = Array.isArray(state.allEmployeeActivityReport)
                    ? state.allEmployeeActivityReport.filter((log) => log._id !== action.payload)
                    : [];
            
                if (state.employeeActivityReport?._id === action.payload) {
                    state.employeeActivityReport = null; // ✅ Remove if currently selected
                }
            })
            
            .addCase(deleteEmployeeActivityReport.rejected, (state, action) => {
                state.deleteEmployeeActivityReportStatus = "failed";
                state.error = action.error.message ?? "Failed to delete log";
            });
    },
});

export default employeeActivityReport.reducer;