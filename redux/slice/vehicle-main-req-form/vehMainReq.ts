import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";

// Define vehicle maintenance log data type
interface VehMainReqForm {
    veh_number: string;
    filled_by: string;
    report_date: string;
    mechanic_notes: string;
    description_of_problem: string;
    completed_date: string;
    mechanic_name: string;
    performed_by_user: string;
}


// Create form
export const createVehicleMainReq = createAsyncThunk(
    "vehicle-main-req/createVehicleMainReq",
    async (data: VehMainReqForm, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/vehicle-maintenance-req-form/create_vehicle_maintenance_req_form",
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
export const updateVehicleMainReq = createAsyncThunk(
    "vehicle-main-req/updateVehicleMainReq", 
    async ({ id, data }: { id: string; data: VehMainReqForm }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put( 
                `/vehicle-maintenance-req-form/update_vehicle_maintenance_req_form/${id}`,
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
export const getVehicleMainReq = createAsyncThunk(
    "vehicle-main-req/getVehicleMainReq", 
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get( 
                `/vehicle-maintenance-req-form/get_vehicle_maintenance_req_form/${id}`
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get form, try again"
            });
        }
    }
);


// Delete form
export const deleteVehicleMainReq = createAsyncThunk(
    "vehicle-main-req/deleteVehicleMainReq",
    async ({ id }: { id: string }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(
          `/vehicle-maintenance-req-form/delete_vehicle_maintenance_req_form/${id}`
        );
        return response.data;
      } catch (error: any) {
        return rejectWithValue({
          message: error.response?.data?.message || error.message || "Failed to delete form",
        });
      }
    }
  );
  


// get all form
export const getAllVehicleMainReq = createAsyncThunk(
    "vehicle-main-req/getAllVehicleMainReq", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get( 
                `/vehicle-maintenance-req-form/get_all_vehicle_maintenance_req_form`
            );
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get forms, try again"
            });
        }
    }
);
