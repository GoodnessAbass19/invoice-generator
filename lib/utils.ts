/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvoiceStatus } from "@/app/generated/prisma/enums";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  // Check if the input is valid
  if (!name || typeof name !== "string") {
    return "";
  }

  // Remove leading and trailing spaces, and replace multiple spaces with a single space.
  const cleanName = name.trim().replace(/\s+/g, " ");

  // Split the name into an array of words.
  const words = cleanName.split(" ");

  // Extract the first letter of each word and convert it to uppercase.
  const initials = words.map((word) => word[0]?.toUpperCase()).join("");

  return initials;
}

export const formatCurrencyValue = (value: any) => {
  const formattedValue = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(value);

  // Split the formatted value before the decimal point
  const parts = formattedValue;
  // .split(".");
  return parts;
};

export const getStatusBadgeVariant = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.PAID:
      return "success";
    case InvoiceStatus.PENDING:
      return "warning";
    case InvoiceStatus.OVERDUE:
      return "info";
    case InvoiceStatus.DRAFT:
      return "default";
    case InvoiceStatus.CANCELLED:
      return "destructive";

    default:
      return "secondary";
  }
};

export const getStatusDisplayName = (status: InvoiceStatus) => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

// lib/format-currency.ts
// lib/format-currency.ts
export const formatCurrency = (
  amount: number,
  currency?: string,
  locale = "en-US",
) => {
  const safeCurrency =
    typeof currency === "string" && currency.length === 3
      ? currency.toUpperCase()
      : "USD";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: safeCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};
