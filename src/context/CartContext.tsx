"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string; size: string; color: string } }
  | { type: "UPDATE_QTY"; payload: { id: string; size: string; color: string; quantity: number } }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  total: number;
  count: number;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = (i: CartItem) => `${i.id}-${i.size}-${i.color}`;
      const exists = state.items.find((i) => key(i) === key(action.payload));
      if (exists) {
        return {
          items: state.items.map((i) =>
            key(i) === key(action.payload) ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) => !(i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color)
        ),
      };
    case "UPDATE_QTY":
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const total = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  return <CartContext.Provider value={{ state, dispatch, total, count }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
