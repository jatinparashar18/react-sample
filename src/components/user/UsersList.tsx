import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchUsers,
  clearFetchError,
  deleteUser,
  clearDeleteError,
} from "@/features/users/userSlice";
import {
  Mail,
  MapPin,
  Phone,
  User,
  RefreshCw,
  X,
  Edit,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import UserForm from "./UserForm";

const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt">("name");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const { users, loading, fetchError, deleteError } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearDeleteError());
    }
  }, [deleteError, dispatch]);

  const handleRetry = () => {
    dispatch(clearFetchError());
    dispatch(fetchUsers());
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users
    .filter((user) =>
      [user.name, user.email, user.phone, user.address]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-6 h-6 text-slate-400" />
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-slate-700">
              Loading users...
            </h3>
            <p className="text-sm text-slate-500">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shadow-sm">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Failed to load users
              </h3>
              <p className="text-sm text-red-600 mt-1">{fetchError}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(clearFetchError())}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <Button
          onClick={handleRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl px-6 py-2.5 flex items-center gap-2 shadow-sm transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 px-4 py-2 rounded-full font-semibold text-sm border-0 shadow-sm"
          >
            {users.length} {users.length === 1 ? "user" : "users"} total
          </Badge>
          {filteredUsers.length !== users.length && (
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full font-medium text-sm"
            >
              {filteredUsers.length} filtered
            </Badge>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, email, phone, or address..."
              className="pl-10 h-12 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-400 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onValueChange={(value: "name" | "email" | "createdAt") =>
                setSortBy(value)
              }
            >
              <SelectTrigger className="w-[140px] h-12 border-slate-200 bg-slate-50 focus:bg-white rounded-xl">
                <Filter className="w-4 h-4 mr-2 text-slate-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="email">Sort by Email</SelectItem>
                <SelectItem value="createdAt">Sort by Date</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="h-12 px-4 border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center gap-2"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
            >
              <RefreshCw className="w-4 h-4" />
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>
      </div>

      {users.length === 0 ? (
        <Card className="border-slate-200 rounded-2xl shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
              <User className="h-10 w-10 text-slate-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800 mb-3">
              No users found
            </CardTitle>
            <CardDescription className="text-slate-500 text-center max-w-md text-lg">
              Get started by creating your first user account. Click the "Add
              New User" button to begin.
            </CardDescription>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card className="border-slate-200 rounded-2xl shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800 mb-2">
              No matching users
            </CardTitle>
            <CardDescription className="text-slate-500 text-center max-w-sm">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className="border-slate-200 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-0 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    #{user.id.slice(-8)}
                  </Badge>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {user.name}? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                    <User className="w-7 h-7 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800 leading-tight">
                      {user.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium truncate flex-1">
                      {user.email}
                    </span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{user.phone}</span>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium truncate flex-1">
                        {user.address}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-medium">
                    Created{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <AlertDialogContent className="max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold text-slate-900">
                Edit User
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600 mt-1">
                Update the user information below and save your changes.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <div className="p-6">
            <UserForm
              user={editingUser}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingUser(null);
              }}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersList;
