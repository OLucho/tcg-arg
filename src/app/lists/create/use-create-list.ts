"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { useSession } from "~/app/(auth)/(hooks)/useSession"
import { createListServerAction } from "./create-list-server-action"

interface ListFormData {
    name: string
    description: string
    isPublic: boolean
}


export function useCreateList() {
    const router = useRouter()
    const { session } = useSession()
    const [formData, setFormData] = useState<ListFormData>({
        name: "",
        description: "",
        isPublic: true,
    })

    const createListMutation = useMutation({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        mutationFn: async (data: ListFormData) => createListServerAction({
            ...data,
            userId: session!.data!.user.id
        }),
        onSuccess: () => {
            router.push(`/lists/`)
        },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            return false
        }

        if (formData.name.length < 3) {
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        // Ejecutar la mutación con los datos del formulario
        createListMutation.mutate(formData)
    }

    const cancelCreation = () => {
        router.back()
    }

    return {
        formData,
        isLoading: createListMutation.isPending,
        error: createListMutation.error ? createListMutation.error.message : null,
        handleChange,
        handleSubmit,
        cancelCreation,
    }
}

