import { Bounce, ToastContainer } from "react-toastify"

type showMessageProps = {
    children: React.ReactNode
}

export function ShowMessage({ children }: showMessageProps) {
    return <>
        {children}
        <ToastContainer
            position="top-center"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
        />
    </>
}