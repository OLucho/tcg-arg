"use client"

import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRegister } from "../(hooks)/useRegister"

export default function RegisterPage() {
    const {
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
    } = useRegister()

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-300 p-4">
            <div className="max-w-md w-full bg-base-200 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Crear cuenta</h1>

                {/* Mensaje de error del servidor */}
                {serverError && (
                    <div className="alert alert-error mb-6 shadow-lg">
                        <div className="flex items-center">
                            <AlertCircle className="h-6 w-6 mr-2" />
                            <span>{serverError}</span>
                        </div>
                    </div>
                )}

                {/* Mensaje de éxito */}
                {showSuccessMessage && (
                    <div className="alert alert-success mb-6 shadow-lg">
                        <div className="flex items-center">
                            <CheckCircle className="h-6 w-6 mr-2" />
                            <span>¡Tu cuenta ha sido creada con éxito! Te redireccionaremos al home</span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username field */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Nombre de usuario</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
                            placeholder="Ingresa tu nombre de usuario"
                            disabled={isLoading}
                        />
                        {errors.username && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.username}</span>
                            </label>
                        )}
                    </div>

                    {/* Email field */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                            placeholder="Ingresa tu email"
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

                    {/* Confirm Password field */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Confirmar contraseña</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`input input-bordered w-full pr-10 ${errors.confirmPassword ? "input-error" : ""}`}
                                placeholder="Confirma tu contraseña"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={toggleConfirmPasswordVisibility}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <label className="label">
                                <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                            </label>
                        )}
                    </div>

                    {/* Submit button */}
                    <button type="submit" className={`btn btn-primary w-full`} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner loading-xs"></span>
                                Registrando...
                            </>
                        ) : (
                            "Registrarse"
                        )}
                    </button>

                    <div className="text-center mt-4">
                        <p>
                            ¿Ya tienes una cuenta?{" "}
                            <Link href="/sign-in" className="text-primary hover:underline">
                                Iniciar sesión
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

