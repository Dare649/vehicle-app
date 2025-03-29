"use client";

import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/card/page";
import Modal from "@/components/modal/page";
import VehicleMaintenanceLog from "../../components/vehicle-maint-log/page";
import MonthlyVehicleMaintenanceChecklist from "../../components/monthly-vehicle-maintenance-checklist/page";
import VehicleMovementRegistration from "../../components/vehicle-movement-register/page";
import DailyInspection from "../../components/daily-inspection/page";
import VehicleMaintenanceRequestForm from "../../components/vehicle-maintenance-request-form/page";
import EmployeeWeeklyActivityReport from "@/components/emp-weekly-activity-report/page";
import DailySiteReport from "@/components/daily-site-report/page";
import { getSignedInUser } from "@/redux/slice/auth/auth";
import { startLoading, stopLoading } from "@/redux/slice/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import img1 from "@/public/img1.jpg"
import img2 from "@/public/img2.jpg"
import img3 from "@/public/img3.jpg"
import img4 from "@/public/img4.jpg"
import img5 from "@/public/img5.jpg"
import emp from "@/public/emp.jpg"
import site from "@/public/site.jpg"

const Form: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
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

  const handleOpen = (text: string) => {
    setSelectedText(text);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedText(null);
  };

  // Role-based component mapping
  const roleBasedComponents = useMemo(() => {
    if (!signedInUser?.role) return [];

    const roleMapping: Record<string, any[]> = {
      admin: [
        {
          id: "1",
          text: "vehicle maintenance log",
          backgroundImage: img1, // Example dynamic image path
          Component: VehicleMaintenanceLog,
        },
        {
          id: "2",
          text: "monthly vehicle maintenance checklist",
          backgroundImage: img2,
          Component: MonthlyVehicleMaintenanceChecklist,
        },
        {
          id: "3",
          text: "vehicle movement register",
          backgroundImage: img3,
          Component: VehicleMovementRegistration,
        },
        {
          id: "4",
          text: "daily inspection",
          backgroundImage: img4,
          Component: DailyInspection,
        },
        {
          id: "5",
          text: "employee weekly activity report",
          backgroundImage: emp,
          Component: EmployeeWeeklyActivityReport,
        },
        {
          id: "6",
          text: "daily site report",
          backgroundImage: site,
          Component: DailySiteReport,
        },
        {
          id: "7",
          text: "vehicle maintenance request form",
          backgroundImage: img5,
          Component: VehicleMaintenanceRequestForm,
        },
      ],
      driver: [
        {
          id: "1",
          text: "vehicle maintenance log",
          backgroundImage: img1,
          Component: VehicleMaintenanceLog,
        },
        {
          id: "2",
          text: "vehicle maintenance request form",
          backgroundImage: img5,
          Component: VehicleMaintenanceRequestForm,
        },
        {
          id: "3",
          text: "daily inspection",
          backgroundImage: img4,
          Component: DailyInspection,
        },
        {
          id: "4",
          text: "vehicle movement register",
          backgroundImage: img3,
          Component: VehicleMovementRegistration,
        },
        {
          id: "5",
          text: "monthly vehicle maintenance checklist",
          backgroundImage: img2,
          Component: MonthlyVehicleMaintenanceChecklist,
        },
      ],
      employee: [
        {
          id: "1",
          text: "daily site report",
          backgroundImage: site,
          Component: DailySiteReport,
        },
        {
          id: "2",
          text: "employee weekly activity report",
          backgroundImage: emp,
          Component: EmployeeWeeklyActivityReport,
        },
      ],
    };

    return roleMapping[signedInUser.role] || [];
  }, [signedInUser]);

  // Find the selected component
  const SelectedComponent = roleBasedComponents.find(
    (item) => item.text === selectedText
  )?.Component;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roleBasedComponents.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpen(item.text)}
            className="w-80 h-60 cursor-pointer"
          >
            <Card backgroundImage={item.backgroundImage} text={item.text} />
          </div>
        ))}

        {open && SelectedComponent && (
          <Modal visible={open} onClose={handleClose}>
            <SelectedComponent handleClose={handleClose} />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Form;
