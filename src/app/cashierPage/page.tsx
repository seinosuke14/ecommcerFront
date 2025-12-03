'use client';

import { useState } from 'react';
import { useAuth } from "@/context/AuthContext"; // Asume que este contexto está disponible
import styles from './cashier.module.css';

// ----------------------------------------------------
// --- 1. Definiciones de Tipos y Mock Data ---
// ----------------------------------------------------

// Tipo para el Pedido Activo (Venta Directa)
interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

// Tipo para Pedidos Pendientes (Aprobación Remota)
interface PendingOrder {
    id: number;
    source: string; // Ej: 'Mesa 5', 'Online #123'
    items: { name: string; quantity: number; price: number }[];
    total: number;
    status: 'pending' | 'accepted' | 'cancelled';
}

// Data de Prueba para la Venta Directa (TPV)
const mockProducts = [
    { id: '1', name: 'Hamburguesa Clásica', price: 12.50 },
    { id: '2', name: 'Papas Fritas', price: 8.00 },
    { id: '3', name: 'Coca Cola', price: 3.50 },
    { id: '4', name: 'Sopa del Día', price: 6.00 },
];

// Data de Prueba para la Aprobación Remota
const mockPendingOrders: PendingOrder[] = [
    {
        id: 201,
        source: 'Mesa 12',
        items: [
            { name: 'Ensalada César', quantity: 1, price: 9.50 },
            { name: 'Agua Mineral', quantity: 2, price: 2.00 }
        ],
        total: 13.50,
        status: 'pending'
    },
    {
        id: 202,
        source: 'Online #124',
        items: [
            { name: 'Pizza Pepperoni', quantity: 1, price: 18.00 },
            { name: 'Cerveza Artesanal', quantity: 3, price: 5.50 }
        ],
        total: 34.50,
        status: 'pending'
    },
];

// ----------------------------------------------------
// --- 2. Componente Principal CashierPage ---
// ----------------------------------------------------

