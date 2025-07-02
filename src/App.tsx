import { useState } from "react";
import UsersList from "./components/user/UsersList";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog";
import { Button } from "./components/ui/button";
import { Plus, Users2 } from "lucide-react";
import UserForm from "./components/user/UserForm";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 max-w-7xl mx-auto overflow-hidden">
          <div className="bg-slate-900 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Users2 className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    User Management
                  </h1>
                  <p className="text-slate-300 text-sm mt-1">
                    Manage and organize your user accounts
                  </p>
                </div>
              </div>

              <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <AlertDialogTrigger asChild>
                  <Button className="bg-white hover:bg-slate-50 text-slate-900 font-semibold px-6 py-2.5 flex items-center gap-2 shadow-sm border-0 cursor-pointer">
                    Add New User
                    {/* <Plus className="w-5 h-5" /> */}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 p-0 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-bold text-slate-900">
                        Create New User
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-600 mt-1">
                        Fill in the details below to add a new user account to
                        the system.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                  </div>
                  <div className="p-6">
                    <UserForm onClose={() => setIsModalOpen(false)} />
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="p-8">
            <UsersList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
