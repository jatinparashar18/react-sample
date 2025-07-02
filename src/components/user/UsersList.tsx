import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchUsers, clearFetchError } from "@/features/users/userSlice";
import { Loader2, Mail, MapPin, Phone, User, RefreshCw, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, fetchError } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearFetchError());
    dispatch(fetchUsers());
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <span className="text-slate-500 font-medium">Loading users...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-800">
                Failed to load users
              </h3>
              <p className="text-sm text-red-600">{fetchError}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(clearFetchError())}
            className="text-red-400 hover:text-red-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Button
          onClick={handleRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 flex items-center gap-2"
          size="sm"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge
          variant="secondary"
          className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium"
        >
          {users.length} {users.length === 1 ? "user" : "users"} total
        </Badge>
      </div>

      {users.length === 0 ? (
        <Card className="border-slate-200 rounded-xl">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-slate-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-slate-800 mb-2">
              No users found
            </CardTitle>
            <CardDescription className="text-slate-500 text-center max-w-sm">
              Get started by creating your first user account. Click the "Add
              New User" button above.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card
              key={user.id}
              className="border-slate-200 rounded-xl bg-white hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-slate-100 text-slate-700 border-0 text-xs font-medium px-2 py-1 rounded-md">
                    #{user.id}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800 leading-tight">
                      {user.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {user.email}
                    </span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">{user.phone}</span>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium truncate">
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
    </div>
  );
};

export default UsersList;
