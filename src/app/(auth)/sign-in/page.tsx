"use client"

import { Eye, EyeOff, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useSignIn } from "../(hooks)/useSignIn"

export default function LoginPage() {
    const { formData, errors, isLoading, showPassword, toast, handleChange, handleSubmit, togglePasswordVisibility } =
        useSignIn()

    // Función para obtener el icono del toast según el tipo
    const getToastIcon = () => {
        switch (toast.type) {
            case "success":
                return <CheckCircle className="text-success" />
            case "error":
                return <AlertCircle className="text-error" />
            case "warning":
                return <AlertTriangle className="text-warning" />
            default:
                return <Info className="text-info" />
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-300 p-4">
            <div className="max-w-md w-full bg-base-200 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Iniciar sesión</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email/Username field */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email o nombre de usuario</span>
                        </label>
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                            placeholder="Ingresa tu email o nombre de usuario"
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.email}</span>
                            </label>
                        )}
                    </div>

                    {/* Password field */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Contraseña</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`input input-bordered w-full pr-10 ${errors.password ? "input-error" : ""}`}
                                placeholder="Ingresa tu contraseña"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={togglePasswordVisibility}
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.password}</span>
                            </label>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* Submit button */}
                    <button type="submit" className={`btn btn-primary w-full`} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner loading-sm mr-2"></span>
                                Iniciando sesión...
                            </>
                        ) : (
                            "Iniciar sesión"
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <p>
                            ¿No tienes una cuenta?{" "}
                            <Link href="/sign-up" className="text-primary hover:underline">
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </form>
            </div>

            {/* Toast de DaisyUI */}
            {toast.show && (
                <div className="toast toast-end z-50">
                    <div className={`alert alert-${toast.type} flex items-center`}>
                        <div className="flex items-center gap-2">
                            {getToastIcon()}
                            <span>{toast.message}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

