'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { IoIosLogOut } from "react-icons/io";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';

const TopNav = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);
    const [isScrolled, setIsScrolled] = useState(false);

    // Function for signing out
    const handleSignout = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (isLoading) return; // Prevent multiple clicks

        dispatch(startLoading());

        setTimeout(() => {
            router.replace('/'); // Use replace instead of push
            toast.success('Sign out success!');
            dispatch(stopLoading());
        }, 3000);
    };


    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 10) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  

    return (
        <div
            className={`w-full fixed top-0 z-50 transition-all duration-300 ${
                isScrolled ? "bg-white shadow-md" : "bg-transparent"
            }`}
        >
            <div className="flex items-center justify-between p-3">
                <div className="w-30">
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
                <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                    src={"/car4.jpg"}
                    alt="User Profile"
                    width={50}
                    height={50}
                    className="w-full h-full object-cover rounded-full"
                    quality={100}
                    priority
                    />
                </div>

                {/* Sign Out Button */}
                <button
                    className="text-red-500 font-semibold flex items-center gap-x-1 px-3 py-1 transition-all duration-200 cursor-pointer"
                    onClick={handleSignout}
                    disabled={isLoading} // Prevents multiple clicks
                >
                    <IoIosLogOut size={25} />
                    <h4>{isLoading ? "Signing out..." : "Sign out"}</h4>
                </button>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
