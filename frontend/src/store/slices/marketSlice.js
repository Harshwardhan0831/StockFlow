import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchStocks = createAsyncThunk('market/fetchStocks', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/market/stocks');
    return data.stocks;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch stocks');
  }
});

export const fetchQuote = createAsyncThunk('market/fetchQuote', async (symbol, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/market/stocks/${symbol}/quote`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch quote');
  }
});

export const fetchHistory = createAsyncThunk('market/fetchHistory', async ({ symbol, days = 30 }, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/market/stocks/${symbol}/history`, { params: { days } });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch history');
  }
});

const initialState = { stocks: [], selectedStock: null, history: null, loading: false, error: null };

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    selectStock: (state, action) => { state.selectedStock = action.payload; },
    clearError: (state) => { state.error = null; },
    updateQuotes: (state, action) => {
      const updatedList = action.payload;
      if (!Array.isArray(updatedList)) return;
      if (state.stocks.length === 0) {
        state.stocks = updatedList;
      } else {
        const map = new Map(updatedList.map((s) => [s.symbol, s]));
        state.stocks = state.stocks.map((s) => map.get(s.symbol) || s);
      }
      if (state.selectedStock) {
        const found = updatedList.find((s) => s.symbol === state.selectedStock.symbol);
        if (found) {
          state.selectedStock = { ...state.selectedStock, ...found };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => { state.loading = true; })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export const { selectStock, clearError: clearMarketError, updateQuotes } = marketSlice.actions;
export default marketSlice.reducer;
