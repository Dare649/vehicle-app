'use client';

import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosAdd,  IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import Select from "react-select";


interface EmployeeWeeklyActivityReportProps {
  handleClose: () => void;
}

interface OptionType {
    value: string;
    label: string;
}

const EmployeeWeeklyActivityReport = ({ handleClose }: EmployeeWeeklyActivityReportProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [dates, setDates] = useState<{ [key: string]: Date | null }>({});
  const [challenges, setChallenges] = useState<string[]>([""]);
  const [recoveryPlans, setRecoveryPlans] = useState<string[]>([""]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);


  // Handle input change
  const handleChange = (index: number, value: string) => {
    const updatedChallenges = [...challenges];
    updatedChallenges[index] = value;
    setChallenges(updatedChallenges);
  };

  // Add new challenge input
  const handleAdd = () => {
    setChallenges([...challenges, ""]);
  };

  // Remove a challenge input
  const handleRemove = (index: number) => {
    const updatedChallenges = challenges.filter((_, i) => i !== index);
    setChallenges(updatedChallenges);
  };


  // Handle input change for recovery plans
  const handleRecoveryPlanChange = (index: number, value: string) => {
    const updatedPlans = [...recoveryPlans];
    updatedPlans[index] = value;
    setRecoveryPlans(updatedPlans);
  };

  // Add a new recovery plan input
  const handleAddRecoveryPlan = () => {
    setRecoveryPlans([...recoveryPlans, ""]);
  };

  // Remove a recovery plan input
  const handleRemoveRecoveryPlan = (index: number) => {
    setRecoveryPlans(recoveryPlans.filter((_, i) => i !== index));
  };

  const inspectionOptions: OptionType[] = [
    { value: "", label: "Select activity status" },
    { value: "ongoing", label: "Ongoing" },
    { value: "suspended", label: "Suspended" },
    { value: "completed", label: "Completed" },
  ];


  


  return (
    <div className="w-full h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold lg:text-xl sm:text-lg capitalize">employee weekly activity report</h2>
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
            <h2 className="font-bold text-gray-400 uppercase">employee details</h2>
            <div className="py-2">
                <hr className="w-full border-none h-0.5 bg-gray-300" />
            </div>
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">employee name</h2>
            <input 
              type="text" 
              placeholder="Enter name"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">designated department</h2>
            <input 
              type="text" 
              placeholder="Enter department"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">designation</h2>
            <input 
              type="text" 
              placeholder="Enter designation"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">supervisor</h2>
            <input 
              type="text" 
              placeholder="Enter supervisor"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>


          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">date of reporting</h2>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select date"
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
                placeholderText="Select week"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
            />
            </div>
          </div>

          <h2 className="font-bold text-gray-400 uppercase">task details</h2>
        <div className="py-2">
            <hr className="w-full border-none h-0.5 bg-gray-300" />
        </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">task description</h2>
            <input 
              type="text" 
              placeholder="Enter task description"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">responsibility/delegates</h2>
            <input 
              type="text" 
              placeholder="Enter responsibility/delegates"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
          </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">status</h2>
            <Select
                options={inspectionOptions}
                value={selectedOption}
                onChange={(selected) => setSelectedOption(selected)}
                onMenuOpen={() => setOpenDropdown(true)}
                onMenuClose={() => setOpenDropdown(false)}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg"
                classNamePrefix="Select"
                styles={{
                    control: (provided) => ({
                    ...provided,
                    borderRadius: "0.5rem", // rounded-lg
                    borderColor: "#D1D5DB", // Tailwind gray-300
                    padding: "2px",
                    "&:hover": { borderColor: "#1D4ED8" }, // Tailwind primary-1
                    boxShadow: "none",
                    }),
                }}
                components={{
                    IndicatorSeparator: () => null,
                    DropdownIndicator: () => (
                    <div className="pr-3 text-gray-500">
                        {openDropdown ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </div>
                    ),
                }}
                />
          </div>

          <div className="mb-3 w-full">
                <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">
                    Challenges
                </h2>
        
                {challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Enter challenge"
                            value={challenge}
                            onChange={(e) => handleChange(index, e.target.value)}
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                    
                        <AiFillDelete
                            onClick={() => handleRemove(index)}
                            className="text-red-500 cursor-pointer"
                            size={25}
                        />
                    </div>
                ))}

                <button
                    onClick={handleAdd}
                    className="text-white bg-primary-1 rounded-lg px-4 py-2 text-sm flex items-center gap-x-1"
                >
                    <span><IoIosAdd size={20}/></span>
                    <span className='capitalize cursor-pointer'>add</span>
                </button>
          </div>
          <div className="mb-3 w-full">
                <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">
                    recovery plans
                </h2>
        
                {recoveryPlans.map((recoveryPlans, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Enter recovery plan"
                            value={recoveryPlans}
                            onChange={(e) => handleRecoveryPlanChange(index, e.target.value)}
                            className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                        />
                    
                        <AiFillDelete
                            onClick={() => handleRemoveRecoveryPlan(index)}
                            className="text-red-500 cursor-pointer"
                            size={25}
                        />
                    </div>
                ))}

                <button
                    onClick={handleAddRecoveryPlan}
                    className="text-white bg-primary-1 rounded-lg px-4 py-2 text-sm flex items-center gap-x-1"
                >
                    <span><IoIosAdd size={20}/></span>
                    <span className='capitalize cursor-pointer'>add</span>
                </button>          
        
          </div>

          <div className="mb-3 w-full">
            <textarea
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                placeholder="comment"
                rows={5}
            />
          </div>

          <div className='mb-3'>
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">
                prepared by:
            </h2>
            <div className="flex items-start gap-x-3">
                <div className="flex-1 w-full">
                    <input 
                        type="text" 
                        placeholder="Enter name"
                        className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                    />
                </div>
                <div className="flex-1 w-full">
                    <input 
                        type="text" 
                        placeholder="Enter designation"
                        className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                    />
                </div>
            </div>
          </div>
          <div className='mb-3'>
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">
                approved by:
            </h2>
            <div className="flex items-start gap-x-3">
                <div className="flex-1 w-full">
                    <input 
                        type="text" 
                        placeholder="Enter name"
                        className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                    />
                </div>
                <div className="flex-1 w-full">
                    <input 
                        type="text" 
                        placeholder="Enter designation"
                        className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
                    />
                </div>
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

export default EmployeeWeeklyActivityReport;
