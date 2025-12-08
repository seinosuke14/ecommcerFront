'use client';

import styles from './Cart.module.css';
import { useCart } from '@/context/CartContext';
import CheckoutModal from './checkoutModal';
import { useAuth } from '@/context/AuthContext';
import { api } from '../../../lib/api';
import { useState } from 'react';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CrearVentaResponse {
    message: string;
    venta: {
        id: number;
        nombre_cliente: string;
        total: number;
        estado: string;
    };
}

export default function Cart({ isOpen, onClose }: CartProps) {
    const { cartItems, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);



    const handleFinalizarCompra = () => {
        if (cartItems.length === 0) return;
        setIsCheckoutOpen(true)
    };

    const handleConfirmarOrden = async (data: {
        nombre_cliente: string;
        metodo_pago: string;
        notas?: string;
    }) => {
        setIsLoading(true);
        try {
            const carrito = cartItems.map(item => ({
                producto_id: item.id,
                cantidad: item.quantity
            }));

            const result: CrearVentaResponse = await api.post('/ventas', {
                usuario_id: user?.id,
                nombre_cliente: data.nombre_cliente,
                metodo_pago: data.metodo_pago,
                notas: data.notas,
                carrito
            });
            console.log('✅ Venta creada:', result);
            clearCart();
            setIsCheckoutOpen(false);
            onClose();
            alert(`✅ Orden #${result.venta.id} creada exitosamente!\nEstado: ${result.venta.estado}`);

        }
        catch (error) {
            console.error('Error al crear la venta:', error);
            alert('Error al crear la venta');
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div
                className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
                onClick={onClose}
            />

            {/* Cart Sidebar */}
            <div className={`${styles.cartContainer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Tu Carrito ({cartItems.length})</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        &times;
                    </button>
                </div>

                <div className={styles.itemsList}>
                    {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                            <p>Tu carrito está vacío</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className={styles.item}>
                                <img
                                    src={item.imagenes?.[0]?.url_image || 'https://placehold.co/100'}
                                    alt={item.nombre}
                                    className={styles.itemImage}
                                />
                                <div className={styles.itemDetails}>
                                    <div>
                                        <h3 className={styles.itemName}>{item.nombre}</h3>
                                        <div className={styles.itemPrice}>
                                            ${Number(item.price).toLocaleString('es-CL', {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </div>
                                    </div>

                                    <div className={styles.itemControls}>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >-</button>
                                            <span className={styles.quantity}>{item.quantity}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >+</button>
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.footer}>
                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString('es-CL', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        })}</span>
                    </div>
                    <button
                        className={styles.checkoutBtn}
                        onClick={handleFinalizarCompra}
                        disabled={cartItems.length === 0}
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => !isLoading && setIsCheckoutOpen(false)}
                onConfirm={handleConfirmarOrden}
                subtotal={subtotal}
                isLoading={isLoading}
            />
        </>
    );
}
