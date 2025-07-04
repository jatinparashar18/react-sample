import UsersList from "./components/user/UsersList";
import { Users2 } from "lucide-react";
import UserFormModal from "./components/user/UserFormModal";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-200 overflow-hidden">
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 px-8 py-10 rounded-t-3xl overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white to-slate-100 rounded-2xl flex items-center justify-center shadow-md ring-4 ring-white/10">
                  <Users2 className="w-8 h-8 text-slate-800" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    User Management
                  </h1>
                  <p className="text-slate-300 text-base mt-1">
                    Organize and manage all your users effortlessly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <UserFormModal />
              </div>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-b from-white to-slate-50">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
              <UsersList />
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
