'use client';

import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DailySiteReportProps {
  handleClose: () => void;
}

const DailySiteReport = ({ handleClose }: DailySiteReportProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dates, setDates] = useState<{ [key: string]: Date | null }>({});
  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: "ok" | "not_ok" | null }>({});
 
  const maintenanceFields = [
    'Last Oil Change',
    'Last Air Filter Change',
    'Last Cabin Filter Change',
    'Last Oil Filter Change',
    'Last Engine Tune-up',
  ];

  const milageFields = [
    'last oil change',
    'last air filter change',
    'last tire rotation'
  ]


  const handleDateChange = (field: string, date: Date | null) => {
    setDates((prev) => ({ ...prev, [field]: date }));
  };

  const inspectionItems = [
    "CHECK BELT FOR SIGNS OF FRAY OR CRACKS",
    "CHECK HOSES FOR LEAKS OR BULGES",
    "CHECK ENGINE AND GROUND FOR SIGNS OF LEAKS",
    "MAKE CERTAIN HEATER AND AIR CONDITIONING WORK",
    "CHECK WIPERS",
    "HEADLIGHTS; HIGH BEAM",
    "HEADLIGHTS; LOW BEAM",
    "FOG OR DRIVING LIGHTS",
    "TURN SIGNAL",
    "BRAKE LIGHT / TAIL LIGHT",
    "HAZARD LIGHTS",
    "DOOR LOCKS",
    "WINDOWS / WINDSHIELD FUNCTION OR CRACKS",
    "RADIO",
    "HORN",
    "TIRES – TREAD/CONDITION",
    "TIRES – PROPER INFLATION",
    "Fire Extinguisher",
    "FIRST AID KIT",
    "ACCIDENT INFORMATION PACKET IN GLOVE BOX",
    "LIQUID LEVEL CHECK",
    "COOLANT",
    "OIL",
    "AUTO TRANSMISSION",
    "POWER STEERING",
    "BRAKES",
    "WINDOW WASHER",
  ];

    // State to track selected checkboxes

    const handleCheckboxChange = (index: number, value: "ok" | "not_ok") => {
      setSelectedStatus((prev) => ({
        ...prev,
        [index]: prev[index] === value ? null : value, // Toggle selection
      }));
    };


  return (
    <div className="w-full h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold lg:text-xl sm:text-lg capitalize">monthly Vehicle Maintenance checklist</h2>
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
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">date</h2>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">current milage</h2>
              <input 
                type="number" 
                placeholder="Enter current millage"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">checked by</h2>
            <input 
              type="text" 
              placeholder="Enter checked by"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">date of:</h2>
            <div className="grid grid-cols-2 gap-4">
              {maintenanceFields.map((field) => (
                <div key={field} className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">{field}</label>
                  <DatePicker
                    selected={dates[field] || null}
                    onChange={(date) => handleDateChange(field, date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText={`Select ${field.toLowerCase()}`}
                    className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Mileage of:</h2>  
            <div className="grid grid-cols-2 gap-4">
              {milageFields.map((field) => (
                <div key={field} className="w-full">
                  <label className="block text-gray-700 font-medium mb-1 capitalize">{field}</label>
                  <input
                    type="number"
                    placeholder={`Enter ${field.toLowerCase()}`}
                    className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Inspection Items:</h2>
            
            <div className="">
              {inspectionItems.map((item, index) => (
                <div key={index} className="w-full mb-2">
                  <h2 className="block text-gray-700 font-medium capitalize text-xs">{item}:</h2>
                  
                  <div className="flex items-center gap-4 py-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        checked={selectedStatus[index] === "ok"}
                        onChange={() => handleCheckboxChange(index, "ok")}
                      />
                      <span className="text-sm font-bold uppercase">OK</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        checked={selectedStatus[index] === "not_ok"}
                        onChange={() => handleCheckboxChange(index, "not_ok")}
                      />
                      <span className="text-sm font-bold uppercase">Not OK</span>
                    </label>
                  </div>


                  <textarea
                    className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                    placeholder="Remarks"
                    rows={1}
                  />
                </div>
              ))}
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

export default DailySiteReport;
