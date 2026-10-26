import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import { logout } from './authSlice';

const INITIAL_CASH = 50000.0;

// Clean up any deprecated localStorage mock cache
try {
  localStorage.removeItem('stockflow_demo_account_v1');
} catch (e) {
  // Ignore localStorage access errors
}

// Normalize order object so both timestamp & created_at and uppercase/lowercase side are compatible
export const formatOrder = (ord) => ({
  ...ord,
  id: ord.id,
  symbol: ord.symbol,
  name: ord.name || ord.symbol,
  side: ord.side ? ord.side.toUpperCase() : 'BUY',
  quantity: parseInt(ord.quantity, 10) || 0,
  price: parseFloat(ord.price) || 0,
  total: parseFloat(ord.total) || 0,
  status: ord.status ? ord.status.toUpperCase() : 'FILLED',
  created_at: ord.created_at || new Date().toISOString(),
  timestamp: ord.created_at || ord.timestamp || new Date().toISOString(),
});

// Fetch user orders directly from MySQL database
export const fetchOrders = createAsyncThunk(
  'demo/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders');
      const formattedOrders = (data.orders || []).map(formatOrder);
      return {
        orders: formattedOrders,
        cashBalance: typeof data.cashBalance === 'number' ? data.cashBalance : INITIAL_CASH,
        holdings: data.holdings || {},
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders from database');
    }
  }
);

// Place order directly into MySQL database
export const placeOrder = createAsyncThunk(
  'demo/placeOrder',
  async ({ symbol, side, quantity, price, name }, { rejectWithValue }) => {
    try {
      const normalizedSide = String(side).toLowerCase();
      const { data } = await api.post('/orders/place', {
        symbol,
        side: normalizedSide,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
      });

      const formattedOrder = formatOrder({
        ...data.order,
        name: name || data.order?.name || symbol,
      });

      return {
        order: formattedOrder,
        cashBalance: typeof data.cashBalance === 'number' ? data.cashBalance : undefined,
        holdings: data.holdings || undefined,
        message: data.message,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place order in database');
    }
  }
);

// Reset user orders in MySQL database
export const resetDemoAccount = createAsyncThunk(
  'demo/resetDemoAccount',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete('/orders');
      return {
        orders: [],
        cashBalance: typeof data.cashBalance === 'number' ? data.cashBalance : INITIAL_CASH,
        holdings: data.holdings || {},
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reset orders');
    }
  }
);

export const resetOrders = resetDemoAccount;

// Convenience wrappers for demoBuy and demoSell that dispatch placeOrder
export const demoBuy = (payload) => placeOrder({ ...payload, side: 'buy' });
export const demoSell = (payload) => placeOrder({ ...payload, side: 'sell' });

const initialState = {
  cashBalance: INITIAL_CASH,
  holdings: {},
  orders: [],
  loading: false,
  error: null,
  lastTransaction: null,
};

const demoSlice = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    clearDemoError: (state) => {
      state.error = null;
    },
    clearLastTransaction: (state) => {
      state.lastTransaction = null;
    },
  },
  extraReducers: (builder) => {
    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.cashBalance = action.payload.cashBalance;
        state.holdings = action.payload.holdings;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
      })

    // placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        const { order, cashBalance, holdings } = action.payload;
        if (order) {
          state.orders = [order, ...state.orders.filter((o) => o.id !== order.id)];
          state.lastTransaction = { type: order.side, ...order };
        }
        if (typeof cashBalance === 'number') {
          state.cashBalance = cashBalance;
        }
        if (holdings) {
          state.holdings = holdings;
        }
        state.error = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Order execution failed';
      })

    // resetDemoAccount / resetOrders
      .addCase(resetDemoAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetDemoAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [];
        state.cashBalance = action.payload.cashBalance;
        state.holdings = action.payload.holdings;
        state.lastTransaction = null;
        state.error = null;
      })
      .addCase(resetDemoAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Reset failed';
      })

    // logout
      .addCase(logout.fulfilled, (state) => {
        state.cashBalance = INITIAL_CASH;
        state.holdings = {};
        state.orders = [];
        state.lastTransaction = null;
        state.error = null;
      });
  },
});

export const { clearDemoError, clearLastTransaction } = demoSlice.actions;
export default demoSlice.reducer;
