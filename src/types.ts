export type UserRole = "user" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  welcomeVoucherShown?: boolean;
  welcomeVoucherUsed?: boolean;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  vouchers?: VoucherCode[];
};

export type VoucherCode = {
  code: string;
  amount: number;
  used?: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  featured?: boolean;
  options?: string[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  attachments?: UploadAttachment[];
  selectedOption?: string;
  note?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAddress?: string;
  items: OrderItem[];
  attachments?: UploadAttachment[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
};

export type OrderStatus = "baru" | "diproses" | "produksi" | "dikirim" | "selesai";

export type SalesStat = {
  label: string;
  value: number;
  change?: number;
};

export type ProductPerformance = {
  productId: string;
  name: string;
  totalSold: number;
  revenue: number;
};

export type UploadAttachment = {
  id: string;
  name: string;
  url: string;
};

export type PaymentMethod = "qris" | "bca" | "mandiri" | "bri";

