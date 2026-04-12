"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { Business, BusinessPlan } from "@/lib/supabase";

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
  const { isLoaded, isSignedIn, user } = useUser();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = useCallback(async () => {
    // Wait until Clerk user is fully loaded
    if (!isLoaded) return;

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/dashboard/business`);
      
      if (response.status === 401) {
        // Not authenticated
        router.push("/sign-in");
        return;
      }

      if (response.status === 404) {
        // No business found, redirect to onboarding
        router.push("/onboarding");
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
  }, [router, isLoaded, isSignedIn]);

  useEffect(() => {
    void fetchBusiness();
  }, [fetchBusiness]);

  const value: BusinessContextValue = {
    business,
    loading: loading || !isLoaded,
    error,
    isAuthenticated: isSignedIn && !!business,
    refresh: fetchBusiness,
    plan: business?.plan ?? "trial",
    businessName: business?.business_name ?? "",
    businessEmail: business?.owner_email ?? user?.emailAddresses[0]?.emailAddress ?? "",
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}
