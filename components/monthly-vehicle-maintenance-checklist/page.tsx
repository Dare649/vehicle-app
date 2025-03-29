'use client';

import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createMonthlyVehMainChecklist,
  updateMonthlyVehMainChecklist,
  getMonthlyVehMainChecklist
} from '@/redux/slice/monthly-vehicle-maintenance-checklist/monthlyVehMainChecklist'
import { getSignedInUser } from "@/redux/slice/auth/auth";


interface FormState {
  createdAt?: string;
  _id?: string;
  id?: string;
  veh_name: string;
  date: string;
  checked_by: string;
  current_mileage: number;
  date_of_last_oil_change: string;
  performed_by_user: string;
  date_of_last_oil_filter_change: string;
  date_of_last_air_filter_change: string;
  date_of_carbin_filter_change: string;
  date_engine_tune_up: string;
  mileage_of_last_oil_change: number;
  mileage_of_last_air_filter_change: number;
  mileage_of_last_tire_rotation: number;
  checklist_items: ChecklistItem[];
}

interface ChecklistItem {
  item: string;
  status: number;
  remark: string;
}

interface MonthlyVehicleMaintenanceChecklistProps {
  handleClose: () => void;
  activityData?: FormState | null;
}

const MonthlyVehicleMaintenanceChecklist = ({ handleClose, activityData }: MonthlyVehicleMaintenanceChecklistProps) => {
  const [selectedDates, setSelectedDates] = useState<Record<string, Date | null>>({
    date: null,
    date_of_last_oil_change: null,
    date_of_last_air_filter_change: null,
    date_of_carbin_filter_change: null,
    date_of_last_oil_filter_change: null,
    date_engine_tune_up: null,
  });

  const [selectedStatus, setSelectedStatus] = useState<{ [key: number]: "ok" | "not_ok" | null }>({});
  const dispatch = useDispatch<any>();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
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
          veh_name: "",
          date: "",
          checked_by: "",
          current_mileage: 0,
          date_of_last_oil_change: "",
          performed_by_user: signedInUser?._id || "",
          date_of_last_oil_filter_change: "",
          date_of_last_air_filter_change: "",
          date_of_carbin_filter_change: "",
          date_engine_tune_up: "",
          mileage_of_last_oil_change: 0,
          mileage_of_last_air_filter_change: 0,
          mileage_of_last_tire_rotation: 0,
          checklist_items: [],
        });


        useEffect(() => {
          if (activityData) {
            setFormData((prevData) => ({
              ...prevData,
              veh_name: activityData.veh_name || "",
              date: activityData.date || "",
              checked_by: activityData.checked_by || "",
              current_mileage: activityData.current_mileage || 0, // Fix: Ensure numeric value
              mileage_of_last_oil_change: activityData.mileage_of_last_oil_change || 0, // Fix
              mileage_of_last_air_filter_change: activityData.mileage_of_last_air_filter_change || 0, // Fix
              mileage_of_last_tire_rotation: activityData.mileage_of_last_tire_rotation || 0, // Fix
              date_of_last_oil_change: activityData.date_of_last_oil_change || "",
              date_of_last_oil_filter_change: activityData.date_of_last_oil_filter_change || "",
              date_of_last_air_filter_change: activityData.date_of_last_air_filter_change || "",
              date_of_carbin_filter_change: activityData.date_of_carbin_filter_change || "",
              date_engine_tune_up: activityData.date_engine_tune_up || "",
              checklist_items: activityData.checklist_items || [],
            }));
        
            setSelectedDates({
              date: activityData.date ? new Date(activityData.date) : null,
              date_of_last_oil_change: activityData.date_of_last_oil_change ? new Date(activityData.date_of_last_oil_change) : null,
              date_of_last_oil_filter_change: activityData.date_of_last_oil_filter_change ? new Date(activityData.date_of_last_oil_filter_change) : null,
              date_of_last_air_filter_change: activityData.date_of_last_air_filter_change ? new Date(activityData.date_of_last_air_filter_change) : null,
              date_of_carbin_filter_change: activityData.date_of_carbin_filter_change ? new Date(activityData.date_of_carbin_filter_change) : null,
              date_engine_tune_up: activityData.date_engine_tune_up ? new Date(activityData.date_engine_tune_up) : null,
            });
          }
        }, [activityData]);
        
        
        


        useEffect(() => {
  if (activityData?.checklist_items) {
    const statusMap: { [key: number]: "ok" | "not_ok" | null } = {};
    activityData.checklist_items.forEach((item, index) => {
      statusMap[index] = item.status === 1 ? "ok" : item.status === 0 ? "not_ok" : null;
    });
    setSelectedStatus(statusMap);
  }
}, [activityData]);




        useEffect(() => {
          const fetchActivity = async () => {
            if (activityData?.id) {
              dispatch(startLoading());
              try {
                const response = await dispatch(getMonthlyVehMainChecklist(activityData.id) as any).unwrap();
        
                if (response?.success) {
                  const fetchedData = response.data;
        
                  // Update form data with fetched values, providing default values where necessary
                  setFormData({
                    ...fetchedData,
                    date: fetchedData.date || "",
                    date_engine_tune_up: fetchedData.date_engine_tune_up || "",
                    date_of_carbin_filter_change: fetchedData.date_of_carbin_filter_change || "",
                    date_of_last_air_filter_change: fetchedData.date_of_last_air_filter_change || "",
                    date_of_last_oil_change: fetchedData.date_of_last_oil_change || "",
                    date_of_last_oil_filter_change: fetchedData.date_of_last_oil_filter_change || "",
                  });
        
                  setSelectedDates({
                    date_engine_tune_up: fetchedData.date_engine_tune_up ? new Date(fetchedData.date_engine_tune_up) : null,
                    date: fetchedData.date ? new Date(fetchedData.date) : null,
                    date_of_carbin_filter_change: fetchedData.date_of_carbin_filter_change ? new Date(fetchedData.date_of_carbin_filter_change) : null,
                    date_of_last_air_filter_change: fetchedData.date_of_last_air_filter_change ? new Date(fetchedData.date_of_last_air_filter_change) : null,
                    date_of_last_oil_change: fetchedData.date_of_last_oil_change ? new Date(fetchedData.date_of_last_oil_change) : null,
                    date_of_last_oil_filter_change: fetchedData.date_of_last_oil_filter_change ? new Date(fetchedData.date_of_last_oil_filter_change) : null,
                  });
                } else {
                  toast.error("Failed to load activity data.");
                }
              } catch (error: any) {
                toast.error(error.message || "Error fetching activity data.");
              } finally {
                dispatch(stopLoading());
              }
            }
          };
        
          fetchActivity();
        }, [activityData?.id, dispatch]);
        

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const { name, value } = event.target;
          setFormData((prevData) => ({
            ...prevData,
            [name]: ["current_mileage","mileage_of_last_oil_change", "mileage_of_last_air_filter_change", "mileage_of_last_tire_rotation"].includes(name) ? (value === "" ? "" : Number(value)) : value,
          }));
        };

        const handleDateChange = (field: keyof typeof selectedDates, date: Date | null) => {
          setSelectedDates((prevDates) => ({
            ...prevDates,
            [field]: date,
          }));
          setFormData((prevForm) => ({
            ...prevForm,
            [field]: date ? date.toISOString().split('T')[0] : "", // Format date as YYYY-MM-DD
          }));
        };
        
        // Utility to map maintenance fields dynamically
        const renderDateFields = () => {
          return Object.entries(selectedDates).map(([field, date]) => (
            <div key={field} className="mb-4">
              <label htmlFor={field} className="block text-sm font-bold uppercase text-primary-1 mb-2">
                {field.replace(/_/g, " ").toUpperCase()}
              </label>
              <DatePicker
                selected={date}
                onChange={(date) => handleDateChange(field as keyof typeof selectedDates, date)}
                dateFormat="yyyy-MM-dd"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
                placeholderText={`Select ${field.replace(/_/g, " ")}`}
              />
            </div>
          ));
        };

        // Validation for required date fields
