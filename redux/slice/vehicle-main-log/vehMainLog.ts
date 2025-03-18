import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";

// Define vehicle maintenance log data type
interface VehicleMainLogData {
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


// Create form
export const createVehicleMainLog = createAsyncThunk(
    "vehicle-main-log/createVehicleMainLog",
    async (data: VehicleMainLogData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/vehicle-maintenance-log/create_vehicle_maintenance_log_form",
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to create form, try again"
            });
        }
    }
);



// Update form
export const updateVehicleMainLog = createAsyncThunk(
    "vehicle-main-log/updateVehicleMainLog", 
    async ({ id, data }: { id: string; data: VehicleMainLogData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put( 
                `/vehicle-maintenance-log/update_vehicle_maintenance_log_form/${id}`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to update form, try again"
            });
        }
    }
);


// get form
export const getVehicleMainLog = createAsyncThunk(
    "vehicle-main-log/getVehicleMainLog", 
    async (vehicleId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get( 
                `/vehicle-maintenance-log/get_vehicle_maintenance_log_form/${vehicleId}`
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue( error.response?.data || error.message || "Failed to get form, try again");
        }
    }
);


// delete form
export const deleteVehicleMainLog = createAsyncThunk<
    string, // Return type (ID of deleted item)
    string, // Argument type (ID to delete)
    { rejectValue: { message: string } } // Error type
>(
    "vehicle-move-reg/deleteVehicleMoveReg",
    async (id, { rejectWithValue }) => { 
        try {
            await axiosInstance.delete(
                `/vehicle-maintenance-log/delete_vehicle_maintenance_log_form/${id}`
            );
            return id; // Return the deleted ID
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to delete form, try again"
            });
        }
    }
);


// get all form
export const getAllVehicleMainLog = createAsyncThunk(
    "vehicle-main-log/getAllVehicleMainLog", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get( 
                `/vehicle-maintenance-log/get_vehicle_maintenance_log_form`
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get forms, try again"
            });
        }
    }
);
