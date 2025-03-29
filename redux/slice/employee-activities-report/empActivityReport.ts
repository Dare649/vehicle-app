import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";

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

interface EmployeeActivityReport {
    performed_by_user: string;
    employee_name: string;
    department: string;
    designation: string;
    supervisor: string;
    date_of_reporting: string;
    week: string;
    task_items: TaskItem[];
}



// Create form
export const createEmployeeActivityReport = createAsyncThunk(
    "employee-activity-report/createEmployeeActivityReport",
    async (data: EmployeeActivityReport, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                "/employee-activity-report/create_employee_activity_report",
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to create report, try again"
            });
        }
    }
);



// Update form
export const updateEmployeeActivityReport = createAsyncThunk(
    "employee-activity-report/updateEmployeeActivityReport", 
    async ({ id, data }: { id: string; data: EmployeeActivityReport }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put( 
                `/employee-activity-report/update_employee_activity_report/${id}`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to update report, try again"
            });
        }
    }
);


export const getEmployeeActivityReport = createAsyncThunk(
    "employee-activity-report/getEmployeeActivityReport",
    async (vehicleId: string, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/employee-activity-report/get_employee_activity_report/${vehicleId}`);
        return response.data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );


  export const deleteEmployeeActivityReport = createAsyncThunk<
      string, // Return type (ID of deleted item)
      string, // Argument type (ID to delete)
      { rejectValue: { message: string } } // Error type
  >(
      "employee-activity-report/deleteEmployeeActivityReport",
      async (id, { rejectWithValue }) => { 
          try {
              await axiosInstance.delete(
                  `/employee-activity-report/delete_employee_activity_report/${id}`
              );
              return id; // Return the deleted ID
          } catch (error: any) {
              return rejectWithValue({
                  message: error.response?.data?.message || error.message || "Failed to delete report, try again"
              });
          }
      }
  );



  // Get all forms
  export const getAllEmployeeActivityReport = createAsyncThunk(
      "employee-activity-report/getAllEmployeeActivityReport", 
      async (_, { rejectWithValue }) => {
          try {
              const response = await axiosInstance.get( 
                  `/employee-activity-report/get_employee_activity_report`
              );
              return response.data.data; 
          } catch (error: any) {
              return rejectWithValue({
                  message: error.response?.data?.message || error.message || "Failed to get forms, try again"
              });
          }
      }
  );
  