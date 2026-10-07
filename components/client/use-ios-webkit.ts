"use client";

import { useEffect, useState } from "react";
import { isIOSWebKit } from "@/lib/ua";

/** `null` until mounted — avoid SSR/client mismatch. */
export function useIOSWebKit(): boolean | null {
  const [value, setValue] = useState<boolean | null>(null);
  useEffect(() => {
    setValue(isIOSWebKit());
  }, []);
  return value;
}
