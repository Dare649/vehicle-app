"use client";

import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { frontRare, generalDetails, driverArea } from "@/data/dummy";

interface DailyInspectionProps {
  handleClose: () => void;
}

const DailyInspection = ({ handleClose }: DailyInspectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [signedDate, setSignedDate] = useState<Date | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
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

  

  const inspectionOptions = [
    { value: "", label: "Select inspection code" },
    { value: "x", label: "X" },
    { value: "o", label: "O" },
  ];

  return (
    <div className="w-full h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold lg:text-xl sm:text-lg capitalize">
          Daily Inspection Report
        </h2>
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
          {/* Driver Name Input */}
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">
              Driver Name
            </h2>
            <input
              type="text"
              placeholder="Enter driver name"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>

          {/* Date & Mileage */}
          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">
                Date
              </h2>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">
                Total Mileage
              </h2>
              <input
                type="number"
                placeholder="Enter total mileage"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Inspection Instructions */}
          <div className="mb-3 w-full">
            <p className="text-xs font-bold text-gray-500">
              For each trip, enter the appropriate inspection code in the
              designated column: ✔ X – Item passed inspection ❌ O – Item is
              defective (requires attention). If an item is marked X or O,
              provide additional details in the comment section. Items not
              marked are assumed to have no known defects. This form serves as
              both Pre-Trip and Post-Trip Inspections. If you notice any issues,
              report them to the office immediately.
            </p>
          </div>

          <div className="w-full">
            <h2 className="font-bold text-gray-400 uppercase">
              Vehicle General Details
            </h2>
            <div className="py-2">
              <hr className="w-full border-none h-0.5 bg-gray-300" />
            </div>

            <div className="w-full">
              {generalDetails.map((item, id) => (
                <div key={id} className="w-full mb-2">
                  <h2 className="font-bold uppercase text-primary-1 text-xs mb-2">
                    {item}
                  </h2>
                  <div className="relative rounded-lg">
                    <Select
                      options={inspectionOptions}
                      onMenuOpen={() => setOpenDropdown(id)}
                      onMenuClose={() => setOpenDropdown(null)}
                      className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1"
                      classNamePrefix={`Select ${item}`}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "0.5rem", // rounded-lg equivalent
                          borderColor: "#D1D5DB", // Tailwind's gray-300
                          padding: "2px",
                          "&:hover": { borderColor: "#1D4ED8" }, // Tailwind's primary-1 color
                          boxShadow: "none",
                        }),
                      }}
                      components={{
                        IndicatorSeparator: () => null,
                        DropdownIndicator: () => (
                          <div className="pr-3 text-gray-500">
                            {openDropdown === id ? (
                              <IoIosArrowUp size={20} />
                            ) : (
                              <IoIosArrowDown size={20} />
                            )}
                          </div>
                        ),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full py-5">
            <h2 className="font-bold text-gray-400 uppercase">
              Vehicle front rare Details
            </h2>
            <div className="py-2">
              <hr className="w-full border-none h-0.5 bg-gray-300" />
            </div>

            <div className="w-full">
              {frontRare.map((item, id) => (
                <div key={id} className="w-full mb-2">
                  <h2 className="font-bold uppercase text-primary-1 text-xs mb-2">
                    {item}
                  </h2>
                  <div className="relative rounded-lg">
                    <Select
                      options={inspectionOptions}
                      onMenuOpen={() => setOpenDropdown(id)}
                      onMenuClose={() => setOpenDropdown(null)}
                      className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1"
                      classNamePrefix={`Select ${item}`}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "0.5rem", // rounded-lg equivalent
                          borderColor: "#D1D5DB", // Tailwind's gray-300
                          padding: "2px",
                          "&:hover": { borderColor: "#1D4ED8" }, // Tailwind's primary-1 color
                          boxShadow: "none",
                        }),
                      }}
                      components={{
                        IndicatorSeparator: () => null,
                        DropdownIndicator: () => (
                          <div className="pr-3 text-gray-500">
                            {openDropdown === id ? (
                              <IoIosArrowUp size={20} />
                            ) : (
                              <IoIosArrowDown size={20} />
                            )}
                          </div>
                        ),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full py-5">
            <h2 className="font-bold text-gray-400 uppercase">
              Vehicle driver area Details
            </h2>
            <div className="py-2">
              <hr className="w-full border-none h-0.5 bg-gray-300" />
            </div>

            <div className="w-full">
              {driverArea.map((item, id) => (
                <div key={id} className="w-full mb-2">
                  <h2 className="font-bold uppercase text-primary-1 text-xs mb-2">
                    {item}
                  </h2>
                  <div className="relative rounded-lg">
                    <Select
                      options={inspectionOptions}
                      onMenuOpen={() => setOpenDropdown(id)}
                      onMenuClose={() => setOpenDropdown(null)}
                      className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1"
                      classNamePrefix={`Select ${item}`}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          borderRadius: "0.5rem", // rounded-lg equivalent
                          borderColor: "#D1D5DB", // Tailwind's gray-300
                          padding: "2px",
                          "&:hover": { borderColor: "#1D4ED8" }, // Tailwind's primary-1 color
                          boxShadow: "none",
                        }),
                      }}
                      components={{
                        IndicatorSeparator: () => null,
                        DropdownIndicator: () => (
                          <div className="pr-3 text-gray-500">
                            {openDropdown === id ? (
                              <IoIosArrowUp size={20} />
                            ) : (
                              <IoIosArrowDown size={20} />
                            )}
                          </div>
                        ),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <textarea
            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            placeholder="Drivers comment"
            rows={3}
          />

          <div className="w-full mb-2">
            <p className="text-xs font-bold text-gray-500">
              PRE-TRIP DRIVER CERTIFICATION:
              By checking the box below, I certify that I have reviewed the previous inspection report and conducted a pre-trip maintenance inspection for each listed item. I have noted only those with identified defects. <span>
                <input type="checkbox" className="cursor-pointer w-4 h-4"/>
              </span>
            </p>
          </div>


          <div className="w-full mb-2">
            <p className="text-xs font-bold text-gray-500">
              PRE-TRIP DRIVER CERTIFICATION:
              I have conducted a post-trip maintenance inspection for each listed item and have recorded only those with identified defects. Additionally, I have checked the vehicle for any remaining students or belongings. <span>
                <input type="checkbox" className="cursor-pointer w-4 h-4"/>
              </span>
            </p>
          </div>

          <textarea
            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            placeholder="Mechanic comment"
            rows={5}
          />


          <div className="flex items-start gap-x-3 my-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">date</h2>
              <DatePicker
                selected={signedDate}
                onChange={(date: Date | null) => setSignedDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">mechanic signature</h2>
              <div className="relative w-full h-11 border-2 border-gray-300 rounded-lg focus:border-primary-1 flex items-center justify-center overflow-hidden cursor-pointer">
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
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="rounded-lg bg-primary-1 w-full text-white hover:text-primary-1 hover:bg-transparent hover:border-2 hover:border-primary-1 outline-none py-3 cursor-pointer capitalize"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DailyInspection;
