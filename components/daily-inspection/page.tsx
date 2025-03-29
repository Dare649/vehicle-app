"use client";

import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { frontRare, generalDetails, driverArea } from "@/data/dummy";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createDailyInspectionReport,
  updateDailyInspectionReport,
  getDailyInspectionReport
} from "@/redux/slice/daily-inspection-report/dailyInspectionReport";
import { getSignedInUser } from "@/redux/slice/auth/auth";

interface DailyInspectionProps {
  handleClose: () => void;
  inspectionData?: FormState | null;
}


interface InspectionItem {
  item: string;
  status: number;
}

interface FormState {
  id?: string;
  _id?: string;
  date: string; 
  driver_name: string; 
  total_mileage: number; 
  general_items: InspectionItem[]; 
  performed_by_user: string;
  driver_area_items: InspectionItem[]; 
  front_rare_items: InspectionItem[]; 
}

const DailyInspection = ({ handleClose, inspectionData }: DailyInspectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [signedDate, setSignedDate] = useState<Date | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const dispatch = useDispatch<any>();
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const signedInUser = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(startLoading());
        await dispatch(getSignedInUser()).unwrap();
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch signed-in user");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchUser();
  }, [dispatch]);

  const [formData, setFormData] = useState<FormState>({
    date: "", 
    driver_name: "", 
    total_mileage: 0, 
    general_items: [], 
    driver_area_items: [], 
    front_rare_items: [], 
    performed_by_user: signedInUser?._id || ""
  });


  useEffect(() => {
    if (inspectionData) {
      setFormData({
        ...inspectionData,
        date: inspectionData.date || "",
      });

      setSelectedDate(inspectionData.date ? new Date(inspectionData.date) : null);
      
    }
  }, [inspectionData]);


  useEffect(() => {
      const fetchInspection = async () => {
        if (inspectionData?.id) {
          dispatch(startLoading());
          try {
            const response = await dispatch(getDailyInspectionReport(inspectionData.id) as any).unwrap();
  
            if (response?.success) {
              const fetchedData = response.data;
  
              setFormData({
                ...fetchedData,
                date: fetchedData.date || "",
              });
  
              setSelectedDate(fetchedData.date ? new Date(fetchedData.date) : null);
             
            } else {
               toast.error("Failed to load inspection data.");
            }
          } catch (error: any) {
            toast.error(error.message || "Error fetching inspection data.");
          } finally {
              dispatch(stopLoading());
            }
        }
      };
  
      fetchInspection();
    }, [inspectionData?.id, dispatch]);
  
     const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         const { name, value } = event.target;
         setFormData((prevData) => ({
           ...prevData,
           [name]: ["total_mileage"].includes(name) ? (value === "" ? "" : Number(value)) : value,
         }));
       };
      

      const handleDateChange = (date: Date | null, field: keyof FormState) => {
        if (date) {
          const formattedDate = date.toISOString().split('T')[0];
          setFormData((prevData) => ({
            ...prevData,
            [field]: formattedDate,
          }));
    
          if (field === "date") setSelectedDate(date);
        }
      };


      const handleGeneralItemChange = (index: number, value: string | number) => {
        setFormData((prevData) => {
          const updatedGeneralItems = prevData.general_items.map((item, i) =>
            i === index ? { ...item, status: typeof value === "string" ? parseInt(value, 10) : value } : item
          );
      
          if (!updatedGeneralItems[index]) {
            updatedGeneralItems[index] = { item: generalDetails[index], status: 0 };
          }
      
          return {
            ...prevData,
            general_items: updatedGeneralItems,
          };
        });
      };
      
      
      const handleFrontRareChange = (index: number, value: string | number) => {
        setFormData((prevData) => {
          const updatedFrontRareItems = prevData.front_rare_items.map((item, i) =>
            i === index ? { ...item, status: typeof value === "string" ? parseInt(value, 10) : value } : item
          );
      
          if (!updatedFrontRareItems[index]) {
            updatedFrontRareItems[index] = { item: frontRare[index], status: 0 };
          }
      
          return {
            ...prevData,
            front_rare_items: updatedFrontRareItems,
          };
        });
      };
      
      
      const handleDriverAreaChange = (index: number, value: string | number) => {
        setFormData((prevData) => {
          const updatedDriverAreaItems = prevData.driver_area_items.map((item, i) =>
            i === index ? { ...item, status: typeof value === "string" ? parseInt(value, 10) : value } : item
          );
      
          if (!updatedDriverAreaItems[index]) {
            updatedDriverAreaItems[index] = { item: driverArea[index], status: 0 };
          }
      
          return {
            ...prevData,
            driver_area_items: updatedDriverAreaItems,
          };
        });
      };
      
      
      


      const validateForm = () => {
        let newErrors: Record<string, string> = {};
        if (!formData.driver_name) newErrors.driver_name = "Driver name is required";
        if (!formData.total_mileage) newErrors.total_mileage = "Department is required";
        if (formData.general_items.some(item => item.status === undefined)) {
          newErrors.general_items = "All general items must have a status.";
        }
        if (formData.driver_area_items.some(item => item.status === undefined)) {
          newErrors.driver_area_items = "All driver area items must have a status.";
        }
        if (formData.front_rare_items.some(item => item.status === undefined)) {
          newErrors.front_rare_items = "All front/rare items must have a status.";
        }
        
        if (!selectedDate) newErrors.date = "date of reporting is required";
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
  const inspectionOptions = [
    { value: "", label: "Select inspection code" },
    { value: 0, label: "X" },
    { value: 1, label: "O" },
  ];

   const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!validateForm()) return;
    
      dispatch(startLoading());
      try {
        // Debug statements to verify data
        console.log("inspectionData:", inspectionData);
        console.log("inspectionData._id:", inspectionData?._id);
    
        const formattedData = {
          date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
          driver_name: formData.driver_name,
          total_mileage: formData.total_mileage,
          general_items: formData.general_items,
          driver_area_items: formData.driver_area_items,
          front_rare_items: formData.front_rare_items,
          performed_by_user: formData.performed_by_user,
        };
    
        let result;
    
        if (inspectionData && inspectionData._id) {
          // Update existing activity
          console.log("Updating activity with ID:", inspectionData._id);
          result = await dispatch(
            updateDailyInspectionReport({ id: inspectionData._id, data: formattedData }) as any
          ).unwrap();
        } else {
          // Create new activity
          console.log("Creating new activity");
          result = await dispatch(createDailyInspectionReport(formattedData) as any).unwrap();
        }
    
        if (result?.success) {
          toast.success(
            inspectionData?._id
              ? "Inspection report updated successfully!"
              : "Inspection report created successfully!"
          );
          handleClose();
        } else {
          throw new Error(result?.message || "Failed to submit inspection report");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to submit inspection report, try again!");
      } finally {
        dispatch(stopLoading());
      }
    };

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

      <Link href="/daily-inspection-table" className='text-primary-2 font-bold text-right'>
        view table
      </Link>

      {/* Scrollable Content */}
      <div className="w-full lg:p-3 sm:p-2 flex-1 overflow-y-auto custom-scroll">
        <form onSubmit={handleSubmit} className="w-full">
          {/* Driver Name Input */}
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">
              Driver Name
            </h2>
            <input
              type="text"
              name="driver_name"
              value={formData.driver_name}
              onChange={handleChange}
              placeholder="Enter driver name"
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.driver_name && <p className="text-red-500 text-sm">{errors.driver_name}</p>}
          </div>

          {/* Date & Mileage */}
          <div className="flex items-start gap-x-3 mb-3">
            <div className="flex-1 w-full">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">
                Date
              </h2>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date, "date")}
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
                name="total_mileage"
                value={formData.total_mileage}
                onChange={handleChange}
                placeholder="Enter total mileage"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              {errors.total_mileage && <p className="text-red-500 text-sm">{errors.total_mileage}</p>}
            </div>
          </div>

          {/* Inspection Instructions */}
          <div className="mb-3 w-full">
            <p className="text-xs font-bold text-gray-500">
              For each trip, enter the appropriate inspection code in the
              designated column: ✔ O – Item passed inspection ❌ X – Item is
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

           {/* Vehicle General Details */}
