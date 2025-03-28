import { createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";

// Define vehicle movement register data type
interface VehicleMoveReg {
    veh_number: string;
    month: string;
    week: string;
    date_from: string;
    date_to: string;
    meter_start: number;
    meter_end: number;
    km: number;
    security_name: string;
    performed_by_user: string;
}

// Create form
export const createVehicleMoveReg = createAsyncThunk(
    "vehicle-move-reg/createVehicleMoveReg",
    async (data: VehicleMoveReg, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/vehicle-movement-register/create_vehicle_movement_register_form",
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
export const updateVehicleMoveReg = createAsyncThunk(
    "vehicle-move-reg/updateVehicleMoveReg", 
    async ({ id, data }: { id: string; data: VehicleMoveReg }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put( 
                `/vehicle-movement-register/update_vehicle_movement_register_form/${id}`,
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

export const getVehicleMoveReg = createAsyncThunk(
    "vehicle-move-reg/getVehicleMoveReg",
    async (vehicleId: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/vehicle-movement-register/get_vehicle_movement_register_form/${vehicleId}`);
        return response.data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

export const deleteVehicleMoveReg = createAsyncThunk<
    string, // Return type (ID of deleted item)
    string, // Argument type (ID to delete)
    { rejectValue: { message: string } } // Error type
>(
    "vehicle-move-reg/deleteVehicleMoveReg",
    async (id, { rejectWithValue }) => { 
        try {
            await axiosInstance.delete(
                `/vehicle-movement-register/delete_vehicle_movement_register_form/${id}`
            );
            return id; // Return the deleted ID
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to delete form, try again"
            });
        }
    }
);


// Get all forms
export const getAllVehicleMoveReg = createAsyncThunk(
    "vehicle-move-reg/getAllVehicleMoveReg", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get( 
                `/vehicle-movement-register/get_vehicle_movement_register_form`
            );
            return response.data.data; 
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get forms, try again"
            });
        }
    }
);
