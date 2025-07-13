import assetTypesProvider from "@/providers/http/asset-types";
import { useQuery } from "react-query";

export function useGetAllAssetType() {
  const query = useQuery({
    queryKey: ["asset-types"],
    retry: 1,
    queryFn: () => assetTypesProvider.getAll(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}

export function useGetOneAssetType(uuid: string) {
  const query = useQuery({
    queryKey: ["asset-type", uuid],
    retry: 1,
    queryFn: () => assetTypesProvider.getOne(uuid),
    enabled: !!uuid,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}