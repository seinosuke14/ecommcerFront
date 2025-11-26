'use client';

import styles from './Cart.module.css';
import { useCart } from '@/context/CartContext';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
    const { cartItems, removeFromCart, updateQuantity, subtotal } = useCart();

    return (
        <>
            {/* Overlay */}
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
                    <button className={styles.checkoutBtn}>
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </>
    );
}
