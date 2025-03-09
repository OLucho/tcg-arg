"use client"

import { useState, useEffect } from "react"

export interface ApiList {
    id: string
    name: string
    description?: string
    isPublic: boolean
    createdAt: string
    updatedAt: string
    userId: string
}

export interface List extends ApiList {
    cardCount: number
    completionPercentage: number
    isFavorite?: boolean
    lastUpdated: string
}

export interface Notification {
    message: string
    type: "success" | "error" | "info" | "warning"
}

export function useLists(initialLists: ApiList[]) {
    // Transform API lists to our internal format with additional properties
    const transformLists = (apiLists: ApiList[]): List[] => {
        return apiLists.map((list) => ({
            ...list,
            cardCount: Math.floor(Math.random() * 150), // Mock data
            completionPercentage: Math.floor(Math.random() * 100), // Mock data
            isFavorite: false,
            lastUpdated: list.updatedAt,
        }))
    }

    const [lists, setLists] = useState<List[]>(() => transformLists(initialLists))
    const [notification, setNotification] = useState<Notification | null>(null)

    // Update lists when initialLists changes
    useEffect(() => {
        setLists(transformLists(initialLists))
    }, [initialLists])

    // Effect to clear notification after 3 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [notification])

    const showNotification = (message: string, type: Notification["type"] = "info") => {
        setNotification({ message, type })
    }

    const toggleFavorite = (listId: string) => {
        setLists((currentLists) =>
            currentLists.map((list) => (list.id === listId ? { ...list, isFavorite: !list.isFavorite } : list)),
        )
    }

    const deleteList = (listId: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar esta lista?")) {
            setLists((currentLists) => {
                // Find the list name before deleting it
                const listToDelete = currentLists.find((list) => list.id === listId)
                const listName = listToDelete?.name || "Lista"

                const updatedLists = currentLists.filter((list) => list.id !== listId)

                // Show notification
                showNotification(`"${listName}" ha sido eliminada correctamente`, "success")

                return updatedLists
            })
        }
    }

    return {
        lists,
        notification,
        toggleFavorite,
        deleteList,
        showNotification,
    }
}

