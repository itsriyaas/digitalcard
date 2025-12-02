import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { catalogueAPI } from '../../services/catalogueAPI';

// Async thunks
export const createCatalogue = createAsyncThunk(
  'catalogue/create',
  async (catalogueData, { rejectWithValue }) => {
    try {
      const response = await catalogueAPI.create(catalogueData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create catalogue');
    }
  }
);

export const fetchUserCatalogues = createAsyncThunk(
  'catalogue/fetchUserCatalogues',
  async (_, { rejectWithValue }) => {
    try {
      const response = await catalogueAPI.getUserCatalogues();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch catalogues');
    }
  }
);

export const fetchCatalogue = createAsyncThunk(
  'catalogue/fetchCatalogue',
  async (id, { rejectWithValue }) => {
    try {
      const response = await catalogueAPI.get(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch catalogue');
    }
  }
);

export const fetchPublicCatalogue = createAsyncThunk(
  'catalogue/fetchPublicCatalogue',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await catalogueAPI.getPublic(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Catalogue not found');
    }
  }
);

export const updateCatalogue = createAsyncThunk(
  'catalogue/update',
  async ({ id, catalogueData }, { rejectWithValue }) => {
    try {
      const response = await catalogueAPI.update(id, catalogueData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update catalogue');
    }
  }
);

export const deleteCatalogue = createAsyncThunk(
  'catalogue/delete',
  async (id, { rejectWithValue }) => {
    try {
      await catalogueAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete catalogue');
    }
  }
);

const catalogueSlice = createSlice({
  name: 'catalogue',
  initialState: {
    catalogues: [],
    currentCatalogue: null,
    publicCatalogue: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCatalogue: (state) => {
      state.currentCatalogue = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create catalogue
      .addCase(createCatalogue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCatalogue.fulfilled, (state, action) => {
        state.loading = false;
        state.catalogues.unshift(action.payload);
        state.currentCatalogue = action.payload;
      })
      .addCase(createCatalogue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user catalogues
      .addCase(fetchUserCatalogues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCatalogues.fulfilled, (state, action) => {
        state.loading = false;
        state.catalogues = action.payload;
      })
      .addCase(fetchUserCatalogues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch catalogue
      .addCase(fetchCatalogue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalogue.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCatalogue = action.payload;
      })
      .addCase(fetchCatalogue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch public catalogue
      .addCase(fetchPublicCatalogue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicCatalogue.fulfilled, (state, action) => {
        state.loading = false;
        state.publicCatalogue = action.payload;
      })
      .addCase(fetchPublicCatalogue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update catalogue
      .addCase(updateCatalogue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCatalogue.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCatalogue = action.payload;
        const index = state.catalogues.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.catalogues[index] = action.payload;
        }
      })
      .addCase(updateCatalogue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete catalogue
      .addCase(deleteCatalogue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCatalogue.fulfilled, (state, action) => {
        state.loading = false;
        state.catalogues = state.catalogues.filter(c => c._id !== action.payload);
        if (state.currentCatalogue?._id === action.payload) {
          state.currentCatalogue = null;
        }
      })
      .addCase(deleteCatalogue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearCurrentCatalogue } = catalogueSlice.actions;
export default catalogueSlice.reducer;
