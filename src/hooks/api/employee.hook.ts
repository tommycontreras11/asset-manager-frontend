import employeesProvider from "@/providers/http/employees";
import { useQuery } from "react-query";

export function useGetAllEmployee() {
  const query = useQuery({
    queryKey: ["employees"],
    retry: 1,
    queryFn: () => employeesProvider.getAll(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}

export function useGetOneEmployee(uuid: string) {
  const query = useQuery({
    queryKey: ["employee", uuid],
    retry: 1,
    queryFn: () => employeesProvider.getOne(uuid),
    enabled: !!uuid,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}