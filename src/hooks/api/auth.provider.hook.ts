import authProvider from "@/providers/http/auth";
import { useQuery } from "react-query";

export function useMe() {
  const query = useQuery({
    queryKey: ["me"],
    retry: 1,
    queryFn: () => authProvider.me(),
  });

  return {
    ...query,
    data: query.data?.data,
  };
}
