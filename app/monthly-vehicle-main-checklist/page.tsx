"use client";

import CheckTable from "@/components/table/page";
import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/modal/page";
import MonthlyVehicleMaintenanceChecklist from "@/components/monthly-vehicle-maintenance-checklist/page";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  getAllMonthlyVehMainChecklist,
  getMonthlyVehMainChecklist,
  deleteMonthlyVehMainChecklist,
} from "@/redux/slice/monthly-vehicle-maintenance-checklist/monthlyVehMainChecklist";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const MonthlyVehicleMaintenanceChecklistTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const allMonthlyVehMainChecklist = useSelector((state: RootState) =>
    Array.isArray(state.monthlyVehMainChecklist?.allMonthlyVehMainChecklist) ? state.monthlyVehMainChecklist.allMonthlyVehMainChecklist : []
  );

  
  const formatDateTime = (isoString: string | null | undefined): string => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(startLoading());
        await dispatch(getAllMonthlyVehMainChecklist()).unwrap();
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch data");
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchData();
  }, [dispatch]);

  const handleUpdate = async (row: any) => {
    if (!row || !row?.id) {
      toast.error("Invalid vehicle record ID");
      return;
    }

    try {
      dispatch(startLoading());
      const response = await dispatch(getMonthlyVehMainChecklist(row?.id)).unwrap();

      if (response) {
        setSelectedRow(response);
        setOpen(true);
      } else {
        toast.error("No data found for the selected record.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch record");
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleDelete = async (row: any) => {

    if (!row?.id) {
      toast.error("Invalid ID");
      return;
    }

    toast.info(
      <div className="flex flex-col items-center text-center">
        <p className="mb-4">Are you sure you want to delete this report?</p>
        <div className="flex items-center gap-3">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={async () => {
              toast.dismiss(`delete-${row?.id}`);
              dispatch(startLoading());
              try {
                await dispatch(deleteMonthlyVehMainChecklist(row.id)).unwrap();
                toast.success("report deleted successfully");

                // ✅ Refetch all records after delete
                await dispatch(getAllMonthlyVehMainChecklist());
              } catch (error: any) {
                toast.error(error.message || "Failed to delete report");
              } finally {
                dispatch(stopLoading());
              }
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => toast.dismiss(`delete-${row?.id}`)}
          >
            No
          </button>
        </div>
      </div>,
      { toastId: `delete-${row?.id}` }
    );
  };

  const handleClose = async () => {
    setOpen(false);
    setSelectedRow(null);

    // ✅ Ensure table reloads after updating
    dispatch(getAllMonthlyVehMainChecklist());
  };

  const columns = useMemo(
    () => [
      { key: "createdAt", label: "Date", render: (value: any) => formatDateTime(value) },
      { key: "veh_name", label: "Vehicle Name" },
      { key: "date", label: "Date" },
      { key: "checked_by", label: "Checked by" },
      { key: "current_mileage", label: "Current mileage" },
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        label: "Update",
        onClick: (row: any) => handleUpdate(row),
        className: "text-primary-1 cursor-pointer",
      },
      {
        label: "Delete",
        onClick: (row: any) => handleDelete(row),
        className: "text-red-500 cursor-pointer",
      },
    ],
    []
  );

  const formattedData = useMemo(() => {
    if (!Array.isArray(allMonthlyVehMainChecklist)) return [];
    return allMonthlyVehMainChecklist.map((item) => ({
      id: item._id, // Ensure this field is unique
      createdAt: item.createdAt,
      veh_name: item.veh_name,
      date: item.date,
      checked_by: item.checked_by,
      current_mileage: item.current_mileage,
    }));
  }, [allMonthlyVehMainChecklist]);

  return (
    <div className="w-full lg:px-32 sm:px-0">
      <div className="w-full flex items-center justify-between lg:flex-row sm:flex-col gap-y-5">
        <h2 className="text-primary-2 lg:text-xl sm:text-base capitalize">monthly vehicle maintenance checklist</h2>
        <Link href={"/form"} className="text-primary-1 font-bold gap-x-1 flex items-center">
          <FaArrowLeft />
          <span>Back</span>
        </Link>
      </div>
      <div >
        <CheckTable columns={columns} data={formattedData} actions={actions} itemsPerPage={10} />
      </div>
      {open && (
        <Modal visible={open} onClose={handleClose}>
          <MonthlyVehicleMaintenanceChecklist handleClose={handleClose} activityData={selectedRow} />
        </Modal>
      )}
    </div>
  );
};

export default MonthlyVehicleMaintenanceChecklistTable;
