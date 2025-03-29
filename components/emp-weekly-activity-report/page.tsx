'use client';

import React, { useEffect, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosAdd,  IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import Select from "react-select";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { startLoading, stopLoading } from '@/redux/slice/loadingSlice';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createEmployeeActivityReport,
  updateEmployeeActivityReport,
  getEmployeeActivityReport
} from '@/redux/slice/employee-activities-report/empActivityReport'
import { getSignedInUser } from "@/redux/slice/auth/auth";



interface EmployeeWeeklyActivityReportProps {
  handleClose: () => void;
  activityData?: FormState | null;
}

interface OptionType {
    value: string;
    label: string;
}


interface ApprovedBy {
  approval_name: string;
  designation: string;
}

interface TaskItem {
  description: string;
  responsibility_delegate: string;
  status: string;
  challenges: string;
  recovery_plan: string;
  comment_remark: string;
  approved_by: ApprovedBy[];
}


interface FormState {
  id?: string;
  _id?: string;
  employee_name: string;
  performed_by_user: string;
  department: string;
  designation: string;
  supervisor: string;
  date_of_reporting: string;
  week: string;
  task_items: TaskItem[]; // Change from [] to TaskItem[]
}


const EmployeeWeeklyActivityReport = ({ handleClose, activityData }: EmployeeWeeklyActivityReportProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [dates, setDates] = useState<{ [key: string]: Date | null }>({});
  const [challenges, setChallenges] = useState<string[]>([""]);
  const [recoveryPlans, setRecoveryPlans] = useState<string[]>([""]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
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
    employee_name: "",
    department: "",
    designation: "",
    supervisor: "",
    date_of_reporting: "",
    week: "",
    task_items: [],
    performed_by_user: signedInUser?._id || ""
  })


  useEffect(() => {
    if (activityData) {
      setFormData({
        ...activityData,
        week: activityData.week || "",
        date_of_reporting: activityData.date_of_reporting || "",
      });

      setSelectedDate(activityData.date_of_reporting ? new Date(activityData.date_of_reporting) : null);
      setSelectedWeek(activityData.week ? new Date(activityData.week) : null);
      
    }
  }, [activityData]);


  useEffect(() => {
    const fetchActivity = async () => {
      if (activityData?.id) {
        dispatch(startLoading());
        try {
          const response = await dispatch(getEmployeeActivityReport(activityData.id) as any).unwrap();

          if (response?.success) {
            const fetchedData = response.data;

            setFormData({
              ...fetchedData,
              date_of_reporting: fetchedData.date_of_reporting || "",
              week: fetchedData.week || "",
            });

            setSelectedDate(fetchedData.date_of_reporting ? new Date(fetchedData.date_of_reporting) : null);
            setSelectedWeek(fetchedData.week ? new Date(fetchedData.week) : null);
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


  const getWeek = (date: Date): number => {
    const oneJan = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - oneJan.getTime();
    return Math.ceil((diff / (1000 * 60 * 60 * 24) + oneJan.getDay() + 1) / 7);
  };



  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  

  const handleDateChange = (date: Date | null, field: keyof FormState) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData((prevData) => ({
        ...prevData,
        [field]: formattedDate,
      }));

      if (field === "week") setSelectedWeek(date);
      if (field === "date_of_reporting") setSelectedDate(date);
    }
  };


  const validateForm = () => {
    let newErrors: Record<string, string> = {};
    if (!formData.employee_name) newErrors.employee_name = "Employee name is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.designation) newErrors.designation = "Designation is required";
    if (!formData.supervisor) newErrors.supervisor = "Supervisor name is required";
    if (formData.task_items.length === 0) newErrors.task_items = "At least one task is required"; // Update check
    if (!selectedDate) newErrors.date_of_reporting = "Date of reporting is required";
    if (!selectedWeek) newErrors.week = "Week of reporting is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};



  const inspectionOptions: OptionType[] = [
    { value: "", label: "Select activity status" },
    { value: "ongoing", label: "Ongoing" },
    { value: "suspended", label: "Suspended" },
    { value: "completed", label: "Completed" },
  ];


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
  
    dispatch(startLoading());
    try {
    
      const formattedData = {
        week: selectedWeek ? getWeek(selectedWeek).toString() : "",
        date_of_reporting: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
        employee_name: formData.employee_name,
        department: formData.department,
        designation: formData.designation,
        supervisor: formData.supervisor,
        task_items: formData.task_items,
        performed_by_user: formData.performed_by_user,
      };
  
      let result;
  
      if (activityData && activityData._id) {
        result = await dispatch(
          updateEmployeeActivityReport({ id: activityData._id, data: formattedData }) as any
        ).unwrap();
      } else {
       
        result = await dispatch(createEmployeeActivityReport(formattedData) as any).unwrap();
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

      <Link href="/employee-activity-report" className='text-primary-2 font-bold text-right'>
        view table
      </Link>

      {/* Scrollable Content */}
      <div className="w-full lg:p-3 sm:p-2 flex-1 overflow-y-auto custom-scroll">
        <form onSubmit={handleSubmit} className="w-full">
            <h2 className="font-bold text-gray-400 uppercase">employee details</h2>
            <div className="py-2">
                <hr className="w-full border-none h-0.5 bg-gray-300" />
            </div>
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">employee name</h2>
            <input 
              type="text" 
              placeholder="Enter employee name"
              name="employee_name"
              value={formData.employee_name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.employee_name && <p className="text-red-500 text-sm">{errors.employee_name}</p>}
          </div>
          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">designated department</h2>
            <input 
              type="text" 
              placeholder="Enter department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
          </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">designation</h2>
            <input 
              type="text" 
              placeholder="Enter designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
          </div>

          <div className="mb-3 w-full">
            <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">supervisor</h2>
            <input 
              type="text" 
              placeholder="Enter supervisor"
              name="supervisor"
              value={formData.supervisor}
              onChange={handleChange}
              className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2"
            />
            {errors.supervisor && <p className="text-red-500 text-sm">{errors.supervisor}</p>}
          </div>
          <div className="flex-1 w-full mb-3">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">date of reporting</h2>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date, "date_of_reporting")}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select date"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
              />
            </div>

            <div className="flex-1 w-full mb-3">
              <h2 className="text-sm font-bold uppercase text-primary-1 mb-2">week</h2>
              <DatePicker
                selected={selectedWeek}
                onChange={(date) => handleDateChange(date, "week")}
                dateFormat="MM-yyyy" // Format to show only month and year
                showMonthYearPicker // Enables only month & year selection
                placeholderText="Select week"
                className="w-full bg-transparent outline-none border-2 border-gray-300 focus:border-primary-1 rounded-lg p-2 cursor-pointer"
            />
            </div>

          {/* Task Section */}
<h2 className="font-bold text-gray-400 uppercase mt-4">Task Details</h2>
<div className="py-2">
  <hr className="w-full border-none h-0.5" />
</div>

<div>
  {formData.task_items.map((task, index) => (
    <div
      key={index}
      className="w-full border rounded-lg mb-4 p-4 bg-gray-100"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg">Task {index + 1}</h3>
        <button
          type="button"
          onClick={() =>
            setFormData((prevData) => ({
              ...prevData,
              task_items: prevData.task_items.filter((_, i) => i !== index),
            }))
          }
          className="text-red-500"
        >
          <AiFillDelete size={24} />
        </button>
      </div>
      <div className="w-full gap-4">
        {/* Description */}
        <div>
          <label className="block text-md my-3 font-bold text-primary-1">
            Description
          </label>
          <input
            type="text"
            name={`description_${index}`}
            value={task.description}
            onChange={(e) => {
              const updatedTasks = [...formData.task_items];
              updatedTasks[index].description = e.target.value;
              setFormData({ ...formData, task_items: updatedTasks });
            }}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        {/* Responsibility Delegate */}
        <div>
          <label className="block text-md my-3 font-bold text-primary-1">
            Responsibility Delegate
          </label>
          <input
            type="text"
            name={`responsibility_delegate_${index}`}
            value={task.responsibility_delegate}
            onChange={(e) => {
              const updatedTasks = [...formData.task_items];
              updatedTasks[index].responsibility_delegate = e.target.value;
              setFormData({ ...formData, task_items: updatedTasks });
            }}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-md my-3 font-bold text-primary-1">
            Status
          </label>
          <Select
            options={inspectionOptions}
            value={inspectionOptions.find(
              (opt) => opt.value === task.status
            )}
            onChange={(selected) => {
              const updatedTasks = [...formData.task_items];
              updatedTasks[index].status = selected?.value || "";
              setFormData({ ...formData, task_items: updatedTasks });
            }}
            className="mt-1"
          />
        </div>

        {/* Challenges */}
        <div>
          <label className="block text-md my-3 font-bold text-primary-1">
            Challenges
          </label>
          <textarea
            name={`challenges_${index}`}
            value={task.challenges}
            onChange={(e) => {
              const updatedTasks = [...formData.task_items];
              updatedTasks[index].challenges = e.target.value;
              setFormData({ ...formData, task_items: updatedTasks });
            }}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        {/* Recovery Plan */}
        <div>
          <label className="block text-md my-3 font-bold text-primary-1">
            Recovery Plan
          </label>
          <textarea
            name={`recovery_plan_${index}`}
            value={task.recovery_plan}
            onChange={(e) => {
              const updatedTasks = [...formData.task_items];
              updatedTasks[index].recovery_plan = e.target.value;
              setFormData({ ...formData, task_items: updatedTasks });
            }}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>

        {/* Comment/Remark */}
        <div>
          <label className="block text-md my-3 font-bold text-primary-1">
            Comment/Remark
          </label>
          <textarea
            name={`comment_remark_${index}`}
            value={task.comment_remark}
            onChange={(e) => {
              const updatedTasks = [...formData.task_items];
              updatedTasks[index].comment_remark = e.target.value;
              setFormData({ ...formData, task_items: updatedTasks });
            }}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
          />
        </div>
      </div>
    </div>
  ))}

  {/* Add Task Button */}
  <button
    type="button"
    onClick={() =>
      setFormData((prevData) => ({
        ...prevData,
        task_items: [
          ...prevData.task_items,
          {
            description: "",
            responsibility_delegate: "",
            status: "",
            challenges: "",
            recovery_plan: "",
            comment_remark: "",
            approved_by: [],
          },
        ],
      }))
    }
    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
  >
    <IoIosAdd size={20} className="mr-2" />
    Add Task
  </button>
</div>



<button type="submit" className="rounded-lg bg-primary-2 text-white w-full p-2 mt-4">
            {activityData ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmployeeWeeklyActivityReport;
