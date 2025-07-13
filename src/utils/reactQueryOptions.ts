
import { QueryClient } from "react-query";
import { toast } from "sonner";

export function getMutationOptions(
  queryClient: QueryClient,
  keyToInvalidateAll?: string | null,  
  keyToInvalidateOne?: string | null,  
  overrides?: {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
  }
) {
  return {
    onSuccess: (data: any, variables: any) => {
      variables?.uuid && queryClient.invalidateQueries([keyToInvalidateOne, variables?.uuid]);
      keyToInvalidateAll && queryClient.invalidateQueries(keyToInvalidateAll);
      toast.success('Success', {
        description: data.message,
        duration: 3000,
      })
      overrides?.onSuccess?.(data);
    },
    onError: (err: any) => {
      toast.success('Error', {
        description: err.message,
        duration: 3000,
      })
      overrides?.onError?.(err);
    },
  };
}
