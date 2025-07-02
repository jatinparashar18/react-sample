import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createUser, clearCreateError } from "@/features/users/userSlice";
import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Plus, X } from "lucide-react";

const UserForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, createError } = useAppSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    dispatch(clearCreateError());
  }, [dispatch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      return;
    }

    await dispatch(createUser(formData)).unwrap();
    setFormData({ name: "", email: "", phone: "", address: "" });
    onClose();
  };

  const handleClose = () => {
    dispatch(clearCreateError());
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700"
            >
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="h-11 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-0 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700"
            >
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="h-11 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-0 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-semibold text-slate-700"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className="h-11 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-0 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-semibold text-slate-700"
            >
              Address
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleInputChange}
              className="h-11 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-0 rounded-lg"
            />
          </div>
        </div>
      </div>

      {createError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium">{createError}</span>
          <button
            onClick={() => dispatch(clearCreateError())}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={loading}
          className="h-11 px-6 bg-white hover:bg-slate-50 text-slate-600 border-slate-200 rounded-lg font-medium"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !formData.name || !formData.email}
          className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg flex items-center gap-2 disabled:bg-slate-400"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Create User
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserForm;
