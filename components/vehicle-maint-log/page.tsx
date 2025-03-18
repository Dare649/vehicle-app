'use client';

import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { createVehicleMainLog, updateVehicleMainLog, getVehicleMainLog} from '@/redux/slice/vehicle-main-log/vehMainLog';
import { getSignedInUser} from '@/redux/slice/auth/auth';

interface VehicleMaintenanceLogProps {
  handleClose: () => void;
  vehicleData?: FormState | null;
}

interface FormState {
  _id?: string;
  make: string;
  model: string;
  year: number;
  veh_id_number: string;
  engine: string;
  date_of_service: string;
  milage_of_service: number;
  performed_by_name: string;
  performed_by_user: string;
  work_performed_by_service_schedule: string;
  cost: number;
  invoice: string;
  notes: string;
}

const VehicleMaintenanceLog = ({ handleClose, vehicleData }: VehicleMaintenanceLogProps) => {
  const [selectedYear, setSelectedYear] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const dispatch = useDispatch<any>();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    veh_id_number: "",
    engine: "",
    date_of_service: new Date().toISOString().split("T")[0],
    milage_of_service: 0,
    performed_by_name: "",
    performed_by_user: userId || "",  // Ensure `performed_by_user` gets user ID
    work_performed_by_service_schedule: "",
    cost: 0,
    invoice: "",
    notes: "",
  });

  useEffect(() => {
    if (vehicleData) {
      setFormData({
        make: vehicleData.make || "",
        model: vehicleData.model || "",
        year: vehicleData.year || new Date().getFullYear(),
        veh_id_number: vehicleData.veh_id_number || "",
        engine: vehicleData.engine || "",
        date_of_service: vehicleData.date_of_service || new Date().toISOString().split("T")[0],
        milage_of_service: vehicleData.milage_of_service || 0,
        performed_by_name: vehicleData.performed_by_name || "",
        performed_by_user: userId || "", // Override with logged-in user ID
        work_performed_by_service_schedule: vehicleData.work_performed_by_service_schedule || "",
        cost: vehicleData.cost || 0,
        invoice: vehicleData.invoice || "",
        notes: vehicleData.notes || "",
      });

      if (vehicleData.year) setSelectedYear(new Date(vehicleData.year, 0, 1));
      if (vehicleData.date_of_service) setSelectedDate(new Date(vehicleData.date_of_service));
    }
  }, [vehicleData, userId]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(startLoading());
        const user = await dispatch(getSignedInUser()).unwrap();
        setUserId(user?._id || null); // Store the user ID in state
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch user data");
      } finally {
        dispatch(stopLoading());
      }
    };
  
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!vehicleData?._id || !userId) return; // Prevent running if values are missing

      dispatch(startLoading());
      try {
        const response = await dispatch(getVehicleMainLog(vehicleData._id) as any).unwrap();

        if (response?.success) {
          const fetchedData = response.data;
          setFormData({
            ...fetchedData,
            performed_by_user: userId,
          });

          setSelectedYear(fetchedData.year ? new Date(fetchedData.year, 0, 1) : null);
          setSelectedDate(fetchedData.date_of_service ? new Date(fetchedData.date_of_service) : null);
        } else {
          null;
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Error fetching vehicle data.");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchVehicleData();
  }, [vehicleData?._id, userId, dispatch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: ["milage_of_service", "cost"].includes(name) ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.make) newErrors.make = "Vehicle make is required";
    if (!formData.model) newErrors.model = "Vehicle model is required";
    if (!formData.year) newErrors.year = "Vehicle year is required";
    if (!formData.veh_id_number) newErrors.veh_id_number = "Vehicle number is required";
    if (!formData.engine) newErrors.engine = "Vehicle engine is required";
    if (!formData.date_of_service) newErrors.date_of_service = "Service date is required";
    if (!formData.milage_of_service) newErrors.milage_of_service = "Milage of service is required";
    if (!formData.performed_by_name) newErrors.performed_by_name = "Performer name is required";
    if (!formData.work_performed_by_service_schedule) newErrors.work_performed_by_service_schedule = "Service schedule is required";
    if (!formData.cost) newErrors.cost = "Cost is required";
    if (!formData.invoice) newErrors.invoice = "Invoice is required";
    if (!formData.notes) newErrors.notes = "Notes are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    dispatch(startLoading());
    try {
      const formattedData = {
        ...formData,
        performed_by_user: userId || formData.performed_by_user, // Ensure it carries user ID
        year: selectedYear ? selectedYear.getFullYear() : formData.year,
        date_of_service: selectedDate ? selectedDate.toISOString().split("T")[0] : formData.date_of_service,
      };

      let result;
      if (vehicleData?._id ) {
        console.log()
        result = await dispatch(updateVehicleMainLog({ id: vehicleData._id, data: formattedData }) as any).unwrap();
      } else {
        result = await dispatch(createVehicleMainLog(formattedData) as any).unwrap();
      }

      if (result?.success) {
        toast.success(vehicleData?._id ? "Form updated successfully!" : "Form created successfully!");
        handleClose();
      } else {
        throw new Error(result?.message || "Failed to submit form");
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
        <h2 className="font-bold lg:text-xl sm:text-lg capitalize">{vehicleData ? "Edit Vehicle maintenance form" : "Create Vehicle maintenance form"}</h2>
        <div onClick={handleClose}>
          <IoMdClose size={30} className="text-red-500 cursor-pointer" />
        </div>
      </div>

      {/* Separator */}
      <div className="pt-3 pb-2">
        <hr className="w-full border-none h-0.5 bg-gray-300" />
      </div>


      <Link href="/vehicle-main-log-table" className='text-primary-2 font-bold text-right'>
        view table
      </Link>
      {/* Scrollable Content */}
      <div className="w-full lg:p-3 sm:p-2 flex-1 overflow-y-auto custom-scroll">
        <form onSubmit={handleSubmit} className="w-full">
          <h2 className="font-bold text-gray-400 uppercase">Vehicle Details</h2>
          <div className="py-2">
            <hr className="w-full border-none h-0.5 bg-gray-300" />
          </div>

          {/* Make Input */}
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Make</h2>
            <input 
              type="text"
              name='make' 
              placeholder="Enter car make"
              value={formData.make}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.make && <p className="text-red-500 text-sm">{errors.make}</p>}
          </div>

          {/* Model Input */}
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Model</h2>
            <input 
              type="text" 
              name='model' 
              placeholder="Enter car model"
              value={formData.model}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
          </div>

          {/* Year & Vehicle Number */}
          <div className="flex items-start gap-x-3 mb-3">
            {/* Year Picker */}
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Year</h2>
              <DatePicker
                selected={selectedYear}
                onChange={(date: Date | null) => {
                  setSelectedYear(date);
                  setFormData((prev) => ({ ...prev, year: date ? date.getFullYear() : prev.year }));
                }}
                showYearPicker
                dateFormat="yyyy"
                placeholderText="Select car year"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
                maxDate={new Date()}
              />
              {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
            </div>

            {/* Vehicle Number Input */}
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Vehicle Number</h2>
              <input 
                type="text" 
                name='veh_id_number' 
                placeholder="Enter car vehicle number"
                value={formData.veh_id_number}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              />
              {errors.veh_id_number && <p className="text-red-500 text-sm">{errors.veh_id_number}</p>}
            </div>
          </div>

          {/* Engine Input */}
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Engine</h2>
            <input 
              type="text" 
              name='engine' 
              placeholder="Enter car engine"
              value={formData.engine}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.engine && <p className="text-red-500 text-sm">{errors.engine}</p>}
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
                onChange={(date: Date | null) => {
                  setSelectedDate(date);
                  setFormData((prev) => ({ ...prev, date_of_service: date ? date.toISOString().split("T")[0] : prev.date_of_service }));
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select service date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
              {errors.date_of_service && <p className="text-red-500 text-sm">{errors.date_of_service}</p>}
          </div>

          {/* Mileage of Service */}
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Mileage of Service</h2>
            <input 
              type="number" 
              name='milage_of_service' 
              placeholder="Enter mileage of services"
              value={formData.milage_of_service}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {errors.milage_of_service && <p className="text-red-500 text-sm">{errors.milage_of_service}</p>}
          </div>

          {/* Work Performed */}
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Work Performed and Service Schedule</h2>
            <input 
              type="text" 
              name='work_performed_by_service_schedule'
              placeholder="Enter work performed and service schedule"
              value={formData.work_performed_by_service_schedule}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.work_performed_by_service_schedule && <p className="text-red-500 text-sm">{errors.work_performed_by_service_schedule}</p>}
          </div>  
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Performed by</h2>
            <input 
              type="text" 
              name='performed_by_name'
              placeholder="Performed by"
              value={formData.performed_by_name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.performed_by_name && <p className="text-red-500 text-sm">{errors.performed_by_name}</p>}
          </div>  
          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">cost</h2>
              <input 
                type="number" 
                name='cost'
                placeholder="Enter service cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              {errors.cost && <p className="text-red-500 text-sm">{errors.cost}</p>}
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">invoice/receipt</h2>
              <input 
                type="text" 
                name='invoice'
                placeholder="Enter invoice/receipt"
                value={formData.invoice}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              />
              {errors.ivoice && <p className="text-red-500 text-sm">{errors.ivoice}</p>}
            </div>
          </div>
          <div className="mb-5 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Notes</h2>
            <textarea
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
              placeholder="Write service note"
              name="notes" // ✅ Ensure this is set
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
            {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
          </div>

          <button
            type='submit'
            className='rounded-lg bg-primary-2 w-full text-white hover:text-primary-2 hover:bg-transparent hover:border-2 hover:border-primary-2 outline-none py-3 cursor-pointer capitalize'
          >
            submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default VehicleMaintenanceLog;
