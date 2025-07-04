import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import UserForm from "./UserForm";
import { useState } from "react";

const UserFormModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-white hover:bg-slate-50 text-slate-900 font-semibold px-6 py-2.5 flex items-center gap-2 shadow-sm border-0 cursor-pointer">
          Add New User
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 p-0 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">
              Create New User
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 mt-1">
              Fill in the details below to add a new user account to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <div className="p-6">
          <UserForm onClose={() => setIsModalOpen(false)} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserFormModal;
