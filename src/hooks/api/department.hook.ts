import departmentsProvider from "@/providers/http/departments";
import { useQuery } from "react-query";

export function useGetAllDepartment() {
  const query = useQuery({
    queryKey: ["departments"],
    retry: 1,
    queryFn: () => departmentsProvider.getAll(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}

export function useGetOneDepartment(uuid: string) {
  const query = useQuery({
    queryKey: ["department", uuid],
    retry: 1,
    queryFn: () => departmentsProvider.getOne(uuid),
    enabled: !!uuid,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}