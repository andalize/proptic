"use client";
import {getToken} from "@/lib/token";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren } from "react";
import { useEffect, useState } from "react";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    });

    const token = getToken();
    if (token) {
      router.replace("/receptionist");
    }

    return () => clearTimeout(timer);
  },[]);

  return (
    <div className="">
      <div className="">{children}</div>
    </div>
  );
};

export default AuthLayout;
