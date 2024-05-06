import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen h-full flex items-center justify-center">
      <LoaderCircle className="w-8 h-8 animate-spin mr-1 opacity-50" />
    </div>
  );
};

export default Loading;
