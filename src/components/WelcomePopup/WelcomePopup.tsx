"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext"; // ← Importar el contexto
import styles from "./WelcomePopup.module.css";

export default function WelcomePopup() {
    const router = useRouter();
    const { isAuthenticated } = useAuth(); // ← Usar el estado del contexto
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Verificar si ya eligió en esta sesión
        const hasChosenThisSession = sessionStorage.getItem("welcome_choice_made");

        // Solo mostrar el modal si NO está autenticado Y NO ha elegido en esta sesión
        if (!isAuthenticated && !hasChosenThisSession) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            // Si está autenticado, ocultar el modal y restaurar el scroll
            setIsVisible(false);
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'unset';
            document.body.style.width = 'unset';
        };
    }, [isAuthenticated]); // ← Ejecutar cada vez que cambia isAuthenticated

    const handleClient = () => {
        document.body.style.overflow = 'unset';
        document.body.style.position = 'unset';
        document.body.style.width = 'unset';
        setIsVisible(false);
        router.push("/login");
    };

    const handleRegister = () => {
        document.body.style.overflow = 'unset';
        document.body.style.position = 'unset';
        document.body.style.width = 'unset';
        setIsVisible(false);
        router.push("/registro");
    }

    const handleVisit = () => {
        sessionStorage.setItem("welcome_choice_made", "true");
        document.body.style.overflow = 'unset';
        document.body.style.position = 'unset';
        document.body.style.width = 'unset';
        setIsVisible(false);
        router.push("/menu");
    };

    if (!isVisible || !mounted) return null;

    const modalContent = (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <h2 className={styles.title}>
                    Bienvenido
                </h2>
                <p className={styles.subtitle}>
                    Por favor selecciona una opción para continuar.
                </p>

                <div className={styles.buttonGroup}>
                    <button
                        onClick={handleClient}
                        className={styles.buttonPrimary}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Soy Cliente</span>
                    </button>
                    <button
                        onClick={handleRegister}
                        className={styles.ButtonRegister}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Me registro</span>
                    </button>

                    <button
                        onClick={handleVisit}
                        className={styles.buttonSecondary}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Entrar como Visita</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}