const validateForm = () => {
  const newErrors: Record<string, string> = {};
  if (!formData.veh_name) newErrors.veh_name = "Vehicle name is required.";
  if (!selectedDates.date) newErrors.date = "Inspection date is required.";
  if (!formData.checked_by) newErrors.checked_by = "Checked by field is required.";
  if (formData.current_mileage <= 0) newErrors.current_mileage = "Current mileage must be greater than 0.";
  if (formData.checklist_items.length === 0) newErrors.checklist_items = "At least one inspection item is required.";

  // Check for all maintenance date fields
  Object.entries(selectedDates).forEach(([key, value]) => {
    if (!value) {
      newErrors[key] = `${key.replace(/_/g, " ").toUpperCase()} is required.`;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;
      
        dispatch(startLoading());
        try {
        
          const formattedData = {
            date: selectedDates.date ? selectedDates.date.toISOString().split('T')[0] : '',
      date_of_last_oil_change: selectedDates.date_of_last_oil_change
        ? selectedDates.date_of_last_oil_change.toISOString().split('T')[0]
        : '',
      date_of_last_air_filter_change: selectedDates.date_of_last_air_filter_change
        ? selectedDates.date_of_last_air_filter_change.toISOString().split('T')[0]
        : '',
      date_of_carbin_filter_change: selectedDates.date_of_carbin_filter_change
        ? selectedDates.date_of_carbin_filter_change.toISOString().split('T')[0]
        : '',
      date_of_last_oil_filter_change: selectedDates.date_of_last_oil_filter_change
        ? selectedDates.date_of_last_oil_filter_change.toISOString().split('T')[0]
        : '',
      date_engine_tune_up: selectedDates.date_engine_tune_up
        ? selectedDates.date_engine_tune_up.toISOString().split('T')[0]
        : '',

            veh_name: formData.veh_name,

            checked_by: formData.checked_by,

            current_mileage: formData.current_mileage,

            
            checklist_items: formData.checklist_items,

            mileage_of_last_oil_change: formData.mileage_of_last_oil_change,

            mileage_of_last_air_filter_change: formData.mileage_of_last_oil_change,

            mileage_of_last_tire_rotation: formData.mileage_of_last_oil_change,

            performed_by_user: formData.performed_by_user,
          };
      
          let result;
      
          if (activityData && activityData._id) {
            result = await dispatch(
              updateMonthlyVehMainChecklist({ id: activityData._id, data: formattedData }) as any
            ).unwrap();
          } else {
           
            result = await dispatch(createMonthlyVehMainChecklist(formattedData) as any).unwrap();
          }
      
          if (result?.success) {
            toast.success(
              activityData?._id
                ? "Activity updated successfully!"
                : "Activity created successfully!"
            );
            handleClose();
          } else {
            throw new Error(result?.message || "Failed to submit activity");
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to submit activity, try again!");
        } finally {
          dispatch(stopLoading());
        }
      };
          
 
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

      <Link href="/monthly-vehicle-main-checklist" className='text-primary-2 font-bold text-right'>
        view table
      </Link>

      {/* Scrollable Content */}
      <div className="w-full lg:p-3 sm:p-2 flex-1 overflow-y-auto custom-scroll">
        <form onSubmit={handleSubmit} className="w-full">
          
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">vehicle number</h2>
            <input 
              type="text" 
              placeholder="Enter car make"
              name="veh_name"
              value={formData.veh_name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.veh_name && <p className="text-red-500 text-sm">{errors.veh_name}</p>}
          </div>


          <div className="flex-1 w-full mb-3">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">current milage</h2>
              <input 
                type="number" 
                placeholder="Enter current millage"
                name="current_mileage"
                value={formData.current_mileage}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              {errors.current_mileage && <p className="text-red-500 text-sm">{errors.current_mileage}</p>}
            </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">checked by</h2>
            <input 
              type="text" 
              placeholder="Enter checked by"
              name="checked_by"
              value={formData.checked_by}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.checked_by && <p className="text-red-500 text-sm">{errors.checked_by}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 mb-3 w-full">
            {renderDateFields()}
          </div>

          <div className="flex-1 w-full mb-3">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">mileage of last oil change</h2>
              <input 
                type="number" 
                placeholder="Enter current millage"
                name="mileage_of_last_oil_change"
                value={formData.mileage_of_last_oil_change}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              {errors.mileage_of_last_oil_change && <p className="text-red-500 text-sm">{errors.mileage_of_last_oil_change}</p>}
            </div>

          <div className="flex-1 w-full mb-3">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">mileage of last air filter change</h2>
              <input 
                type="number" 
                placeholder="Enter current millage"
                name="mileage_of_last_air_filter_change"
                value={formData.mileage_of_last_air_filter_change}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              {errors.mileage_of_last_air_filter_change && <p className="text-red-500 text-sm">{errors.mileage_of_last_air_filter_change}</p>}
            </div>

          <div className="flex-1 w-full mb-3">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">mileage of last tire rotation</h2>
              <input 
                type="number" 
                placeholder="Enter current millage"
                name="mileage_of_last_tire_rotation"
                value={formData.mileage_of_last_tire_rotation}
                onChange={handleChange}
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              {errors.mileage_of_last_tire_rotation && <p className="text-red-500 text-sm">{errors.mileage_of_last_tire_rotation}</p>}
            </div>

          {/* mileage of section */}
          {/* <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">Mileage of:</h2>  
            <div className="grid grid-cols-1 gap-4 ">
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
          </div> */}

<div className="inspection-items-section w-full">
  <h3 className="text-lg font-semibold mb-2">Inspection Items</h3>
  {inspectionItems.map((item, index) => (
    <div
      key={index}
      className="inspection-item flex flex-col gap-4 mb-4 w-full"
    >
      {/* Display item name */}
      <div className="w-full text-sm">{item}</div>

      {/* Status dropdown */}
      <select
        className="w-full p-2 border rounded"
        value={selectedStatus[index] || ""}
        onChange={(e) =>
          setSelectedStatus((prevStatus) => ({
            ...prevStatus,
            [index]: e.target.value as "ok" | "not_ok" | null,
          }))
        }
      >
        <option value="">Select Status</option>
        <option value={1}>OK</option>
        <option value={0}>Not OK</option>
      </select>

      {/* Remark input */}
      <input
  type="text"
  className="w-full p-2 border rounded"
  placeholder="Add remarks"
  value={
    formData.checklist_items[index]?.remark || ""
  }
  onChange={(e) => {
    setFormData((prev) => {
      const updatedItems = prev.checklist_items.map((item, idx) => {
        if (idx === index) {
          // Return a new object with updated 'remark'
          return { ...item, remark: e.target.value };
        }
        return item; // Return other items unchanged
      });

      // Return updated state
      return { ...prev, checklist_items: updatedItems };
    });
  }}
/>

    </div>
  ))}
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

export default MonthlyVehicleMaintenanceChecklist;
