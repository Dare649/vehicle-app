'use client';

import React, { useState } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { createVehicleMoveReg } from '@/redux/slice/veh-movement-reg/vehMoveReg';
import { useRouter } from 'next/navigation';


interface VehicleMovementRegisterProps {
  handleClose: () => void;
}

interface FormState {
  veh_number: string;
  month: string;
  week: string;
  date_from: string;
  date_to: string;
  meter_start: number;
  meter_end: number;
  km: number;
  security_name: string;
}

const VehicleMovementRegister = ({ handleClose }: VehicleMovementRegisterProps) => {
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const dispatch = useDispatch<any>();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormState>({
    veh_number: "",
    month: "",
    week: "",
    date_from: "",
    date_to: "",
    meter_start: 0,
    meter_end: 0,
    km: 0,
    security_name: "",
  })


  const getWeek = (date: Date): number => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - oneJan.getTime();
    return Math.ceil((diff / (1000 * 60 * 60 * 24) + oneJan.getDay() + 1) / 7);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: [ "meter_end", "km"].includes(name)
        ? value === "" ? "" : Number(value) // Convert to number or keep empty
        : value, // Keep other fields as strings
    }));
  };
  
  

  const handleDateChange = (date: Date | null, field: keyof FormState) => {
    if (date) {
      const formattedDate = date.toISOString().split('en-CA')[0];
      setFormData((prevData) => ({
        ...prevData,
        [field]: formattedDate,
      }));

      if (field === "month") setSelectedMonth(date);
      if (field === "week") setSelectedWeek(date);
      if (field === "date_from") setFromDate(date);
      if (field === "date_to") setToDate(date);
    }
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.veh_number) newErrors.veh_number = "Vehicle number is required";
    if (!selectedMonth) newErrors.month = "Month is required";
    if (!selectedWeek) newErrors.week = "Week is required";
    if (!fromDate) newErrors.date_from = "Start date is required";
    if (!toDate) newErrors.date_to = "End date is required";
    if (formData.meter_start <= 0) newErrors.meter_start = "Meter start must be greater than zero";
    if (formData.meter_end <= formData.meter_start) newErrors.meter_end = "Meter end must be greater than meter start";
    if (!formData.security_name) newErrors.security_name = "Security name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    dispatch(startLoading());
    try {
      const result = await dispatch(
        createVehicleMoveReg({
          ...formData,
          month: selectedMonth ? `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}` : "",
          week: selectedWeek ? getWeek(selectedWeek).toString() : "",
          date_from: fromDate ? fromDate.toISOString().split('T')[0] : "",
          date_to: toDate ? toDate.toISOString().split('T')[0] : "",
        }) as any
      ).unwrap();

      if (result) {
        toast.success('Form created successfully!');
        handleClose();
      }
    } catch (error) {
      toast.error("Failed to create form, try again!");
    } finally {
      dispatch(stopLoading());
    }
  };


  return (
    <div className="w-full h-[80vh] flex flex-col">
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
        <form 
          className="w-full"
          onSubmit={handleCreateForm}
        >
          
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">vehicle number</h2>
            <input 
              type="text"
              name='veh_number' 
              placeholder="Enter car number"
              onChange={handleChange}
              value={formData.veh_number}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.veh_number && <p className="text-red-500 text-sm">{errors.veh_number}</p>}
          </div>

          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">month</h2>
              <DatePicker
                selected={selectedMonth}
                onChange={(date) => handleDateChange(date, "month")}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                placeholderText="Select month"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
              {errors.month && <p className="text-red-500 text-sm">{errors.month}</p>}
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">week</h2>
              <DatePicker
                selected={selectedWeek}
                onChange={(date) => handleDateChange(date, "week")}
                dateFormat="wo 'week of' yyyy"
                showWeekNumbers
                placeholderText="Select week"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
              {errors.week && <p className="text-red-500 text-sm">{errors.week}</p>}
            </div>
          </div>

          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">date from</h2>
              <DatePicker
                selected={formData.date_from ? new Date(formData.date_from) : null}
                onChange={(date) => handleDateChange(date, "date_from")}
                name='date_form'
                value={formData.date_from}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select completed date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
              {errors.date_from && <p className="text-red-500 text-sm">{errors.date_from}</p>}
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">date to</h2>
              <DatePicker
                selected={formData.date_to ? new Date(formData.date_to) : null}
                onChange={(date) => handleDateChange(date, "date_to")}
                name='date_to'
                value={formData.date_to}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select completed date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
              {errors.date_to && <p className="text-red-500 text-sm">{errors.date_to}</p>}
            </div>
          </div>
          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">meter starts</h2>
              <input 
                type="number" 
                placeholder="Enter meter start"
                name='meter_start'
                value={formData.meter_start}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              {errors.meter_start && <p className="text-red-500 text-sm">{errors.meter_start}</p>}
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">meter ends</h2>
              <input 
                type="number" 
                name='meter_end'
                placeholder="Enter meter end"
                onChange={handleChange}
                value={formData.meter_end}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              {errors.meter_end && <p className="text-red-500 text-sm">{errors.meter_end}</p>}
            </div>
          </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">kilometer</h2>
            <input 
              type="number" 
              placeholder="Enter kilometer"
              name='km'
              onChange={handleChange}
              value={formData.km}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {errors.km && <p className="text-red-500 text-sm">{errors.km}</p>}
          </div>
          
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">security name</h2>
            <input 
              type="text" 
              placeholder="Enter security name"
              onChange={handleChange}
              name='security_name'
              value={formData.security_name}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.security_name && <p className="text-red-500 text-sm">{errors.security_name}</p>}
          </div>
          <button
            type='submit'
            className='rounded-lg bg-primary-1 w-full text-white hover:text-primary-1 hover:bg-transparent hover:border-2 hover:border-primary-1 outline-none py-3 cursor-pointer capitalize'
          >
            { isLoading ? "submitting" : "submit"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default VehicleMovementRegister;
