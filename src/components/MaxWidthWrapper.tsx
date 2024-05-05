import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(className, "mx-auto w-full max-w-screen-xl sm:px-16 px-5")}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
