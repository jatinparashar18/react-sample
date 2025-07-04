import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  createUser,
  updateUser,
  clearCreateError,
  clearUpdateError,
} from "@/features/users/userSlice";
import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Loader2,
  Plus,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

interface UserFormProps {
  onClose: () => void;
  user?: any;
}

const UserForm: React.FC<UserFormProps> = ({ onClose, user }) => {
  const dispatch = useAppDispatch();
  const { loading, createError, updateError } = useAppSelector(
    (state) => state.user
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    dispatch(clearCreateError());
    dispatch(clearUpdateError());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (
      formData.phone.trim() &&
      !/^[\d\s\-\+\(\)]+$/.test(formData.phone.trim())
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      if (isEditing) {
        await dispatch(
          updateUser({ id: user.id, userData: formData })
        ).unwrap();
        toast.success("User updated successfully!");
      } else {
        await dispatch(createUser(formData)).unwrap();
        toast.success("User created successfully!");
      }

      setFormData({ name: "", email: "", phone: "", address: "" });
      onClose();
    } catch (err) {
      if (isEditing) {
        toast.error(updateError || "Failed to update user");
      } else {
        toast.error(createError || "Failed to create user");
      }
    }
  };

  const handleClose = () => {
    dispatch(clearCreateError());
    dispatch(clearUpdateError());
    setErrors({});
    onClose();
  };

  const currentError = isEditing ? updateError : createError;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter full name"
              autoComplete="off"
              value={formData.name}
              onChange={handleInputChange}
              className={`h-12 border-2 transition-all duration-200 ${
                errors.name
                  ? "border-red-300 focus:border-red-400 bg-red-50"
                  : "border-slate-200 focus:border-slate-400 bg-slate-50"
              } focus:bg-white focus:ring-0 rounded-xl font-medium`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              autoComplete="off"
              value={formData.email}
              onChange={handleInputChange}
              className={`h-12 border-2 transition-all duration-200 ${
                errors.email
                  ? "border-red-300 focus:border-red-400 bg-red-50"
                  : "border-slate-200 focus:border-slate-400 bg-slate-50"
              } focus:bg-white focus:ring-0 rounded-xl font-medium`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              autoComplete="off"
              value={formData.phone}
              onChange={handleInputChange}
              className={`h-12 border-2 transition-all duration-200 ${
                errors.phone
                  ? "border-red-300 focus:border-red-400 bg-red-50"
                  : "border-slate-200 focus:border-slate-400 bg-slate-50"
              } focus:bg-white focus:ring-0 rounded-xl font-medium`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                <X className="w-3 h-3" />
                {errors.phone}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Address
            </Label>
            <Input
              id="address"
              name="address"
              type="text"
              placeholder="Enter address"
              autoComplete="off"
              value={formData.address}
              onChange={handleInputChange}
              className="h-12 border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-0 rounded-xl font-medium transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {currentError && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-sm font-medium">{currentError}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isEditing) {
                dispatch(clearUpdateError());
              } else {
                dispatch(clearCreateError());
              }
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={handleClose}
          disabled={loading}
          className="h-12 px-6 bg-white hover:bg-slate-50 text-slate-600 border-slate-200 rounded-xl font-semibold transition-all duration-200 hover:shadow-sm"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !formData.name.trim() || !formData.email.trim()}
          className="h-12 px-6 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              {isEditing ? (
                <Save className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {isEditing ? "Update User" : "Create User"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserForm;
