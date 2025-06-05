import { IUnknown } from "@/interface/Iunknown";
import { toast } from "sonner";

export function onError(error: IUnknown) {
  if (!error?.response && error?.code === "ERR_NETWORK")
    toast("Error ❌", {
      description: "No internet connection",
    });
  else
    toast("Error ❌", {
      description:
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong",
    });
}
