"use client";

import { useEffect } from "react";
import { useSelectedSubjectsStore } from "@/lib/store/use-selected-subjects";

// Triggers localStorage hydration for the Zustand store on the client.
// Must be rendered inside the root layout to rehydrate before any page renders.
export function StoreInitializer() {
  useEffect(() => {
    useSelectedSubjectsStore.persist.rehydrate();
  }, []);

  return null;
}
