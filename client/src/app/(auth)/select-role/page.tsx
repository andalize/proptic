"use client";
import { Button } from '@/components/ui/button';
import { Loader } from "@/components/custom/common/loader";
import { useGetProfile } from "@/hooks/api/users/profile";
// import { getBearToken } from "@/lib/token";

import Image from "next/image";
import { useRouter } from "next/navigation";

// const roleMapping: Record<string, string> = {
//   receptionist: "/receptionist",
//   manager: "/manager",
//   tenant: "/tenant"
// };

export default function SelectRole() {
  const router = useRouter();
  const { data, isLoading } = useGetProfile();

  const onRoleSelected = (role: string) => {
    router.push(`/${role}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 w-full min-h-screen shadow-lg overflow-hidden bg-white">
        <div className="hidden lg:block lg:col-span-7 bg-gray-100 h-full relative">
          <Image
            src="/images/penthouse-1.jpg"
            alt="select-role-cover-photo"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-90"></div>
          <h2 className="absolute top-8 left-8 text-white text-4xl font-bold z-10">
            Proptic
          </h2>
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-white text-1xl lg:text-2xl font-semibold text-center">
              Property management made easy
            </span>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-center p-8 h-full">
          <div className="w-full max-w-md mx-auto">
            
            <h1 className="text-2xl font-semibold text-center mb-8">
              Select role
            </h1>
            
            {isLoading && (
              <div className="flex items-center justify-center p-6">
                <Loader className="h-12 w-12" />
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-4">
              {(data?.user?.roles || []).map((role: any) => (
                <Button
                  key={role.name}
                  variant="outline"
                  className="h-16 justify-start px-4 hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  onClick={() => onRoleSelected(role.name)}
                >
                  {role.display_name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
