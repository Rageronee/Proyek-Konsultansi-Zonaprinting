import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadAuthState, saveAuthState } from "@/services/storage";
import { User, UserRole } from "@/types";
import { seedUsers } from "@/data/seed";

type AuthContextValue = {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; message?: string };
  signup: (payload: Omit<User, "id" | "role"> & { role?: UserRole }) => { success: boolean; message?: string };
  logout: () => void;
  markWelcomeVoucherShown: () => void;
  markWelcomeVoucherUsed: () => void;
  updateProfile: (payload: Partial<User>) => void;
  changePassword: (current: string, next: string) => { success: boolean; message?: string };
  upsertVoucher: (email: string, code: string, amount: number) => { success: boolean; message?: string };
  deleteVoucher: (email: string, code: string) => { success: boolean; message?: string };
};

type AuthState = {
  user: User | null;
  users: User[];
};

const AUTH_FALLBACK: AuthState = {
  user: null,
  users: seedUsers,
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

const updateUserFields = (prev: AuthState, id: string, payload: Partial<User>): AuthState => {
  const updatedUsers = prev.users.map((u) => (u.id === id ? { ...u, ...payload } : u));
  const updatedUser = updatedUsers.find((u) => u.id === id) ?? null;
  return { ...prev, users: updatedUsers, user: updatedUser };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => loadAuthState<AuthState>(AUTH_FALLBACK));

  useEffect(() => {
    saveAuthState(state);
  }, [state]);

  const login: AuthContextValue["login"] = (email, password) => {
    const existing = state.users.find((u) => u.email === email && u.password === password);
    if (!existing) {
      return { success: false, message: "Email atau password salah" };
    }
    setState((prev) => ({ ...prev, user: existing }));
    return { success: true };
  };

  const signup: AuthContextValue["signup"] = ({ name, email, password, role }) => {
    const already = state.users.some((u) => u.email === email);
    if (already) return { success: false, message: "Email sudah terdaftar" };

    const newUser: User = {
      id: createId("user"),
      name,
      email,
      password,
      role: role ?? "user",
      welcomeVoucherShown: false,
      welcomeVoucherUsed: false,
      vouchers: [{ code: "WELCOME25", amount: 25000, used: false }],
    };
    setState((prev) => ({ ...prev, users: [...prev.users, newUser], user: newUser }));
    return { success: true };
  };

  const logout = () => setState((prev) => ({ ...prev, user: null }));

  const markWelcomeVoucherShown = () => {
    if (!state.user) return;
    setState((prev) => updateUserFields(prev, state.user!.id, { welcomeVoucherShown: true }));
  };

  const markWelcomeVoucherUsed = () => {
    if (!state.user) return;
    setState((prev) => updateUserFields(prev, state.user!.id, { welcomeVoucherUsed: true }));
  };

  const updateProfile: AuthContextValue["updateProfile"] = (payload) => {
    if (!state.user) return;
    setState((prev) => updateUserFields(prev, state.user!.id, payload));
  };

  const changePassword: AuthContextValue["changePassword"] = (current, next) => {
    if (!state.user) return { success: false, message: "Belum login" };
    const existing = state.users.find((u) => u.id === state.user!.id);
    if (!existing || existing.password !== current) {
      return { success: false, message: "Password lama tidak sesuai" };
    }
    setState((prev) => updateUserFields(prev, state.user!.id, { password: next }));
    return { success: true };
  };

  const upsertVoucher: AuthContextValue["upsertVoucher"] = (email, code, amount) => {
    const target = state.users.find((u) => u.email === email);
    if (!target) return { success: false, message: "User tidak ditemukan" };
    const vouchers = target.vouchers ?? [];
    const updated = vouchers.some((v) => v.code.toUpperCase() === code.toUpperCase())
      ? vouchers.map((v) => (v.code.toUpperCase() === code.toUpperCase() ? { ...v, amount, used: false } : v))
      : [...vouchers, { code, amount, used: false }];

    setState((prev) => ({
      users: prev.users.map((u) => (u.id === target.id ? { ...u, vouchers: updated } : u)),
      user: prev.user && prev.user.id === target.id ? { ...prev.user, vouchers: updated } : prev.user,
    }));
    return { success: true };
  };

  const deleteVoucher: AuthContextValue["deleteVoucher"] = (email, code) => {
    const target = state.users.find((u) => u.email === email);
    if (!target) return { success: false, message: "User tidak ditemukan" };
    const vouchers = target.vouchers ?? [];
    const updated = vouchers.filter((v) => v.code.toUpperCase() !== code.toUpperCase());

    setState((prev) => ({
      users: prev.users.map((u) => (u.id === target.id ? { ...u, vouchers: updated } : u)),
      user: prev.user && prev.user.id === target.id ? { ...prev.user, vouchers: updated } : prev.user,
    }));
    return { success: true };
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      users: state.users,
      isAuthenticated: Boolean(state.user),
      isAdmin: state.user?.role === "admin",
      login,
      signup,
      logout,
      markWelcomeVoucherShown,
      markWelcomeVoucherUsed,
      updateProfile,
      changePassword,
      upsertVoucher,
      deleteVoucher,
    }),
    [state.user, state.users],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

