import { toast } from "react-toastify";

export const showMessage = {
    sucess: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    warn: (message: string) => toast.warn(message),
    info: (message: string) => toast.info(message),
    dismiss: () => toast.dismiss(),
}