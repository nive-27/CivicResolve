import React from "react";
import { ComplaintStatus } from "@/types/complaint";
import { STATUS_STYLES } from "@/lib/constants";
import { Clock, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
  size?: "sm" | "md";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = "md",
}) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Reported;

  const renderIcon = () => {
    const iconClass = size === "sm" ? "w-3 h-3 mr-1" : "w-3.5 h-3.5 mr-1.5";
    switch (status) {
      case "Reported":
        return <Clock className={iconClass} aria-hidden="true" />;
      case "In Progress":
        return <Loader2 className={cn(iconClass, "animate-spin text-amber-700")} aria-hidden="true" />;
      case "Resolved":
        return <CheckCircle2 className={cn(iconClass, "text-emerald-700")} aria-hidden="true" />;
      default:
        return null;
    }
  };

  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs sm:text-sm",
        style.bg,
        style.border,
        className
      )}
      aria-label={`Status: ${status}`}
    >
      {renderIcon()}
      <span>{status}</span>
    </span>
  );
};
