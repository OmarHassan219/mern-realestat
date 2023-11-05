import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    SIGN_IN_START(state) {
      state.loading = true;
    },
    SIGN_IN_SUCCESS(state, action) {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      
    },
    SIGN_IN_FAILURE(state, action) {
      state.error = action.payload;
      state.loading = false;

    },
  },
});

export const {SIGN_IN_FAILURE , SIGN_IN_SUCCESS , SIGN_IN_START} = userSlice.actions;



export const SelectCurrentUser = (state) => state.user.currentUser
export const SelectError = (state) => state.user.error
export const SelectLoading = (state) => state.user.loading

export default userSlice.reducer;
