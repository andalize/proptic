import { useQuery } from "@tanstack/react-query";

import {api} from "@/lib/api";
import { useProfileStore } from "@/hooks/zustand/users/userProfile";
import { useEffect } from "react";

const fetchUser = async () => {
  const { data } = await api.get('users/logged-in-user/');

  return data;
};

export const useGetProfile = () => {
  const { setData } = useProfileStore();
  const { data, isSuccess, isLoading, isPending, error } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    if (isSuccess) {
      setData(data);
    }
  }, [isSuccess]);

  return { data, isLoading, isPending, error, isSuccess };
};
