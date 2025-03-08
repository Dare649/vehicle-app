'use client';

import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface VehicleMaintenanceRequestFormProps {
  handleClose: () => void;
}

const VehicleMaintenanceRequestForm: React.FC<VehicleMaintenanceRequestFormProps> = ({ handleClose}) => {
  const [completedDate, setCompletedDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

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

  return (
    <div className="w-full h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold lg:text-xl sm:text-lg capitalize">Vehicle Maintenance request form</h2>
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

          {/* Model Input */}
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">person filling out this form</h2>
            <input 
              type="text" 
              placeholder="Enter car model"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>


          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">report date</h2>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select report date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">completed date</h2>
              <DatePicker
                selected={completedDate}
                onChange={(date: Date | null) => setCompletedDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select completed date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>
          </div>
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">description of problem</h2>
            <textarea
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              placeholder="Write decription of problem"
              rows={3}
            > 
            </textarea>
          </div>
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">mechanic notes</h2>
            <textarea
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              placeholder="Write mechanic notes"
              rows={3}
            > 
            </textarea>
          </div>

          <div className="w-full mb-5">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">mechanic signature</h2>
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

export default VehicleMaintenanceRequestForm;
