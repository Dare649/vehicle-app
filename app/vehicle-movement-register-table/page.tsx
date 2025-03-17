"use client";

import CheckTable from "@/components/table/page";
import { useState, useEffect, useMemo } from "react";
import Modal from "@/components/modal/page";
import VehicleMovementRegister from "@/components/vehicle-movement-register/page";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  getAllVehicleMoveReg,
  getVehicleMoveReg,
  deleteVehicleMoveReg,
} from "@/redux/slice/veh-movement-reg/vehMoveReg";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const VehicleMovementRegisterTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const isLoading = useSelector((state: RootState) => state.loading.isLoading);
  const allVehicleMoveRegs = useSelector((state: RootState) =>
    Array.isArray(state.vehMove?.allVehicleMoveRegs) ? state.vehMove.allVehicleMoveRegs : []
  );

  console.log("Vehicle Move Data:", allVehicleMoveRegs); // Debugging log

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
        await dispatch(getAllVehicleMoveReg()).unwrap();
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
      const response = await dispatch(getVehicleMoveReg(row?.id)).unwrap();

      if (response) {
        setSelectedRow(response);
        setOpen(true);
      } else {
        toast.error("No data found for the selected record.");
      }
    } catch (error: any) {
      console.error("API Call Error:", error);
      toast.error(error.message || "Failed to fetch record");
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleDelete = async (row: any) => {
    console.log("Row Data:", row); // Debugging log
    console.log("Row _id:", row?.id); // Debugging log

    if (!row?.id) {
      toast.error("Invalid ID");
      return;
    }

    toast.info(
      <div className="flex flex-col items-center text-center">
        <p className="mb-4">Are you sure you want to delete this record?</p>
        <div className="flex items-center gap-3">
          <button
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={async () => {
              toast.dismiss(`delete-${row?.id}`);
              dispatch(startLoading());
              try {
                await dispatch(deleteVehicleMoveReg(row.id)).unwrap();
                toast.success("Record deleted successfully");

                // ✅ Refetch all records after delete
                await dispatch(getAllVehicleMoveReg());
              } catch (error: any) {
                toast.error(error.message || "Failed to delete record");
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
    dispatch(getAllVehicleMoveReg());
  };

  const columns = useMemo(
    () => [
      { key: "createdAt", label: "Date", render: (value: any) => formatDateTime(value) },
      { key: "veh_number", label: "Vehicle Number" },
      { key: "meter_start", label: "Meter Start" },
      { key: "meter_end", label: "Meter End" },
      { key: "km", label: "Kilometer" },
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
    if (!Array.isArray(allVehicleMoveRegs)) return []; // ✅ Ensure it's an array
    return allVehicleMoveRegs.map((item) => ({
      id: item._id, // Use `_id` since your API response contains `_id`
      createdAt: formatDateTime(item.createdAt),
      veh_number: item.veh_number,
      date_from: item.date_from,
      date_to: item.date_to,
      meter_start: item.meter_start,
      meter_end: item.meter_end,
      km: item.km,
      security_name: item.security_name,
    }));
  }, [allVehicleMoveRegs]);

  return (
    <div className="w-full lg:px-32 sm:px-0">
      <div className="w-full flex items-center justify-between lg:flex-row sm:flex-col gap-y-5">
        <h2 className="text-primary-2 lg:text-xl sm:text-base">Vehicle Movement Register</h2>
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
          <VehicleMovementRegister handleClose={handleClose} vehicleData={selectedRow} />
        </Modal>
      )}
    </div>
  );
};

export default VehicleMovementRegisterTable;
