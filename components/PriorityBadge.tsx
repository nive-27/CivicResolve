import React from "react";
import { ComplaintPriority } from "@/types/complaint";
import { PRIORITY_STYLES } from "@/lib/constants";
import { AlertCircle, AlertTriangle, Flame, ShieldAlert, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  className?: string;
  size?: "sm" | "md";
  showLabelPrefix?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className,
  size = "md",
  showLabelPrefix = false,
}) => {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;

  const renderIcon = () => {
    const iconClass = size === "sm" ? "w-3 h-3 mr-1" : "w-3.5 h-3.5 mr-1.5";
    switch (priority) {
      case "Critical":
        return <Flame className={cn(iconClass, "text-red-700")} aria-hidden="true" />;
      case "High":
        return <ShieldAlert className={cn(iconClass, "text-orange-700")} aria-hidden="true" />;
      case "Medium":
        return <AlertTriangle className={cn(iconClass, "text-amber-700")} aria-hidden="true" />;
      case "Low":
        return <ArrowDown className={cn(iconClass, "text-emerald-700")} aria-hidden="true" />;
      default:
        return <AlertCircle className={iconClass} aria-hidden="true" />;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-md border",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs sm:text-sm",
        style.bg,
        style.border,
        className
      )}
      aria-label={`Priority level: ${priority}`}
    >
      {renderIcon()}
      <span>
        {showLabelPrefix ? `${priority} Priority` : priority}
      </span>
    </span>
  );
};
