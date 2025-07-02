import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
}

interface UserState {
    users: User[];
    loading: boolean;
    fetchError: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
}

interface CreateUserData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

const initialState: UserState = {
    users: [],
    loading: false,
    fetchError: null,
    createError: null,
    updateError: null,
    deleteError: null
}

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            return result.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
        }
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (userData: CreateUserData, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            console.log(response);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                throw new Error(errorData.message || 'Failed to create user');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to create user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, userData }: { id: string; userData: CreateUserData }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            return id;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete user');
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearCreateError: (state) => {
            state.createError = null;
        },
        clearFetchError: (state) => {
            state.fetchError = null;
        },
        clearUpdateError: (state) => {
            state.updateError = null;
        },
        clearDeleteError: (state) => {
            state.deleteError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.fetchError = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.fetchError = null;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.fetchError = action.payload as string;
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.createError = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
                state.createError = null;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.createError = action.payload as string;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.updateError = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.updateError = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.updateError = action.payload as string;
            })
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.deleteError = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(user => user.id !== action.payload);
                state.deleteError = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.deleteError = action.payload as string;
            });
    }
});

export const { clearCreateError, clearFetchError, clearUpdateError, clearDeleteError } = userSlice.actions;
export const userReducer = userSlice.reducer;