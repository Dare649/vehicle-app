'use client';

import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface VehicleMaintenanceLogProps {
  handleClose: () => void;
}

const VehicleMaintenanceLog: React.FC<VehicleMaintenanceLogProps> = ({ handleClose}) => {
  const [selectedYear, setSelectedYear] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="w-full h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold lg:text-xl sm:text-lg capitalize">Vehicle Maintenance Log</h2>
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
          {/* Vehicle Details */}
          <h2 className="font-bold text-gray-400 uppercase">Vehicle Details</h2>
          <div className="py-2">
            <hr className="w-full border-none h-0.5 bg-gray-300" />
          </div>

          {/* Make Input */}
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Make</h2>
            <input 
              type="text" 
              placeholder="Enter car make"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>

          {/* Model Input */}
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Model</h2>
            <input 
              type="text" 
              placeholder="Enter car model"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>

          {/* Year & Vehicle Number */}
          <div className="flex items-start gap-x-3 mb-3">
            {/* Year Picker */}
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Year</h2>
              <DatePicker
                selected={selectedYear}
                onChange={(date: Date | null) => setSelectedYear(date)}
                showYearPicker
                dateFormat="yyyy"
                placeholderText="Select car year"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
                maxDate={new Date()}
              />
            </div>

            {/* Vehicle Number Input */}
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Vehicle Number</h2>
              <input 
                type="text" 
                placeholder="Enter car vehicle number"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              />
            </div>
          </div>

          {/* Engine Input */}
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Engine</h2>
            <input 
              type="text" 
              placeholder="Enter car engine"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>  

          {/* Maintenance Details */}
          <h2 className="font-bold text-gray-400 uppercase">Maintenance Details</h2>
          <div className="py-2">
            <hr className="w-full border-none h-0.5 bg-gray-300" />
          </div>  

          {/* Date of Service */}
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Date of Service</h2>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => setSelectedDate(date)}
              dateFormat="dd-MM-yyyy"
              placeholderText="Select date of service"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
            />
          </div>

          {/* Mileage of Service */}
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Mileage of Service</h2>
            <input 
              type="number" 
              placeholder="Enter mileage of services"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          {/* Work Performed */}
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Work Performed and Service Schedule</h2>
            <input 
              type="text" 
              placeholder="Enter work performed and service schedule"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>  
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Performed by</h2>
            <input 
              type="text" 
              placeholder="Performed by"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>  
          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">cost</h2>
              <input 
                type="number" 
                placeholder="Enter service cost"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">invoice/receipt</h2>
              <input 
                type="text" 
                placeholder="Enter invoice/receipt"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              />
            </div>
          </div>
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">notes</h2>
            <textarea
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              placeholder="Write service note"
              rows={3}
            > 
            </textarea>
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

export default VehicleMaintenanceLog;
