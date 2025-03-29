import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/util/axiosInstance";



// Sign In
export const signIn = createAsyncThunk(
    "auth/signIn",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/sign_in", data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to sign in, try again.");
        }
    }
);


// get signed in user
export const getSignedInUser = createAsyncThunk(
    "auth/getSignedInUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/auth/signed_in_user");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to get signed in user, try again.");
        }
    }
);

// Sign Up
export const signUp = createAsyncThunk(
    "auth/signUp",
    async (
        data: {
            first_name: string;
            last_name: string;
            role: string;
            designation: string;
            user_img: string;
            email: string;
            password: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post("/auth/sign_up", data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to sign up, try again.");
        }
    }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (data: { email: string; otp: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/verify_otp", data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to verify OTP, try again.");
        }
    }
);

// Resend OTP
export const resendOtp = createAsyncThunk(
    "auth/resendOtp",
    async (data: { email: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/resend_otp", data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Failed to resend OTP, try again.");
        }
    }
);
