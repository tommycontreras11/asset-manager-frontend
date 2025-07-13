import departmentsProvider from "@/providers/http/departments";
import {
    ICreateDepartment,
    IUpdateDepartment,
} from "@/providers/http/departments/interface";
import { getMutationOptions } from "@/utils/reactQueryOptions";
import { useMutation, useQueryClient } from "react-query";

export function useCreateDepartment(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (data: ICreateDepartment) => departmentsProvider.create(data),
    getMutationOptions(queryClient, "departments", null, {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useUpdateDepartment(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ uuid, data }: { uuid: string; data: IUpdateDepartment }) =>
      departmentsProvider.update(uuid, data),
    getMutationOptions(queryClient, "departments", "department", {
      onSuccess: onSuccessCallback,
    })
  );
}

export function useDeleteDepartment(onSuccessCallback: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation(
    (uuid: string) => departmentsProvider.destroy(uuid),
    getMutationOptions(queryClient, "departments", "department", {
      onSuccess: onSuccessCallback,
    })
  );
}
