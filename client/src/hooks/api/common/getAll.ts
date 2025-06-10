import { useEffect } from "react";
import { IUnknown } from "@/interface/Iunknown";
import { useQuery } from "@tanstack/react-query";

import { IAxiosResponse, api } from "@/lib/api";
import { useQueryString } from "@/hooks/useQueryString";
// import { useSearch } from "@/hooks/useSearch";
import { fullMetaType, useMetaStore } from "@/hooks/zustand/useMetaStore";
import { pick } from "lodash";
import { onError } from "./handlers";

const fetchList = async ({
  queryKey,
}: IUnknown): Promise<IAxiosResponse["data"]> => {
  const [_key, { filter, search, endpoint, meta }] = queryKey;

  const data = (await api.get(endpoint, {
    params: { search, ...filter, ...meta },
  })) as IAxiosResponse["data"];
  return data;
};

interface FetchListType {
  queryKey: string;
  endpoint: string;
  search?: string;
  filter?: IUnknown;
  meta?: Partial<fullMetaType>;
  enabled?: boolean;
  retry?: boolean;
  showToastOnError?: boolean;
}

export const useGetList = ({
  queryKey,
  endpoint,
  filter,
  meta = {},
  enabled = true,
  retry = false,
  showToastOnError = true,
}: FetchListType) => {
  const { setData } = useMetaStore();
  const { getQueryObject } = useQueryString();
  // const { search } = useSearch();
  const defaultMeta: Partial<fullMetaType> = pick(
    {
      ...getQueryObject(["perPage", "page"]),
      ...meta,
    },
    ["page", "perPage"]
  );

  const query = useQuery({
    queryKey: [queryKey, { filter, endpoint, meta: defaultMeta }],
    queryFn: fetchList,
    enabled: enabled,
    throwOnError: showToastOnError ? (onError as any) : undefined,
    retry,
  });

  useEffect(() => {
    if (query.isSuccess) {
      setData({} as any);
    }
  }, [query.isSuccess]);

  return query;
};
