import depreciationCalculationsProvider from "@/providers/http/depreciation-calculations";
import { useQuery } from "react-query";

export function useGetAllDepreciationCalculation() {
  const query = useQuery({
    queryKey: ["depreciation-calculations"],
    retry: 1,
    queryFn: () => depreciationCalculationsProvider.getAll(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}

export function useGetOneDepreciationCalculation(uuid: string) {
  const query = useQuery({
    queryKey: ["depreciation-calculation", uuid],
    retry: 1,
    queryFn: () => depreciationCalculationsProvider.getOne(uuid),
    enabled: !!uuid,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}