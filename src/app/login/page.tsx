'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { useState } from 'react';
import { api } from '../../../lib/api';
import { useAuth } from '@/context/AuthContext';

interface FormData {
    correo: string;
    contraseña: string;
}

interface FormErrors {
    correo?: string;
    contraseña?: string;
    general?: string;
}

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    // Estado del formulario
    const [formData, setFormData] = useState<FormData>({
        correo: '',
        contraseña: ''
    });

    // Estado de errores
    const [errors, setErrors] = useState<FormErrors>({});

    // Estado de loading
    const [isLoading, setIsLoading] = useState(false);

    // Estado de "recordarme"
    const [rememberMe, setRememberMe] = useState(false);

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

        // Validar email
        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'Formato de correo inválido';
        }

        // Validar contraseña
        if (!formData.contraseña) {
            newErrors.contraseña = 'La contraseña es requerida';
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
            // Enviar datos a la API
            const response = await api.post<{
                message: string;
                user: {
                    id: number;
                    name: string;
                    correo: string;
                    rol: string;
                }
            }>('/users/login', {
                correo: formData.correo,
                contraseña: formData.contraseña
            });

            // Guardar datos del usuario usando el contexto
            const user = response.user;
            login(user, rememberMe);


            alert('¡Login exitoso!');


            let redirectPath = '/'; // Ruta por defecto

            switch (user.rol) {
                case 'admin':
                    redirectPath = '/'; // Módulo de configuración principal
                    break;
                case 'cajero':
                    redirectPath = '/cashierPage'; // Módulo de TPV que acabamos de terminar
                    break;
                case 'cocina':
                    redirectPath = '/kitchen'; // Página del KDS (el siguiente paso)
                    break;
                case 'mesero':
                    redirectPath = '/tables'; // Módulo de gestión de mesas/pedidos
                    break;
                default:
                    redirectPath = '/'; // Ruta por defecto para roles desconocidos/clientes
            }
            router.push(redirectPath);
        } catch (error: any) {
            // Manejar errores de la API
            if (error.response?.data?.error) {
                setErrors({ general: error.response.data.error });
            } else {
                setErrors({ general: 'Error al iniciar sesión. Intenta de nuevo.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Bienvenido</h1>
                    <p className={styles.subtitle}>Ingresa a tu cuenta para continuar</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Error general */}
                    {errors.general && (
                        <div className={styles.errorGeneral}>
                            {errors.general}
                        </div>
                    )}

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

                    {/* Contraseña */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="contraseña" className={styles.label}>Contraseña</label>
                        <input
                            type="password"
                            id="contraseña"
                            name="contraseña"
                            className={`${styles.input} ${errors.contraseña ? styles.inputError : ''}`}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            value={formData.contraseña}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.contraseña && <span className={styles.error}>{errors.contraseña}</span>}
                    </div>

                    {/* Opciones */}
                    <div className={styles.options}>
                        <label className={styles.remember}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isLoading}
                            />
                            <span>Recordarme</span>
                        </label>
                        <Link href="/forgot-password" className={styles.forgotPassword}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className={styles.footer}>
                    ¿No tienes una cuenta?
                    <Link href="/registro" className={styles.link}>
                        Regístrate
                    </Link>
                </div>
            </div>
        </div>
    );
}