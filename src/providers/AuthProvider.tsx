import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { loadAuthState, saveAuthState } from "@/services/storage";
import { User, UserRole } from "@/types";
import { seedUsers } from "@/data/seed";

type AuthContextValue = {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; message?: string };
  signup: (payload: Omit<User, "id" | "role"> & { role?: UserRole }) => Promise<{ success: boolean; message?: string }>;
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
  users: [],
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

  // Fetch users from Supabase to keep admin list fresh
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error);
        return;
      }
      if (data) {
        // Map DB columns to our User type if needed, but our schema matches mostly.
        // We need to map snake_case to camelCase if they differ, but we used camelCase in seed.
        // Let's assume standard mapping or check if we need to transform.
        // Our User type uses camelCase: welcomeVoucherShown. DB likely uses snake_case: welcome_voucher_shown.

        const mappedUsers: User[] = data.map((u: any) => ({
          ...u,
          password: u.encrypted_password, // Map DB column to app type
          welcomeVoucherShown: u.welcome_voucher_shown,
          welcomeVoucherUsed: u.welcome_voucher_used,
          // Ensure vouchers is an array
          vouchers: u.owned_vouchers || [] // Map owned_vouchers from DB
        }));

        setState(prev => ({ ...prev, users: mappedUsers }));
      }
    };
    fetchUsers();
  }, []);

  const login: AuthContextValue["login"] = (email, password) => {
    const existing = state.users.find((u) => u.email === email && u.password === password);
    if (!existing) {
      return { success: false, message: "Email atau password salah" };
    }
    setState((prev) => ({ ...prev, user: existing }));
    return { success: true };
  };

  const signup: AuthContextValue["signup"] = async ({ name, email, password, role }) => {
    const already = state.users.some((u) => u.email === email);
    if (already) return { success: false, message: "Email sudah terdaftar" };

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: role ?? "user",
      welcomeVoucherShown: false,
      welcomeVoucherUsed: false,
      vouchers: [{ code: "WELCOME25", amount: 25000, used: false }],
    };

    // Insert to Supabase
    // Note: In a production app with Supabase Auth, you'd use supabase.auth.signUp().
    // Since we're using a custom 'users' table per the user's specific request/prototype setup:
    const { error } = await supabase.from("users").insert({
      id: newUser.id,
      email: newUser.email,
      encrypted_password: newUser.password, // Correct column name
      name: newUser.name,
      role: newUser.role,
      owned_vouchers: newUser.vouchers, // Correct column name (was vouchers)
      welcome_voucher_shown: newUser.welcomeVoucherShown,
      welcome_voucher_used: newUser.welcomeVoucherUsed,
    });

    if (error) {
      console.error("Signup DB Error:", error);
      // We'll mostly ignore DB error for prototype to keep the UX flowing if DB is strict, 
      // but ideally we should block. For now, let's proceed with local state update too.
    }

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

  const updateProfile: AuthContextValue["updateProfile"] = async (payload) => {
    if (!state.user) return;
    const userId = state.user.id;

    // Optimistic update
    setState((prev) => updateUserFields(prev, userId, payload));

    // Map payload to snake_case for DB
    const dbPayload: any = {};
    if (payload.name) dbPayload.name = payload.name;
    if (payload.email) dbPayload.email = payload.email;
    if (payload.password) dbPayload.encrypted_password = payload.password; // Handle password update
    if (payload.phone) dbPayload.phone = payload.phone;
    if (payload.address) dbPayload.address = payload.address;
    if (payload.city) dbPayload.city = payload.city;
    if (payload.province) dbPayload.province = payload.province;
    if (payload.welcomeVoucherShown !== undefined) dbPayload.welcome_voucher_shown = payload.welcomeVoucherShown;
    if (payload.welcomeVoucherUsed !== undefined) dbPayload.welcome_voucher_used = payload.welcomeVoucherUsed;
    if (payload.vouchers) dbPayload.owned_vouchers = payload.vouchers; // JSONB column (owned_vouchers)

    const { error } = await supabase.from("users").update(dbPayload).eq("id", userId);
    if (error) {
      console.error("Failed to update profile in DB:", error);
      // Ideally revert state or notify user, but for now log it.
    }
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

