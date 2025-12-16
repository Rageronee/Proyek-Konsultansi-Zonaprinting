import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadShopState, saveShopState } from "@/services/storage";
import {
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  ProductPerformance,
  UploadAttachment,
} from "@/types";
import { seedProducts } from "@/data/seed";

type ShopContextValue = {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addProduct: (payload: Omit<Product, "id">) => void;
  updateProduct: (id: string, payload: Partial<Omit<Product, "id">>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  attachFile: (productId: string, attachment: UploadAttachment) => void;
  removeAttachment: (productId: string, attachmentId: string) => void;
  checkout: (
    userId: string,
    totalOverride: number,
    meta: { userName: string; userEmail: string; userPhone?: string; userAddress?: string; paymentMethod: PaymentMethod },
  ) => { success: boolean; message?: string; orderId?: string };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getProductPerformance: () => ProductPerformance[];
  getCartTotal: () => number;
};

type ShopState = {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
};

const SHOP_FALLBACK: ShopState = {
  products: seedProducts,
  cart: [],
  orders: [],
};

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

const calcTotal = (items: OrderItem[]) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

const normalizeState = (raw: ShopState): ShopState => ({
  ...raw,
  cart: raw.cart.map((c) => ({ ...c, attachments: c.attachments ?? [] })),
  orders: raw.orders.map((o) => ({
    ...o,
    status: (o.status ?? "baru") as OrderStatus,
    paymentMethod: o.paymentMethod ?? "qris",
    attachments: o.attachments ?? [],
    userName: o.userName ?? o.userId,
    userEmail: o.userEmail ?? "",
  })),
});

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ShopState>(() => normalizeState(loadShopState<ShopState>(SHOP_FALLBACK)));

  useEffect(() => {
    saveShopState(state);
  }, [state]);

  const addProduct: ShopContextValue["addProduct"] = (payload) => {
    const newProduct: Product = { ...payload, id: createId("prd") };
    setState((prev) => ({ ...prev, products: [...prev.products, newProduct] }));
  };

  const updateProduct: ShopContextValue["updateProduct"] = (id, payload) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, ...payload } : p)),
    }));
  };

  const deleteProduct: ShopContextValue["deleteProduct"] = (id) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
      cart: prev.cart.filter((c) => c.productId !== id),
    }));
  };

  const addToCart: ShopContextValue["addToCart"] = (productId, quantity = 1) => {
    setState((prev) => {
      const existing = prev.cart.find((c) => c.productId === productId);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map((c) =>
            c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c,
          ),
        };
      }
      return { ...prev, cart: [...prev.cart, { productId, quantity, attachments: [] }] };
    });
  };

  const updateCartItem: ShopContextValue["updateCartItem"] = (productId, quantity) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart
        .map((c) => (c.productId === productId ? { ...c, quantity } : c))
        .filter((c) => c.quantity > 0),
    }));
  };

  const removeFromCart: ShopContextValue["removeFromCart"] = (productId) => {
    setState((prev) => ({ ...prev, cart: prev.cart.filter((c) => c.productId !== productId) }));
  };

  const clearCart = () => setState((prev) => ({ ...prev, cart: [] }));

  const attachFile: ShopContextValue["attachFile"] = (productId, attachment) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.map((c) =>
        c.productId === productId ? { ...c, attachments: [...(c.attachments ?? []), attachment] } : c,
      ),
    }));
  };

  const removeAttachment: ShopContextValue["removeAttachment"] = (productId, attachmentId) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.map((c) =>
        c.productId === productId
          ? { ...c, attachments: (c.attachments ?? []).filter((a) => a.id !== attachmentId) }
          : c,
      ),
    }));
  };

  const checkout: ShopContextValue["checkout"] = (userId, totalOverride, meta) => {
    if (!state.cart.length) return { success: false, message: "Keranjang masih kosong" };

    const items: OrderItem[] = state.cart
      .map((c) => {
        const product = state.products.find((p) => p.id === c.productId);
        if (!product) return null;
        return { productId: product.id, name: product.name, price: product.price, quantity: c.quantity };
      })
      .filter(Boolean) as OrderItem[];

    const total = totalOverride ?? calcTotal(items);
    const attachments: UploadAttachment[] = state.cart.flatMap((c) => c.attachments ?? []);

    const newOrder: Order = {
      id: createId("ord"),
      userId,
      userName: meta.userName,
      userEmail: meta.userEmail,
      userPhone: meta.userPhone,
      userAddress: meta.userAddress,
      items,
      attachments,
      total,
      status: "baru",
      paymentMethod: meta.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders],
      cart: [],
    }));
    return { success: true, orderId: newOrder.id };
  };

  const updateOrderStatus: ShopContextValue["updateOrderStatus"] = (orderId, status) => {
    setState((prev) => ({
      ...prev,
      orders: prev.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    }));
  };

  const getProductPerformance = () => {
    const perf: Record<string, ProductPerformance> = {};
    state.orders.forEach((order) => {
      order.items.forEach((item) => {
        const current = perf[item.productId] ?? {
          productId: item.productId,
          name: item.name,
          totalSold: 0,
          revenue: 0,
        };
        current.totalSold += item.quantity;
        current.revenue += item.quantity * item.price;
        perf[item.productId] = current;
      });
    });
    return Object.values(perf);
  };

  const getCartTotal = () => {
    return state.cart.reduce((sum, item) => {
      const product = state.products.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  };

  const value = useMemo<ShopContextValue>(
    () => ({
      products: state.products,
      cart: state.cart,
      orders: state.orders,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      attachFile,
      removeAttachment,
      checkout,
      updateOrderStatus,
      getProductPerformance,
      getCartTotal,
    }),
    [state],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};

