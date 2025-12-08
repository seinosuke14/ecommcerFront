'use client';

import { useState } from 'react';
import styles from './checkout.module.css';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: {
        nombre_cliente: string;
        metodo_pago: string;
        notas?: string
    }) => void;
    subtotal: number;
    isLoading: boolean;
}

export default function CheckoutModal({
    isOpen,
    onClose,
    onConfirm,
    subtotal,
    isLoading
}: CheckoutModalProps) {
    const [nombreCliente, setNombreCliente] = useState('');
    const [metodoPago, setMetodoPago] = useState('');
    const [notas, setNotas] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({
            nombre_cliente: nombreCliente,
            metodo_pago: metodoPago,
            notas: notas || undefined
        });
    };

    const handleClose = () => {
        if (!isLoading) {
            setNombreCliente('');
            setMetodoPago('');
            setNotas('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Finalizar Orden</h2>
                    <button
                        onClick={handleClose}
                        className={styles.closeBtn}
                        disabled={isLoading}
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="nombre">Nombre / Mesa *</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombreCliente}
                            onChange={(e) => setNombreCliente(e.target.value)}
                            placeholder="Ej: Mesa 5, Juan Pérez"
                            required
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="metodo">Método de Pago *</label>
                        <select
                            id="metodo"
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            required
                            disabled={isLoading}
                        >
                            <option value="">Seleccionar...</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="notas">Notas (opcional)</label>
                        <textarea
                            id="notas"
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            placeholder="Ej: Sin cebolla, extra picante..."
                            rows={3}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.summary}>
                        <span>Total a pagar:</span>
                        <strong>${subtotal.toLocaleString('es-CL')}</strong>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles.cancelBtn}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.confirmBtn}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Procesando...' : 'Confirmar Orden'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}