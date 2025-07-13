import employeesProvider from "@/providers/http/employees";
import {
    ICreateEmployee,
    IUpdateEmployee,
} from "@/providers/http/employees/interface";
import { getMutationOptions } from "@/utils/reactQueryOptions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateEmployee(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ICreateEmployee) => employeesProvider.create(data),
    getMutationOptions(queryClient, "employees", null, {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useUpdateEmployee(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ uuid, data }: { uuid: string; data: IUpdateEmployee }) =>
      employeesProvider.update(uuid, data),
    getMutationOptions(queryClient, "employees", "employee", {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useDeleteEmployee(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (uuid: string) => employeesProvider.destroy(uuid),
    getMutationOptions(queryClient, "employees", "employee", {
      onSuccess: onSuccessCallback,
    })
  );
}
