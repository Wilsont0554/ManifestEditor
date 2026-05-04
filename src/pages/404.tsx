import { useLocation } from "react-router";

export default function NotFound() {
    const location = useLocation();
    const errorMsg = location.state?.errorMsg;

    return (
        <div className="flex h-full flex-col items-center justify-center gap-4 w-full">
            <h1 className="text-6xl font-bold text-slate-900">404</h1>
            <p className="text-lg text-slate-600">Page not found</p>
            {errorMsg && <p className="text-lg text-slate-500">Detail: {errorMsg}</p>}
        </div>
    )
}