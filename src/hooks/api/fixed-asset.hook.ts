import fixedAssetsProvider from "@/providers/http/fixed-assets";
import { useQuery } from "react-query";

export function useGetAllFixedAsset() {
  const query = useQuery({
    queryKey: ["fixed-assets"],
    retry: 1,
    queryFn: () => fixedAssetsProvider.getAll(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}

export function useGetOneFixedAsset(uuid: string) {
  const query = useQuery({
    queryKey: ["fixed-asset", uuid],
    retry: 1,
    queryFn: () => fixedAssetsProvider.getOne(uuid),
    enabled: !!uuid,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}