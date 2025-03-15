import { createSlice } from "@reduxjs/toolkit";
import { signIn, signUp, verifyOtp, resendOtp } from "./auth";

interface Auth {
    first_name: string;
    last_name: string;
    role: string;
    designation: string;
    user_img: string;
    email: string;
    password: string;
}

interface AuthState {
    auth: Auth[];
    token: string | null;
    signInStatus: "idle" | "isLoading" | "succeded" | "failed";
    signUpStatus: "idle" | "isLoading" | "succeded" | "failed";
    verifyOtpStatus: "idle" | "isLoading" | "succeded" | "failed";
    resendOtpStatus: "idle" | "isLoading" | "succeded" | "failed";
    error: string | null;
}

const initialState: AuthState = {
    auth: [],
    token: typeof window !== "undefined" ? localStorage.getItem("token"): null, 
    signInStatus: "idle",
    signUpStatus: "idle",
    verifyOtpStatus: "idle",
    resendOtpStatus: "idle",
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle sign in
            .addCase(signIn.pending, (state) => {
                state.signInStatus = "isLoading";
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.signInStatus = "succeded"; 
                state.token = action.payload.token.access_token;
                state.auth.push(action.payload);
                localStorage.setItem("token", action.payload.token.access_token);
            })
            .addCase(signIn.rejected, (state, action) => {
                state.signInStatus = "failed";
                state.error = action.error.message ?? "Failed to sign in, try again.";
            })

            // Handle sign up
            .addCase(signUp.pending, (state) => {
                state.signUpStatus = "isLoading";
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.signUpStatus = "succeded"; // Fix missing status update
                state.auth.push(action.payload);
            })
            .addCase(signUp.rejected, (state, action) => {
                state.signUpStatus = "failed";
                state.error = action.error.message ?? "Failed to sign up, try again.";
            })

            // Handle verify otp
            .addCase(verifyOtp.pending, (state) => {
                state.verifyOtpStatus = "isLoading";
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.verifyOtpStatus = "succeded"; // Fix missing status update
                state.auth.push(action.payload);
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.verifyOtpStatus = "failed";
                state.error = action.error.message ?? "OTP verification failed, try again.";
            })

            // Handle resend otp
            .addCase(resendOtp.pending, (state) => {
                state.resendOtpStatus = "isLoading";
            })
            .addCase(resendOtp.fulfilled, (state) => {
                state.resendOtpStatus = "succeded"; // No need to push to auth
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.resendOtpStatus = "failed";
                state.error = action.error.message ?? "Failed to resend OTP, try again.";
            });
    },
});



export default authSlice.reducer;
