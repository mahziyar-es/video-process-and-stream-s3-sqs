import { ReactNode } from "react";
import { MenuIcon } from "lucide-react";
import { Sidebar } from "../sidebar";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="">
        <div className="hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex lg:hidden h-[50px] bg-gray-700 w-full p-4 items-center justify-between">
          <div className="text-sm text-orange-500">Video Processing System</div>
          <Sheet>
            <SheetTrigger>
              <MenuIcon className="text-white cursor-pointer" />
            </SheetTrigger>
            <SheetContent className="p-0 w-fit">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex-1 h-screen container py-4">{children}</div>
    </div>
  );
};
