"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "~/lib/auth-client"

export interface RegisterFormData {
    username: string
    email: string
    password: string
    confirmPassword: string
}

export function useRegister() {
    const router = useRouter()
    const [formData, setFormData] = useState<RegisterFormData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Partial<RegisterFormData>>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [showSuccessMessage, setShowSuccessMessage] = useState<string | boolean>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Limpiar errores al editar
        if (errors[name as keyof RegisterFormData]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        }

        if (serverError) {
            setServerError(null)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev)
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterFormData> = {}

        // Validar username
        if (!formData.username.trim()) {
            newErrors.username = "El nombre de usuario es requerido"
        } else if (formData.username.length < 3) {
            newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres"
        }

        // Validar email
        if (!formData.email.trim()) {
            newErrors.email = "El email es requerido"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El email no es válido"
        }

        // Validar password
        if (!formData.password) {
            newErrors.password = "La contraseña es requerida"
        } else if (formData.password.length < 8) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres"
        }

        // Validar confirmPassword
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }
        await signUp.email({
            email: formData.email,
            password: formData.password,
            name: formData.username,
        }, {
            onRequest: (_ctx) => {
                setIsLoading(true)
            },
            onSuccess: (_ctx) => {
                setShowSuccessMessage(true)
                setTimeout(() => {
                    router.push("/")
                }, 500)
            },
            onError: (ctx) => {
                setServerError(ctx.error.message)
                setIsLoading(false)
            },
        });
    }

    return {
        formData,
        errors,
        isLoading,
        showPassword,
        showConfirmPassword,
        serverError,
        showSuccessMessage,
        handleChange,
        handleSubmit,
        togglePasswordVisibility,
        toggleConfirmPasswordVisibility,
    }
}

