"use client";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const MyAccountNav = ({ user }: { user: any }) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="relative gap-2">
          <UserIcon size={16} />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-white">
        <div className="flex relative items-center justify-start gap-2 p-2 ">
          <div className="flex space-y-0.5 leading-none items-center">
            <div className="relative aspect-square h-[3rem] w-[3rem] min-w-fit overflow-hidden rounded-full">
              <Image
                src={user.image}
                alt="Martabak"
                fill
                className="absolute object-cover"
              />
            </div>
            <span className="text-sm font-medium text-black ml-2">{user.name}</span>
          </div>
        </div>
        <div className="flex relative items-center justify-start gap-2 p-2 ">
          <div className="flex space-y-0.5 leading-none">
            <span className="text-sm font-medium text-black">{user.email}</span>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          Akun
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="ml-2">
          <Link href={"/settings"}>Pengaturan</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          Seller
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="ml-2">
          <Link href={"/sell"}>Dashboard</Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
          Log out
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MyAccountNav;