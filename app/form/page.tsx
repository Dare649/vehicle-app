'use client';

import React, { useState } from "react";
import Card from "@/components/card/page";
import { form } from "@/data/dummy";
import Modal from "@/components/modal/page";
import VehicleMaintenanceLog from "./vehicle-maint-log/page";
import CheckList from "./monthly-vehicle-maintenance-checklist/page";
import VehicleMovementRegistration from "./vehicle-movement-register/page";
import DailyInspection from "./daily-inspection/page";
import VehicleMaintenanceRequestForm from "./vehicle-maintenance-request-form/page";

const Form: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);

  // Function to open the modal with the selected text
  const handleOpen = (text: string) => {
    setSelectedText(text);
    setOpen(true);
  };

  // Function to close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedText(null);
  };

  // Function to render the selected form
  const renderForm = () => {
    switch (selectedText) {
      case "vehicle maintenance log":
        return <VehicleMaintenanceLog handleClose={handleClose}/>;
      case "monthly vehicle maintenance checklist":
        return <CheckList />;
      case "vehicle movement register":
        return <VehicleMovementRegistration handleClose={handleClose}/>;
      case "daily inspection":
        return <DailyInspection />;
      default:
        return <VehicleMaintenanceRequestForm handleClose={handleClose}/>;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {form.map((item) => (
          <div onClick={() => handleOpen(item.text)} key={item.id} className="w-80 h-60 cursor-pointer">
            <Card backgroundImage={item.bg} text={item.text} />
          </div>
        ))}

        {open && (
          <Modal visible={open} onClose={handleClose}>
            {renderForm()}
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Form;
