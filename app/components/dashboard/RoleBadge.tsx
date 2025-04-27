import React from "react";

type RoleType = "Super Admin" | "Moderator" | "User";

interface RoleBadgeProps {
  role: RoleType;
}

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getBadgeStyles = (role: RoleType) => {
    switch (role) {
      case "Super Admin":
        return "bg-green-700 text-white";
      case "Moderator":
        return "bg-green-100 text-green-700";
      case "User":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyles(
        role
      )}`}
    >
      {role}
    </span>
  );
};

export default RoleBadge; 