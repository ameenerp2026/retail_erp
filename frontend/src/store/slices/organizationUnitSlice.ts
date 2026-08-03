import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrganizationUnits } from "@/services/organizationUnit.service";

export const fetchOrganizationUnits = createAsyncThunk(
  "organizationUnit/fetch",
  async () => {
    return await getOrganizationUnits();
  }
);

const organizationUnitSlice = createSlice({
  name: "organizationUnit",
  initialState: {
    units: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationUnits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizationUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.units = action.payload;
      })
      .addCase(fetchOrganizationUnits.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default organizationUnitSlice.reducer;