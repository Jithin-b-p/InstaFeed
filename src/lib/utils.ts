import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TimeUnit {
  label: string;
  threshold: number;
}

export function getRelativeTime(dateTimeString: string): string {
  // Parse the date-time string into a JavaScript Date object
  const date: Date = new Date(dateTimeString);

  // Get the current time in milliseconds
  const now: number = new Date().getTime();

  // Calculate the difference in milliseconds between the post time and now
  const difference: number = now - date.getTime();

  // Handle edge cases (less than a minute)
  if (difference < 60000) {
    return "Just now";
  }

  // Define units and their corresponding milliseconds thresholds
  const units: TimeUnit[] = [
    { label: "year", threshold: 31536000000 }, // 365 days (ignoring leap years for simplicity)
    { label: "month", threshold: 2592000000 }, // 30 days
    { label: "day", threshold: 86400000 },
    { label: "hour", threshold: 3600000 },
    { label: "minute", threshold: 60000 },
  ];

  // Find the appropriate unit based on the difference
  let unit: TimeUnit | undefined;
  for (const item of units) {
    if (difference >= item.threshold) {
      unit = item;
      break;
    }
  }

  // Calculate the time value in the chosen unit
  const timeValue: number = Math.floor(difference / unit!.threshold);

  // Format the relative time string
  return `${timeValue} ${unit!.label}${timeValue > 1 ? "s" : ""} ago`;
}
