"use client";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Cart from "./Cart";
import LeftNavbar from "./LeftNavbar";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Button } from "./ui/button";
import Loading from "@/app/loading";
import MyAccountNav from "./Account";

const Navbar = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const pathname = usePathname()

  const handleLogout = () => {
    if (pathname == '/') {
      toast.warning('Logout successfully')
      setTimeout(async () => {
        await signOut()

        return <Loading />
      }, 500)
    }

    if (pathname !== '/') {
      // router.push('/')
      setTimeout(async () => {
        await signOut()
        toast.warning('Logout successfully')

        return <Loading />
      }, 3000)
    }

  }

  const handleLogin = () => {
    // signIn('google');
    router.push('/login')
  }

  return (
    <div className="h-12 bg-amber-900 z-40 text-white">
      <MaxWidthWrapper className="h-12">
        <header className="h-full flex flex-row items-center justify-between">
          <div className="left">
            <LeftNavbar />
          </div>
          <div className="right flex flex-row items-center justify-between gap-5">
            {data?.user?.email ? (
              <>
                <Link
                  href="/orders"
                  className={cn(navigationMenuTriggerStyle(), "bg-amber-900")}
                >
                  Orders
                </Link>
                <span className="w-px hidden sm:flex h-5 bg-amber-700" />
                <MyAccountNav user={data?.user} />
                <span className="w-px hidden sm:flex h-5 bg-amber-700" />
                <Button
                  onClick={handleLogout}
                  className={cn(navigationMenuTriggerStyle(), "bg-amber-900 ")}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                  onClick={handleLogin}
                className={cn(navigationMenuTriggerStyle(), "bg-amber-900 ")}
              >
                Login
              </Button>
            )}
            <span className="w-px hidden sm:flex h-5 bg-amber-700" />
            <Cart />
          </div>
        </header>
      </MaxWidthWrapper>
    </div>
  );
};

export default Navbar;
