'use client';

import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface VehicleMovementRegisterProps {
  handleClose: () => void;
}

const VehicleMovementRegister = ({ handleClose }: VehicleMovementRegisterProps) => {
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [signature1, setSignature1] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature1(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold lg:text-xl sm:text-lg capitalize">Vehicle register</h2>
        <div onClick={handleClose}>
          <IoMdClose size={30} className="text-red-500 cursor-pointer" />
        </div>
      </div>

      {/* Separator */}
      <div className="pt-3 pb-2">
        <hr className="w-full border-none h-0.5 bg-gray-300" />
      </div>

      {/* Scrollable Content */}
      <div className="w-full lg:p-3 sm:p-2 flex-1 overflow-y-auto custom-scroll">
        <form className="w-full">
          
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">vehicle number</h2>
            <input 
              type="text" 
              placeholder="Enter car make"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>

          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">month</h2>
              <DatePicker
                selected={selectedMonth}
                onChange={(date: Date | null) => setSelectedMonth(date)}
                dateFormat="MM-yyyy" // Format to show only month and year
                showMonthYearPicker // Enables only month & year selection
                placeholderText="Select month"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">week</h2>
              <DatePicker
                selected={selectedWeek}
                onChange={(date: Date | null) => setSelectedWeek(date)}
                dateFormat="MM-yyyy" // Format to show only month and year
                showMonthYearPicker // Enables only month & year selection
                placeholderText="Select month"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">date from</h2>
              <DatePicker
                selected={fromDate}
                onChange={(date: Date | null) => setFromDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select completed date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">date to</h2>
              <DatePicker
                selected={toDate}
                onChange={(date: Date | null) => setToDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select completed date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">meter starts</h2>
              <input 
                type="number" 
                placeholder="Enter meter start"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">meter ends</h2>
              <input 
                type="number" 
                placeholder="Enter meter end"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="flex-1 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">kilometer</h2>
            <input 
              type="number" 
              placeholder="Enter kilometer"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div className="w-full mb-5">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">driver signature</h2>
            <div className="relative w-full h-40 border-2 border-gray-300 rounded-lg focus:border-primary-1 flex items-center justify-center overflow-hidden cursor-pointer">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload}
              />
              {signature ? (
                <img src={signature} alt="Signature Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-gray-500 text-sm">Click to Upload Signature</span>
              )}
            </div>
          </div>
          <div className="w-full mb-5">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">security signature</h2>
            <div className="relative w-full h-40 border-2 border-gray-300 rounded-lg focus:border-primary-1 flex items-center justify-center overflow-hidden cursor-pointer">
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageUpload1}
              />
              {signature1 ? (
                <img src={signature1} alt="Signature Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-gray-500 text-sm">Click to Upload Signature</span>
              )}
            </div>
          </div>
          <button
            type='submit'
            className='rounded-lg bg-primary-1 w-full text-white hover:text-primary-1 hover:bg-transparent hover:border-2 hover:border-primary-1 outline-none py-3 cursor-pointer capitalize'
          >
            submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default VehicleMovementRegister;
