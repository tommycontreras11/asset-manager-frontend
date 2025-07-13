import inventoryTypesProvider from "@/providers/http/inventory-types";
import { useQuery } from "react-query";

export function useGetAllInventoryType() {
  const query = useQuery({
    queryKey: ["inventory-types"],
    retry: 1,
    queryFn: () => inventoryTypesProvider.getAll(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}

export function useGetOneInventoryType(uuid: string) {
  const query = useQuery({
    queryKey: ["inventory-type", uuid],
    retry: 1,
    queryFn: () => inventoryTypesProvider.getOne(uuid),
    enabled: !!uuid,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}