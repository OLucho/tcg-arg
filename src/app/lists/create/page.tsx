"use client"

import { X } from "lucide-react"
import { useCreateList } from "./use-create-list"

export default function CreateListPage() {
    const { formData, isLoading, error, handleChange, handleSubmit, cancelCreation } = useCreateList()

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-300 p-4">
            <div className="w-full max-w-lg bg-[#1a1d24] rounded-lg shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-base-700">
                    <h2 className="text-xl font-semibold text-white">List Settings</h2>
                    <button onClick={cancelCreation} className="btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Error message */}
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* List Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white requried">List Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input input-bordered w-full bg-[#12151c]"
                            placeholder="Enter list name"
                            required
                        />
                        <p className="text-xs text-gray-400">The list name must be between 3 and 50 characters.</p>
                    </div>

                    {/* List Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">List Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="textarea textarea-bordered w-full h-32 bg-[#12151c]"
                            placeholder="Enter list description"
                            maxLength={1000}
                        />
                        <div className="flex justify-end">
                            <span className="text-xs text-gray-400">{formData.description.length}/1000</span>
                        </div>
                    </div>

                    {/* List Privacy (como checkbox) */}
                    <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-3">
                            <input
                                type="checkbox"
                                name="isPublic"
                                checked={formData.isPublic}
                                onChange={handleChange}
                                className="checkbox checkbox-primary"
                            />
                            <span className="label-text">Make this list public</span>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-4 pt-4">
                        <button type="button" onClick={cancelCreation} className="btn btn-ghost flex-1">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`btn btn-primary flex-1`}
                            disabled={isLoading || !formData.name.trim()}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-xs">
                                    </span>
                                    Creando lista...
                                </>
                            ) : (
                                "Crear lista"
                            )}
                        </button>
                    </div>
                </form>

                {/* Logo */}
                <div className="flex justify-center p-6 border-t border-base-700">
                    <div className="text-2xl font-bold text-primary">TCG-Arg</div>
                </div>
            </div>
        </div>
    )
}

