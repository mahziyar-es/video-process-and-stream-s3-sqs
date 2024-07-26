import { SidebarNav } from "../sidebar-nav";

export const Sidebar = () => {
  return (
    <div className="w-[250px] bg-gray-700 h-screen p-4">
      <div className="text-orange-500 mb-8">Video Processing System</div>
      <SidebarNav />
    </div>
  );
};
