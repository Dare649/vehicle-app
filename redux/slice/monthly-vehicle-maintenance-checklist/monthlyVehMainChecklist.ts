import { createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";

interface MonthlyVehMainChecklist {
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
  

// Create form
export const createMonthlyVehMainChecklist = createAsyncThunk(
    "monthly-vehicle-maintenance-checklist/createMonthlyVehMainChecklist",
    async (data: MonthlyVehMainChecklist, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/monthly-checklist/create_monthly_checklist",
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
export const updateMonthlyVehMainChecklist = createAsyncThunk(
    "monthly-vehicle-maintenance-checklist/updateMonthlyVehMainChecklist", 
    async ({ id, data }: { id: string; data: MonthlyVehMainChecklist }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put( 
                `/monthly-checklist/update_monthly_checklist/${id}`,
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

export const getMonthlyVehMainChecklist = createAsyncThunk(
    "monthly-vehicle-maintenance-checklist/getMonthlyVehMainChecklist",
    async (vehicleId: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/monthly-checklist/get_monthly_checklist/${vehicleId}`);
        return response.data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

export const deleteMonthlyVehMainChecklist = createAsyncThunk<
    string, // Return type (ID of deleted item)
    string, // Argument type (ID to delete)
    { rejectValue: { message: string } } // Error type
>(
    "monthly-vehicle-maintenance-checklist/deleteMonthlyVehMainChecklist",
    async (id, { rejectWithValue }) => { 
        try {
            await axiosInstance.delete(
                `/monthly-checklist/delete_monthly_checklist/${id}`
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
export const getAllMonthlyVehMainChecklist = createAsyncThunk(
    "monthly-vehicle-maintenance-checklist/getAllMonthlyVehMainChecklist", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get( 
                `/monthly-checklist/get_monthly_checklist`
            );
            return response.data.data; 
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get forms, try again"
            });
        }
    }
);
