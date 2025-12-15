import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { sweetId, name, price, quantity }
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.items.find(
        (i) => i._id === item._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      state.totalAmount += item.price;
    },

    removeFromCart(state, action) {
      const sweetId = action.payload;
      const item = state.items.find((i) => i._id === sweetId);

      if (!item) return;

      state.totalAmount -= item.price;

      if (item.quantity === 1) {
        state.items = state.items.filter((i) => i._id !== sweetId);
      } else {
        item.quantity -= 1;
      }
    },

    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
