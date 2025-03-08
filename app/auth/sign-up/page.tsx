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

const Signup = () => {
  const [password, setPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  // function to toggle password visibility
  const handlePassword = () => setPassword((prev) => !prev);

  // function for sign in
  const handleSignin = (event: React.FormEvent) => {
    event.preventDefault(); 

    dispatch(startLoading());

    setTimeout(() => {
      router.push('/');
      toast.success('Sign in success!');
      dispatch(stopLoading());
    }, 3000); 
  };

  return (
    <section className="w-full h-screen flex">
      
      {/* Form Section */}
      <div className="sm:w-full lg:w-[40%] h-screen flex items-center justify-center">
        <div className="w-full max-w-md flex flex-col items-center justify-center p-3">
          <div className="w-full">
            <h2 className="text-xl sm:text-2xl text-left font-semibold">
              Welcome, <br /> Sign up to get started.
            </h2>
          </div>
          <form 
            className="w-full mt-5"
            onSubmit={handleSignin}
          >
            <div className='w-full flex items-center gap-5'>
                <div className="sm:w-full lg:w-[50%] flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
                    <input 
                        type="text" 
                        placeholder="Enter your first name"
                        className="w-full outline-none border-none bg-transparent"
                    />
                    <CiUser size={25} className="text-gray-400 font-bold"/>
                </div> 
                <div className="sm:w-full lg:w-[50%] flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
                    <input 
                        type="text" 
                        placeholder="Enter your last name"
                        className="w-full outline-none border-none bg-transparent"
                    />
                    <CiUser size={25} className="text-gray-400 font-bold"/>
                </div> 
            </div>
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input 
                type="text" 
                placeholder="Enter your email"
                className="w-full outline-none border-none bg-transparent"
              />
              <MdOutlineMail size={25} className="text-gray-400 font-bold"/>
            </div>
            <div className="w-full flex items-center gap-x-2 border-b-2 border-gray-400 focus-within:border-primary-1 lg:p-2 sm:p-1 mb-5">
              <input 
                type={ password ? 'text': 'password'} 
                placeholder="Enter your password"
                className="w-full outline-none border-none bg-transparent"
              />
              <div 
                onClick={handlePassword}
                className='cursor-pointer'
              >
                {password ? (
                  <GoEye size={25} className="text-gray-400 font-bold"/>
                ) : (
                  <GoEyeClosed size={25} className="text-gray-400 font-bold"/>
                )}
              </div>
            </div>
            <button
              type='submit' 
              className='w-full bg-primary-1 text-white font-bold capitalize text-center hover:border-2 rounded-lg hover:bg-transparent hover:text-primary-1 hover:border-primary-1 py-5 cursor-pointer'
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </form>
          <div className='flex justify-center mt-5'>
            <p className='text-gray-400 font-bold first-letter:capitalize'>already have an account? <Link href={"/"} className='text-primary-1 first-letter:capitalize'>sign in</Link></p>
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
