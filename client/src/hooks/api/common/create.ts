import { baseApiType, createPayloadType } from "@/interface/api";
import { IUnknown } from "@/interface/Iunknown";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { onError } from "./handlers";
import { ReactNode } from "react";

interface paramsInterface {
  data: IUnknown;
  callbackOnSuccess?: () => void;
  successMessage?: string | ReactNode;
}
async function createEntity(endpoint: string, data: IUnknown) {
  try {
    const response = await api.post(endpoint, data);
    return response;
  } catch (error) {
    console.error(`API error from ${endpoint}:`, error);
    throw error;
  }
}
export const useCreateMutation = ({
  queryKey,
  endpoint,
  Entity,
  showToast = true,
  showErrorToast = true,
  onError: onErrorCallback,
}: baseApiType) =>
  useMutation({
    mutationKey: [queryKey],
    mutationFn: ({ data }: paramsInterface) => createEntity(endpoint, data),
    onSuccess: (respData, { onSuccess }: createPayloadType) => {
      if (showToast) {
        toast(
          onSuccess?.message
            ? `${onSuccess?.message} ✅`
            : `${Entity} created ✅`,
          {
            description: "Operation completed successfully.",
          }
        );
      }
      if (onSuccess?.callback) {
        try {
          onSuccess.callback(respData);
        } catch (callbackError) {
          console.error("Error in success callback:", callbackError);
        }
      }
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      if (showErrorToast) {
        onError(error);
      } else if (onErrorCallback) {
        onErrorCallback(error);
      }
    },
  });
