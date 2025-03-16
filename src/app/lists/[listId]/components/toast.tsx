"use client"

import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react"
import type { Toast as ToastType } from "../hooks/useToast"

interface ToastProps {
    toast: ToastType
    onClose: () => void
}

export default function Toast({ toast, onClose }: ToastProps) {
    const getIcon = () => {
        switch (toast.type) {
            case "success":
                return <CheckCircle className="h-5 w-5" />
            case "error":
                return <AlertCircle className="h-5 w-5" />
            case "warning":
                return <AlertTriangle className="h-5 w-5" />
            default:
                return <Info className="h-5 w-5" />
        }
    }

    return (
        <div className="toast toast-end z-50">
            <div className={`alert alert-${toast.type} flex items-center`}>
                <div className="flex items-center gap-2">
                    {getIcon()}
                    <span>{toast.message}</span>
                </div>
                <button className="btn btn-ghost btn-xs btn-circle ml-2" onClick={onClose}>
                    <X size={14} />
                </button>
            </div>
        </div>
    )
}