export default function CashierPage() {
    const { isCajero, isAdmin } = useAuth(); // Asume que se usa para permisos, aunque no lo aplicamos aquí.

    console.log("rol?", isCajero, isAdmin)
    // Control de la vista: 'pending' = Aprobación Remota, 'tpv' = Venta Directa
    const [activeTab, setActiveTab] = useState<'tpv' | 'pending'>('pending');

    // Estados para la Venta Directa (TPV)
    const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
    const [orderNumber, setOrderNumber] = useState(101);

    // Estado para la Recepción de Pedidos (Aprobación Remota)
    const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>(mockPendingOrders);
    const [openedOrderId, setOpenedOrderId] = useState<number | null>(null); // Controla el modal

    // Funciones comunes
    const formatPrice = (price: number) => price.toFixed(2);
    const openOrderDetails = (orderId: number) => setOpenedOrderId(orderId);
    const closeOrderDetails = () => setOpenedOrderId(null);

    // ----------------------------------------------------
    // --- 3. Lógica de la Pestaña TPV (Venta Directa) ---
    // ----------------------------------------------------

    const addProductToOrder = (id: string, name: string, price: number) => {
        setCurrentOrder(prevOrder => {
            const existingItem = prevOrder.find(item => item.id === id);

            if (existingItem) {
                return prevOrder.map(item =>
                    item.id === id
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
                        : item
                );
            } else {
                return [...prevOrder, { id, name, price, quantity: 1, subtotal: price }];
            }
        });
    };

    // Simula la eliminación de un ítem (para el botón 'X')
    const removeProduct = (id: string) => {
        setCurrentOrder(prevOrder => prevOrder.filter(item => item.id !== id));
    };

    const calculateSummary = () => {
        const subtotal = currentOrder.reduce((sum, item) => sum + item.subtotal, 0);
        const taxRate = 0.19;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        return { subtotal, tax, total };
    };

    const summary = calculateSummary();

    const handleCheckout = () => {
        if (currentOrder.length === 0) return alert("El pedido está vacío. Agregue productos.");
        const isConfirmed = window.confirm(`Confirmar Venta Directa #${orderNumber} por $${summary.total.toFixed(2)}? (Este pedido se envía a Cocina)`);

        if (isConfirmed) {
            // Lógica para enviar el pedido (API POST) al sistema y a cocina.
            alert(`Venta Directa #${orderNumber} procesada y enviada a cocina.`);
            setCurrentOrder([]);
            setOrderNumber(prev => prev + 1);
        }
    };

    // ----------------------------------------------------
    // --- 4. Lógica de la Pestaña Aprobación Remota ---
    // ----------------------------------------------------

    const handleAcceptOrder = (orderId: number) => {
        // Enviar a Cocina
        setPendingOrders(prev => prev.filter(order => order.id !== orderId));
        setOpenedOrderId(null);
        alert(`Pedido #${orderId} ACEPTADO y enviado a Cocina.`);
    };

    const handleCancelOrder = (orderId: number) => {
        const reason = prompt(`Razón para cancelar pedido #${orderId}:`);
        if (reason) {
            setPendingOrders(prev => prev.filter(order => order.id !== orderId));
            setOpenedOrderId(null);
            alert(`Pedido #${orderId} CANCELADO. Razón: ${reason}`);
        }
    };

    // ----------------------------------------------------
    // --- 5. MÓDULOS DE RENDERIZADO ---
    // ----------------------------------------------------

    // MÓDULO 1: Venta Directa (TPV de Dos Columnas)
    const TPVModule = () => (
        <div className={styles.posContainer}>
            {/* Columna 1: Menú de Productos */}
            <div className={styles.posMenu}>
                <h3>🛒 Menú para Venta Directa</h3>
                <div className={styles.productGrid}>
                    {mockProducts.map(product => (
                        <button
                            key={product.id}
                            className={styles.productBtn}
                            onClick={() => addProductToOrder(product.id, product.name, product.price)}
                        >
                            {product.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Columna 2: Ticket Activo */}
            <div className={styles.posOrder}>
                <header><h2>Ticket: #{orderNumber}</h2></header>

                <div className={styles.orderDetails}>
                    <table className={styles.orderItemsTable}>
                        <thead>
                            <tr><th>Cant.</th><th>Producto</th><th>P. Unitario</th><th>Subtotal</th><th></th></tr>
                        </thead>
                        <tbody>
                            {currentOrder.map(item => (
                                <tr key={item.id}>
                                    <td>{item.quantity}</td>
                                    <td>{item.name}</td>
                                    <td>${formatPrice(item.price)}</td>
                                    <td>${formatPrice(item.subtotal)}</td>
                                    <td>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeProduct(item.id)}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.orderSummary}>
                    <p>Subtotal: <span>${formatPrice(summary.subtotal)}</span></p>
                    <p>IVA (19%): <span>${formatPrice(summary.tax)}</span></p>
                    <h3>Total: <span>${formatPrice(summary.total)}</span></h3>
                </div>

                <div className={styles.orderActions}>
                    <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={() => setCurrentOrder([])}>Limpiar Ticket</button>
                    <button className={`${styles.actionBtn} ${styles.checkoutBtn}`} onClick={handleCheckout}>
                        Procesar Pago
                    </button>
                </div>
            </div>
        </div>
    );

    // MÓDULO 2: Aprobación Remota (Bandeja de Entrada)
    const ApprovalModule = () => {
        const openedOrder = pendingOrders.find(order => order.id === openedOrderId);

        return (
            <div className={styles.approvalContainer}>
                <h2 className={styles.approvalTitle}>📋 Pedidos Remotos Pendientes ({pendingOrders.length})</h2>

                <div className={styles.ordersGrid}>
                    {/* Tarjetas de pedidos pendientes (Simulación de nota de compra) */}
                    {pendingOrders.length === 0 ? (
                        <p className={styles.noOrdersMessage}>🎉 No hay pedidos pendientes de aprobación.</p>
                    ) : (
                        pendingOrders.map(order => (
                            <div
                                key={order.id}
                                className={styles.orderCard}
                                // Abre el modal de detalle al hacer clic en la tarjeta
                                onClick={() => openOrderDetails(order.id)}
                            >
                                <div className={styles.cardHeader}>
                                    <h4>Pedido Remoto #{order.id}</h4>
                                    <span className={styles.orderSource}>{order.source}</span>
                                </div>

                                <ul className={styles.orderList}>
                                    {order.items.slice(0, 3).map((item, index) => (
                                        <li key={index} className={styles.orderListItem}>
                                            <span>{item.quantity}x {item.name}</span>
                                        </li>
                                    ))}
                                    {order.items.length > 3 && <li className={styles.summaryText}>... ({order.items.length - 3} más)</li>}
                                </ul>

                                <div className={styles.cardFooter}>
                                    <div className={styles.totalInfo}>
                                        <p>Total:</p>
                                        <span className={styles.orderTotal}>${order.total.toFixed(2)}</span>
                                    </div>
                                    <button className={styles.openDetailBtn}>Ver Detalle</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* --- MODAL / DETALLE DEL PEDIDO ABIERTO --- */}
                {openedOrder && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.orderDetailModal}>
                            <button className={styles.closeModalBtn} onClick={closeOrderDetails}>&times;</button>
                            <h3>Detalle del Pedido #{openedOrder.id}</h3>
                            <p className={styles.modalSource}>Fuente: **{openedOrder.source}**</p>
                            <hr />

                            <div className={styles.modalItems}>
                                <h4>Productos:</h4>
                                <ul className={styles.detailList}>
                                    {openedOrder.items.map((item, index) => (
                                        <li key={index} className={styles.detailListItem}>
                                            <span className={styles.detailItemQty}>**{item.quantity}x**</span>
                                            <span className={styles.detailItemName}>{item.name}</span>
                                            <span className={styles.detailItemPrice}>${item.price.toFixed(2)} c/u</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.modalSummary}>
                                <h4>TOTAL: <span className={styles.modalTotal}>${openedOrder.total.toFixed(2)}</span></h4>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    className={`${styles.actionBtn} ${styles.approveBtn}`}
                                    onClick={() => handleAcceptOrder(openedOrder.id)}
                                >
                                    ✅ Aceptar Pedido
                                </button>
                                <button
                                    className={`${styles.actionBtn} ${styles.rejectBtn}`}
                                    onClick={() => handleCancelOrder(openedOrder.id)}
                                >
                                    ❌ Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (!isCajero && !isAdmin) {
        return (
            <div className={styles.accessDenied}>
                <h2>🚫 Acceso Denegado</h2>
                <p>Tu rol no tiene permiso para acceder a la terminal de Caja.</p>
                <p>Por favor, contacta al administrador del sistema.</p>
            </div>
        );
    }
    // ----------------------------------------------------
    // --- 6. Renderizado Final con Pestañas ---
    // ----------------------------------------------------
    if (isCajero || isAdmin) {
        return (
            <div className={styles.posContainerWrapper}>
                <div className={styles.tabsContainer}>
                    {/* Pestaña de Aprobación (Recibir Pedidos) */}
                    <button
                        className={`${styles.tabButton} ${activeTab === 'pending' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Recibir Pedidos ({pendingOrders.length})
                    </button>
                    {/* Pestaña de Venta Directa (Hacer Pedido) */}
                    <button
                        className={`${styles.tabButton} ${activeTab === 'tpv' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('tpv')}
                    >
                        Hacer Pedido (Venta Directa)
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'pending' && <ApprovalModule />}
                    {activeTab === 'tpv' && <TPVModule />}
                </div>
            </div>
        );
    }
}