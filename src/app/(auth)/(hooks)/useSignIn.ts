"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "~/lib/auth-client"
import { useSession } from "./useSession"

// Tipos para el hook
export interface SignInFormData {
    email: string
    password: string
}

export interface SignInErrors {
    email?: string
    password?: string
}

export interface ToastState {
    show: boolean
    message: string
    type: "success" | "error" | "info" | "warning"
}

export function useSignIn() {
    const router = useRouter()
    const { refetchSession } = useSession()
    const [formData, setFormData] = useState<SignInFormData>({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState<SignInErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: "",
        type: "info",
    })

    // Función para mostrar toast
    const showToast = (message: string, type: ToastState["type"] = "info") => {
        setToast({
            show: true,
            message,
            type,
        })

        // Auto-hide toast after 3 seconds
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }))
        }, 3000)
    }

    // Manejo de cambios en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Limpiar errores al editar
        if (errors[name as keyof SignInErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        }
    }

    // Función para mostrar/ocultar contraseña
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    // Validación del formulario
    const validateForm = (): boolean => {
        const newErrors: SignInErrors = {}

        // Validar email o username
        if (!formData.email.trim()) {
            newErrors.email = "Ingresa tu email o nombre de usuario"
        }

        // Validar password
        if (!formData.password) {
            newErrors.password = "La contraseña es requerida"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Manejo del envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }
        await signIn.email({
            email: formData.email,
            password: formData.password,
        }, {
            onError(context) {
                showToast(context.error.message, "error")
                setIsLoading(false)
            },
            onRequest() {
                setIsLoading(true)
            },
            async onSuccess() {
                showToast("Inicio de sesión exitoso", "success")
                await refetchSession()
                setTimeout(() => {
                    router.push("/")
                }, 1000)
            }
        })
    }

    return {
        formData,
        errors,
        isLoading,
        showPassword,
        toast,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        showToast,
    }
}

