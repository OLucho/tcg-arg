"use client"

import { useState, useCallback } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
    type: ToastType
    message: string
}

export function useToast() {
    const [toast, setToast] = useState<Toast | null>(null)

    const showToast = useCallback((newToast: Toast) => {
        setToast(newToast)

        // Auto-hide toast after 3 seconds
        setTimeout(() => {
            setToast(null)
        }, 3000)
    }, [])

    const hideToast = useCallback(() => {
        setToast(null)
    }, [])

    return {
        toast,
        showToast,
        hideToast,
    }
}

