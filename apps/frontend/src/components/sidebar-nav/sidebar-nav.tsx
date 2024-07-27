"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SidebarNav = () => {
  const pathname = usePathname();

  const navLinks: { label: string; link: string }[] = [
    {
      label: "Videos",
      link: "/",
    },
    {
      label: "Upload",
      link: "/upload",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {navLinks.map((link, index) => (
        <Link
          key={index}
          href={link.link}
          className={`transition border-b border-gray-500 pb-2 ${
            pathname === link.link
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};
