'use client';

import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import {
  createVehicleMainReq,
  updateVehicleMainReq,
  getVehicleMainReq
} from '@/redux/slice/vehicle-main-req-form/vehMainReq';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSignedInUser } from "@/redux/slice/auth/auth";

interface VehicleMaintenanceRequestFormProps {
  handleClose: () => void;
  vehicleData?: FormState | null;
}

interface FormState {
  id?: string;
  _id?: string;
  veh_number: string;
  filled_by: string;
  report_date: string;
  performed_by_user: string;
  mechanic_notes: string;
  description_of_problem: string;
  completed_date: string;
  mechanic_name: string;
}

const VehicleMaintenanceRequestForm = ({ handleClose, vehicleData }: VehicleMaintenanceRequestFormProps) => {
  const [completedDate, setCompletedDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const signedInUser = useSelector((state: RootState) => state.auth.user);
    
    useEffect(() => {
      const fetchUser = async () => {
        try {
          dispatch(startLoading());
          const user = await dispatch(getSignedInUser()).unwrap();
          if (user?._id) {
            setFormData((prevData) => ({
              ...prevData,
              performed_by_user: user._id,
            }));
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to fetch signed-in user");
        } finally {
          dispatch(stopLoading());
        }
      };
    
      fetchUser();
    }, [dispatch]);

  const [formData, setFormData] = useState<FormState>({
    veh_number: "",
    filled_by: "",
    report_date: "",
    mechanic_notes: "",
    description_of_problem: "",
    completed_date: "",
    mechanic_name: "",
    performed_by_user: signedInUser?._id || "",
  });
  
  useEffect(() => {
    if (vehicleData) {
      setFormData({
        ...vehicleData,
        completed_date: vehicleData.completed_date || "",
        report_date: vehicleData.report_date || "",
      });
      setCompletedDate(vehicleData.completed_date ? new Date(vehicleData.completed_date) : null);
      setSelectedDate(vehicleData.report_date ? new Date(vehicleData.report_date) : null);
    }
  }, [vehicleData]);

  useEffect(() => {
    const fetchVehicleData = async () => {
      if (vehicleData?.id) {
        dispatch(startLoading());
        try {
          const response = await dispatch(getVehicleMainReq(vehicleData.id) as any).unwrap();
          if (response?.success) {
            const fetchedData = response.data;
            setFormData({
              ...fetchedData,
              report_date: fetchedData.report_date || "",
              completed_date: fetchedData.completed_date || "",
            });
            setSelectedDate(fetchedData.report_date ? new Date(fetchedData.report_date) : null);
            setCompletedDate(fetchedData.completed_date ? new Date(fetchedData.completed_date) : null);
          } else {
            toast.error("Failed to load vehicle data.");
          }
        } catch (error: any) {
          toast.error(error.message || "Error fetching vehicle data.");
        } finally {
          dispatch(stopLoading());
        }
      }
    };

    fetchVehicleData();
  }, [vehicleData?.id, dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDateChange = (date: Date | null, field: keyof FormState) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
      if (field === "report_date") setSelectedDate(date);
      if (field === "completed_date") setCompletedDate(date);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.veh_number) newErrors.veh_number = "Vehicle number is required.";
    if (!formData.filled_by) newErrors.filled_by = "Filled by is required.";
    if (!formData.mechanic_notes) newErrors.mechanic_notes = "Mechanic notes are required.";
    if (!formData.description_of_problem) newErrors.description_of_problem = "Description of problem is required.";
    if (!formData.mechanic_name) newErrors.mechanic_name = "Mechanic name is required.";
    if (!selectedDate) newErrors.report_date = "Report date is required.";
    if (!completedDate) newErrors.completed_date = "Completed date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    dispatch(startLoading());
    try {
      const formattedData = {
        veh_number: formData.veh_number,
        filled_by: formData.filled_by,
        mechanic_notes: formData.mechanic_notes,
        description_of_problem: formData.description_of_problem,
        mechanic_name: formData.mechanic_name,
        report_date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
        completed_date: completedDate ? completedDate.toISOString().split('T')[0] : "",
        performed_by_user: formData.performed_by_user,
      };

      let result;
      if (vehicleData && vehicleData?._id) {
        result = await dispatch(updateVehicleMainReq({ id: vehicleData._id, data: formattedData }) as any).unwrap();
      } else {
        result = await dispatch(createVehicleMainReq(formattedData) as any).unwrap();
      }

      if (result?.success) {
        toast.success(vehicleData?._id ? "Form updated successfully!" : "Form created successfully!");
        handleClose();
      } else {
        throw new Error(result?.message || "Failed to submit form.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit form, try again!");
    } finally {
      dispatch(stopLoading());
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

      <Link href="/vehicle-main-req" className='text-primary-2 font-bold text-right'>
        view table
      </Link>

      {/* Scrollable Content */}
      <div className="w-full lg:p-3 sm:p-2 flex-1 overflow-y-auto custom-scroll">
        <form className="w-full" onSubmit={handleSubmit}>
          
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">vehicle number</h2>
            <input 
              type="text" 
              name="veh_number"
              value={formData.veh_number}
              onChange={handleChange}
              placeholder="Enter vehicle number"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.veh_number && <p className="text-red-500 text-sm">{errors.veh_number}</p>}
          </div>

          {/* Model Input */}
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">person filling out this form</h2>
            <input 
              type="text" 
              name="filled_by"
              placeholder="Enter filled by"
              value={formData.filled_by}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.filled_by && <p className="text-red-500 text-sm">{errors.filled_by}</p>}
          </div>


          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">report date</h2>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date, "report_date")}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select report date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
              {errors.report_date && <p className="text-red-500 text-sm">{errors.report_date}</p>}
            </div>

            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">completed date</h2>
              <DatePicker
                selected={completedDate}
                onChange={(date) => handleDateChange(date, "completed_date")}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select completed date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
              {errors.completed_date && <p className="text-red-500 text-sm">{errors.completed_date}</p>}
            </div>
          </div>
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">description of problem</h2>
            <textarea
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              placeholder="Write decription of problem"
              rows={3}
              name='description_of_problem'
              value={formData.description_of_problem}
              onChange={handleChange}
            > 
            </textarea>
          </div>
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">mechanic name</h2>
            <input 
              type="text" 
              name="mechanic_name"
              value={formData.mechanic_name}
              onChange={handleChange}
              placeholder="Enter mechanic name"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.mechanic_name && <p className="text-red-500 text-sm">{errors.mechanic_name}</p>}
          </div>
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">mechanic notes</h2>
            <textarea
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              placeholder="Write mechanic notes"
              rows={3}
              name='mechanic_notes'
              value={formData.mechanic_notes}
              onChange={handleChange}
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

export default VehicleMaintenanceRequestForm;
