import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {loginAPI, registerAPI} from "../../lib/api/auth";

export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async (_, { rejectWithValue }) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      return { name: "저장된 유저", token };
    } else {
      return rejectWithValue("토큰 없음");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ id, password }, { rejectWithValue }) => {
    try { 
      const res = await loginAPI(id, password);
      const token = res.data.token;
      await AsyncStorage.setItem("token", token);
      return {...res.data, token};
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "로그인 실패");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ id, email, password }, { rejectWithValue }) => {
    try {
      const res = await registerAPI(id, email, password);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "회원가입 실패");
    }
  }
);

const initialState = {
  login: { id: "", password: "" },
  register: { id: "", email: "", password: "", confirmPassword: "" },
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    changeField: (state, action) => {
      const { form, key, value } = action.payload;
      state[form][key] = value;
    },
    initializeForm: (state, action) => {
      const form = action.payload;
      state[form] = initialState[form];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.success = "회원가입이 완료되었습니다.";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.isLoggedIn = false;
      });
  },
});

export const { changeField, initializeForm } = authSlice.actions;
export default authSlice.reducer;
