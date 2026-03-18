"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { Business, BusinessPlan } from "@/lib/supabase";

const DASHBOARD_STORAGE_KEY = "cypai-dashboard-email";

export interface BusinessContextValue {
  business: Business | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  plan: BusinessPlan;
  businessName: string;
  businessEmail: string;
}

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}

interface BusinessProviderProps {
  children: ReactNode;
}

export function BusinessProvider({ children }: BusinessProviderProps) {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = useCallback(async () => {
    const email = typeof window !== "undefined" ? localStorage.getItem(DASHBOARD_STORAGE_KEY) : null;
    
    if (!email) {
      setLoading(false);
      setError("Not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/dashboard/business?email=${encodeURIComponent(email)}`);
      
      if (response.status === 401) {
        // Not authenticated - redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem(DASHBOARD_STORAGE_KEY);
          router.push("/login");
        }
        return;
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch business data");
      }
      
      const data = await response.json();
      
      if (data.business) {
        setBusiness(data.business);
      } else {
        setError("No business found");
      }
    } catch (err) {
      console.error("[BusinessContext] Error fetching business:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchBusiness();
  }, [fetchBusiness]);

  const value: BusinessContextValue = {
    business,
    loading,
    error,
    isAuthenticated: !!business,
    refresh: fetchBusiness,
    plan: business?.plan ?? "trial",
    businessName: business?.business_name ?? "",
    businessEmail: business?.owner_email ?? "",
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}
