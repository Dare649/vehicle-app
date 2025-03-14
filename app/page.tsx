'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { MdOutlineMail } from "react-icons/md";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { signIn } from '@/redux/slice/auth/auth';
import Link from "next/link";

interface FormState {
  email: string;
  password: string;
}

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: ""
  });

  // Handle form input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Toggle password visibility
  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  // Handle sign-in submission
  const handleSignin = async (event: React.FormEvent) => {
    event.preventDefault();

    dispatch(startLoading());

    try {
      const result = await dispatch(signIn(formData) as any).unwrap();

      if (result) {
        toast.success('Sign in successful!');
        router.push('/form');
      }
    } catch (error) {
      toast.error("Sign-in failed!");
    } finally {
      dispatch(stopLoading());
    }
  };

  return (
    <section className="w-full h-screen flex">
      {/* Image Section */}
      <div className="sm:w-0 lg:w-[60%] h-screen flex items-center justify-center">
        <Image
          src={'/img1.jpg'}
          alt="vehicle-form-app"
          width={800}
          height={600}
          className="w-full h-full object-cover"
          quality={100}
          priority
        />
      </div>

      {/* Form Section */}
      <div className="sm:w-full lg:w-[40%] h-screen flex items-center justify-center">
        <div className="w-full max-w-md flex flex-col items-center justify-center p-3">
          <div className="w-40 flex justify-center">
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
              Welcome, <br /> Sign in to continue.
            </h2>
          </div>
          <form className="w-full mt-5" onSubmit={handleSignin}>
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 bg-transparent lg:p-2 sm:p-1 mb-5">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full outline-none border-none bg-transparent"
                required
              />
              <MdOutlineMail size={25} className="text-gray-400 font-bold"/>
            </div>
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full outline-none border-none bg-transparent"
                required
              />
              <div onClick={handlePasswordToggle} className="cursor-pointer">
                {showPassword ? (
                  <GoEye size={25} className="text-gray-400 font-bold"/>
                ) : (
                  <GoEyeClosed size={25} className="text-gray-400 font-bold"/>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-1 text-white font-bold capitalize text-center hover:border-2 rounded-lg hover:bg-transparent hover:text-primary-1 hover:border-primary-1 py-5 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
          <div className="flex justify-center mt-5">
            <p className="text-gray-400 font-bold first-letter:capitalize">
              Don't have an account?{" "}
              <Link href="/auth/sign-up" className="text-primary-1 first-letter:capitalize">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
