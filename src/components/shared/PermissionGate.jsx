import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const ROLE_PERMISSIONS = {
  admin: ["all"],
  manager: ["dashboard", "analytics", "reports", "equipment", "maintenance", "occupancy", "blueprints", "documents", "alerts"],
  technician: ["dashboard", "equipment", "maintenance", "documents", "blueprints"],
  operator: ["dashboard", "energy", "water", "fuel", "pool"],
  viewer: ["dashboard", "analytics", "reports"]
};

export function usePermissions() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000,
  });

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission);
  };

  return { hasPermission, user };
}

export default function PermissionGate({ permission, children, fallback = null }) {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
}