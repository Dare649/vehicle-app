import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";


interface InspectionItem {
    item: string;
    status: number;
  }
  
  interface DailyInspectionReport {
    date: string; 
    driver_name: string; 
    total_mileage: number; 
    general_items: InspectionItem[]; 
    driver_area_items: InspectionItem[]; 
    front_rare_items: InspectionItem[]; 
    performed_by_user: string;
  }



export const createDailyInspectionReport = createAsyncThunk(
    "daily-inspection-report/createDailyInspectionReport",
    async (data: DailyInspectionReport, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/daily-inspection/create_daily_inspection",
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
export const updateDailyInspectionReport = createAsyncThunk(
    "daily-inspection-report/updateDailyInspectionReport", 
    async ({ id, data }: { id: string; data: DailyInspectionReport }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put( 
                `/daily-inspection/update_daily_inspection/${id}`,
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

export const getDailyInspectionReport = createAsyncThunk(
    "daily-inspection-report/getDailyInspectionReport",
    async (vehicleId: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/daily-inspection/get_daily_inspection/${vehicleId}`);
        return response.data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

export const deleteDailyInspectionReport = createAsyncThunk<
    string, // Return type (ID of deleted item)
    string, // Argument type (ID to delete)
    { rejectValue: { message: string } } // Error type
>(
    "daily-inspection-report/deleteDailyInspectionReport",
    async (id, { rejectWithValue }) => { 
        try {
            await axiosInstance.delete(
                `/daily-inspection/delete_daily_inspection/${id}`
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
export const getAllDailyInspectionReport = createAsyncThunk(
    "daily-inspection-report/getAllDailyInspectionReport", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get( 
                `/daily-inspection/get_daily_inspection`
            );
            return response.data.data; 
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to get forms, try again"
            });
        }
    }
);

  