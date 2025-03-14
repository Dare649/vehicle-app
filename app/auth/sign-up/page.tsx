'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { MdOutlineMail } from "react-icons/md";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import Link from "next/link";
import { signUp } from '@/redux/slice/auth/auth';
import { LiaUserTieSolid } from "react-icons/lia";
import ImageUploader from '@/components/image-upload/page';

interface FormState {
  first_name: string;
  last_name: string;
  role: string;
  designation: string;
  user_img: string; // Base64 string
  email: string;
  password: string;
}

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    first_name: "",
    last_name: "",
    role: "driver",
    designation: "",
    user_img: "",
    email: "",
    password: "",
  });

  // Toggle password visibility
  const togglePassword = () => setPasswordVisible((prev) => !prev);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (name: string, base64String: string) => {
    setFormData((prev) => ({
      ...prev,
      user_img: base64String,
    }));
  };

  // Handle sign up
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(startLoading());

    try {
      await dispatch(signUp(formData) as any);
      toast.success("Sign up successful!");
      // Store email in localStorage
      localStorage.setItem("userEmail", formData.email);

      // Navigate to Verify OTP page
      router.push("/auth/verify-otp");
    } catch (error) {
      toast.error("Sign up failed!");
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <section className="w-full h-screen flex">
      {/* Form Section */}
      <div className="sm:w-full lg:w-[40%] h-screen flex items-center justify-center overflow-y-auto py-10">
        <div className="w-full max-w-md flex flex-col items-center justify-center p-3">
          <div className="w-40 flex justify-center mt-40">
            <Image
              src={"/logo.png"}
              alt="User Profile"
              width={50}
              height={50}
              className="w-full"
              quality={100}
              priority
            />
          </div>
          <div className="w-full lg:mt-10 sm:mt-5">
            <h2 className="text-xl sm:text-2xl text-left font-semibold">
              Welcome, <br /> Sign up to get started.
            </h2>
          </div>
          <form className="w-full mt-5" onSubmit={handleSignup}>
            <div className="w-full flex items-center gap-5">
              <div className="sm:w-full lg:w-[50%] flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className="w-full outline-none border-none bg-transparent"
                  required
                />
                <CiUser size={25} className="text-gray-400 font-bold" />
              </div>
              <div className="sm:w-full lg:w-[50%] flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className="w-full outline-none border-none bg-transparent"
                  required
                />
                <CiUser size={25} className="text-gray-400 font-bold" />
              </div>
            </div>

            

            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full outline-none border-none bg-transparent"
                required
              />
              <MdOutlineMail size={25} className="text-gray-400 font-bold" />
            </div>

            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Enter your designation"
                className="w-full outline-none border-none bg-transparent"
                required
              />
              <LiaUserTieSolid size={25} className="text-gray-400 font-bold" />
            </div>

            <div className='w-full mb-5'>
              <ImageUploader
                id="user_img"
                name="user_img"
                text="Upload Profile Image"
                onChange={handleImageUpload}
              />
            </div>
            
            {/* Password */}
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full outline-none border-none bg-transparent"
                required
              />
              <div onClick={togglePassword} className="cursor-pointer">
                {passwordVisible ? <GoEye size={25} className="text-gray-400 font-bold" /> : <GoEyeClosed size={25} className="text-gray-400 font-bold" />}
              </div>
            </div>

            <button type="submit" className="w-full bg-primary-1 text-white font-bold capitalize text-center py-5 rounded-lg">
              {isLoading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>
          <div className="flex justify-center mt-5">
            <p className="text-gray-400 font-bold first-letter:capitalize">
              Already have an account?{" "}
              <Link href="/" className="text-primary-1 first-letter:capitalize">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Image Section */}
      <div className="sm:w-0 lg:w-[60%] h-screen flex items-center justify-center">
        <Image
          src={'/img4.jpg'}
          alt="vehicle-form-app"
          width={800}
          height={600}
          className="w-full h-full object-cover"
          quality={100}
          priority
        />
      </div>
    </section>
  );
};

export default Signup;
