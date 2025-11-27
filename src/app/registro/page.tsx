'use client'; // ⬅️ 1. Agregar esta directiva al inicio

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ⬅️ 2. Cambiar 'next/router' por 'next/navigation'
import styles from './registro.module.css';
import { useState } from 'react';
import { api } from '../../../lib/api';

interface FormData {
    name: string;
    correo: string;
    contraseña: string;
    confirmPassword: string;
}

interface FormErrors {
    name?: string;
    correo?: string;
    contraseña?: string;
    confirmPassword?: string;
    general?: string;
}

export default function RegistroPage() {
    const router = useRouter();

    // Estado del formulario
    const [formData, setFormData] = useState<FormData>({
        name: '',
        correo: '',
        contraseña: '',
        confirmPassword: ''
    });

    // Estado de errores
    const [errors, setErrors] = useState<FormErrors>({});

    // Estado de loading
    const [isLoading, setIsLoading] = useState(false);

    // Manejar cambios en los inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Validaciones del lado del cliente
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validar nombre
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        // Validar email
        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'Formato de correo inválido';
        }

        // Validar contraseña
        if (!formData.contraseña) {
            newErrors.contraseña = 'La contraseña es requerida';
        } else if (formData.contraseña.length < 6) {
            newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar tu contraseña';
        } else if (formData.contraseña !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Limpiar errores previos
        setErrors({});

        // Validar formulario
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Enviar datos a la API (sin confirmPassword)
            const response = await api.post('/users/register', {
                name: formData.name,
                correo: formData.correo,
                contraseña: formData.contraseña,
                rol: 'cliente' // Rol por defecto
            });

            // Si el registro es exitoso, redirigir al login
            alert('¡Registro exitoso! Ahora puedes iniciar sesión');
            router.push('/login');

        } catch (error: any) {
            // Manejar errores de la API
            if (error.response?.data?.error) {
                setErrors({ general: error.response.data.error });
            } else {
                setErrors({ general: 'Error al registrar usuario. Intenta de nuevo.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Crear Cuenta</h1>
                    <p className={styles.subtitle}>Únete a nosotros y empieza a comprar</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Error general */}
                    {errors.general && (
                        <div className={styles.errorGeneral}>
                            {errors.general}
                        </div>
                    )}

                    {/* Nombre */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                            placeholder="Juan Pérez"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.name && <span className={styles.error}>{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="correo" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="correo"
                            name="correo"
                            className={`${styles.input} ${errors.correo ? styles.inputError : ''}`}
                            placeholder="nombre@ejemplo.com"
                            autoComplete="email"
                            value={formData.correo}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.correo && <span className={styles.error}>{errors.correo}</span>}
                    </div>

                    {/* Contraseñas */}
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="contraseña" className={styles.label}>Contraseña</label>
                            <input
                                type="password"
                                id="contraseña"
                                name="contraseña"
                                className={`${styles.input} ${errors.contraseña ? styles.inputError : ''}`}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={formData.contraseña}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.contraseña && <span className={styles.error}>{errors.contraseña}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirmar</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div className={styles.footer}>
                    ¿Ya tienes una cuenta?
                    <Link href="/login" className={styles.link}>
                        Inicia Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}