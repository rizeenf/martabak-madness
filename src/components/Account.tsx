"use client";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { User as UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { User } from "@/config/type";
import Image from "next/image";

const MyAccountNav = ({ user }: { user: any }) => {
  // const { signOut } = useAuth();
  const { data, status } = useSession();


  console.log({ user })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="relative gap-2">
          <UserIcon size={16} />
          Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-white">
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
        <DropdownMenuItem asChild>
          <Link href={"/settings"}>Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/sell"}>Seller dashboard</Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
          Log out
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MyAccountNav;