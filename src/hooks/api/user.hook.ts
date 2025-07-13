import usersProvider from "@/providers/http/users";
import { useQuery } from "react-query";

export function useGetAllUser() {
  const query = useQuery({
    queryKey: ["users"],
    retry: 1,
    queryFn: () => usersProvider.getAll(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}

export function useGetOneUser(uuid: string) {
  const query = useQuery({
    queryKey: ["user", uuid],
    retry: 1,
    queryFn: () => usersProvider.getOne(uuid),
    enabled: !!uuid,
  });

  return {
    ...query,
    data: query.data?.data,
  };
}