"use client";
import { useState } from "react";
import Link from "next/link";
import { Users, GraduationCap } from "lucide-react";

import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineCampaign } from "react-icons/md";
import { GoShieldCheck } from "react-icons/go";
import { BsGearWideConnected } from "react-icons/bs";
import { FaRegFileCode } from "react-icons/fa";

import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className=" h-[674px]  p-4 flex flex-col justify-between">
      <div>
        <nav className="mt-4 space-y-2">
          <NavItem
            icon={MdOutlineDashboard}
            label="Dashboard"
            href="/dashboard"
            isActive={pathname === "/dashboard"}
          />
          <NavItem
            icon={Users}
            label="User Management"
            href="/user-management"
            isActive={pathname === "/user-management"}
          />
          <NavItem
            icon={MdOutlineCampaign}
            label="Campaigns"
            href="/campaigns"
            isActive={pathname === "/campaigns"}
          />
          <NavItem
            icon={FaRegFileCode}
            label="Smart Contract"
            href="/smart-contract"
            isActive={pathname === "/smart-contract"}
          />
          <NavItem
            icon={GoShieldCheck}
            label="Security"
            href="/security"
            isActive={pathname === "/security"}
          />

          <NavItem
            icon={BsGearWideConnected}
            label="Settings"
            href="/settings"
            isActive={pathname === "/settings"}
          />
        </nav>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const NavItem = ({ icon: Icon, label, href, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center gap-3 p-3 rounded-lg hover:bg-[#1A5D1A] hover:text-white cursor-pointer ${
      isActive ? "bg-[#E8F5E8]" : "hover:bg-[#1A5D1A]"
    }`}
  >
    <Icon className=" w-5 h-5" />
    <span className="text-sm">{label}</span>
  </Link>
);