<div className="w-full">
  {/* <h2 className="font-bold text-gray-400 uppercase">
    Vehicle General Details
  </h2> */}
  {/* <div className="py-2">
    <hr className="w-full border-none h-0.5 bg-gray-300" />
  </div> */}
  <div className="w-full">
    {generalDetails.map((item, id) => (
      <div key={id} className="w-full mb-2">
        <h2 className="font-bold uppercase text-primary-1 text-xs mb-2">
          {item}
        </h2>
        <div className="relative rounded-lg">
        <Select
            options={inspectionOptions}
            value={
              formData.general_items[id]?.status !== undefined
                ? inspectionOptions.find(
                    (option) => option.value === formData.general_items[id].status
                  )
                : null
            }
            onChange={(selectedOption) =>
              handleGeneralItemChange(id, selectedOption?.value ?? 0)
            }
            className="w-full"
          />
        </div>
      </div>
    ))}
  </div>
</div>
          </div>

         {/* Front & Rear Items */}
<div className="w-full mt-6">
  <h2 className="font-bold text-gray-400 uppercase">
    Front & Rear Inspection
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
            value={
              formData.front_rare_items[id]?.status !== undefined
                ? inspectionOptions.find(
                    (option) => option.value === formData.front_rare_items[id].status
                  )
                : null
            }
            onChange={(selectedOption) =>
              handleFrontRareChange(id, selectedOption?.value ?? 0)
            }
            className="w-full"
          />
        </div>
      </div>
    ))}
  </div>
</div>

         {/* Driver Area Items */}
<div className="w-full mt-6">
  <h2 className="font-bold text-gray-400 uppercase">
    Driver Area Inspection
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
            value={
              formData.driver_area_items[id]?.status !== undefined
                ? inspectionOptions.find(
                    (option) => option.value === formData.driver_area_items[id].status
                  )
                : null
            }
            onChange={(selectedOption) =>
              handleDriverAreaChange(id, selectedOption?.value ?? 0)
            }
            className="w-full"
          />
        </div>
      </div>
    ))}
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
