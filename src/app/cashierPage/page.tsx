'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import styles from './cashier.module.css';
import { Venta } from '@/models/venta';
import { DetalleVenta } from '@/models/detalle_venta';
import { api } from '../../../lib/api';
import { Product } from '@/models/products';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}





// ----------------------------------------------------
// --- 2. Componente Principal CashierPage ---
// ----------------------------------------------------

export default function CashierPage() {
    const { isCajero, isAdmin, user } = useAuth();




    const [activeTab, setActiveTab] = useState<'tpv' | 'pending'>('pending');

    // Estados para la Venta Directa (TPV)
    const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
    const [orderNumber, setOrderNumber] = useState(101);
    const [products, setProducts] = useState<Product[]>([]);

    // Estado para la Recepción de Pedidos (Aprobación Remota)
    const [pendingOrders, setPendingOrders] = useState<Venta[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPendingOrders();
        fetchProducts();
    }, [])

    const fetchProducts = async () => {
        try {
            const productsList = await api.json<Product[]>('/products');
            setProducts(productsList);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    const fetchPendingOrders = async () => {
        try {
            setIsLoading(true);
            const ventas = await api.json<Venta[]>('/ventas?estado=pendiente');
            setPendingOrders(ventas);
        } catch (error) {
            console.error('Error al cargar pedidos pendientes:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };


    const [openedOrderId, setOpenedOrderId] = useState<number | null>(null); // Controla el modal

    // Funciones comunes
    const formatPrice = (price: number) => price.toLocaleString('es-CL');
    const openOrderDetails = (orderId: number) => setOpenedOrderId(orderId);
    const closeOrderDetails = () => setOpenedOrderId(null);

    // ----------------------------------------------------
    // --- 3. Lógica de la Pestaña TPV (Venta Directa) ---
    // ----------------------------------------------------

    const addProductToOrder = (product: Product) => {
        setCurrentOrder(prevOrder => {
            const existingItem = prevOrder.find(item => item.id === product.id.toString());

            if (existingItem) {
                return prevOrder.map(item =>
                    item.id === product.id.toString()
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            subtotal: (item.quantity + 1) * item.price
                        }
                        : item
                );
            } else {
                return [...prevOrder, {
                    id: product.id.toString(),
                    name: product.nombre,
                    price: product.price,
                    quantity: 1,
                    subtotal: product.price
                }];
            }
        });
    };

    // Simula la eliminación de un ítem (para el botón 'X')
    const removeProduct = (id: string) => {
        setCurrentOrder(prevOrder => prevOrder.filter(item => item.id !== id));
    };

    const calculateSummary = () => {
        const subtotalRaw = currentOrder.reduce((sum, item) => sum + Number(item.subtotal), 0);
        const subtotal = Math.round(subtotalRaw);
        const taxRate = 0.19;
        const tax = Math.round(subtotal * taxRate);
        const total = Math.round(subtotal + tax);
        return { subtotal, tax, total };
    };


    const summary = calculateSummary();

    const handleCheckout = async () => {
        if (currentOrder.length === 0) {
            return alert("El pedido está vacío. Agregue productos.");
        }

        const nombreCliente = prompt("Nombre del cliente / Mesa:");
        if (!nombreCliente) return;

        const metodoPago = prompt("Método de pago (efectivo/tarjeta/transferencia):");
        if (!metodoPago) return;

        try {
            setIsLoading(true);

            // Formatear carrito para el backend
            const carrito = currentOrder.map(item => ({
                producto_id: parseInt(item.id),
                cantidad: item.quantity
            }));

            // Crear venta con estado 'pendiente'
            const result = await api.post<{ message: string; venta: Venta }>('/ventas/', {
                usuario_id: user?.id,
                nombre_cliente: nombreCliente,
                metodo_pago: metodoPago,
                notas: null,
                carrito
            });

            alert(`✅ Venta #${result.venta.id} procesada exitosamente!\nEstado: ${result.venta.estado}`);

            // Limpiar orden actual
            setCurrentOrder([]);

            // Refrescar lista de pedidos pendientes
            await fetchPendingOrders();

            // Cambiar a pestaña de pedidos pendientes para ver la nueva orden
            setActiveTab('pending');

        } catch (error: any) {
            console.error('Error al procesar venta:', error);
            const errorMessage = error?.response?.data?.error || 'Error al procesar la venta';
            alert(`❌ Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    // ----------------------------------------------------
    // --- 4. Lógica de la Pestaña Aprobación Remota ---
    // ----------------------------------------------------

    const handleAcceptOrder = async (orderId: number) => {
        // Enviar a Cocina
        try {
            await api.put(`/ventas/${orderId}`, {
                estado: 'aprobada'
            });
            setPendingOrders(prev => prev.filter(order => order.id !== orderId));
            setOpenedOrderId(null);
            alert(`Pedido #${orderId} ACEPTADO y enviado a Cocina.`);
        } catch (error: any) {
            console.error('Error al aceptar pedido:', error);
            const errorMessage = error?.response?.data?.error || 'Error al aceptar el pedido';
            alert(`❌ Error: ${errorMessage}`);
        }
    };

    const handleCancelOrder = (orderId: number) => {
        try {
            api.put(`/ventas/${orderId}`, {
                estado: 'cancelada'
            });
            setPendingOrders(prev => prev.filter(order => order.id !== orderId));
            setOpenedOrderId(null);
            alert(`Pedido #${orderId} CANCELADO.`);
        } catch (error: any) {
            console.error('Error al cancelar pedido:', error);
            const errorMessage = error?.response?.data?.error || 'Error al cancelar el pedido';
            alert(`❌ Error: ${errorMessage}`);
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
                {products.length === 0 ? (
                    <p>Cargando productos...</p>
                ) : (
                    <div className={styles.productGrid}>
                        {products.map(product => (
                            <button
                                key={product.id}
                                className={styles.productBtn}
                                onClick={() => addProductToOrder(product)}
                            >
                                <div>{product.nombre}</div>
                                <div className={styles.productPrice}>
                                    ${product.price.toLocaleString('es-CL')}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Columna 2: Ticket Activo */}
            <div className={styles.posOrder}>
                <header><h2>Ticket: Nuevo</h2></header>

                <div className={styles.orderDetails}>
                    <table className={styles.orderItemsTable}>
                        <thead>
                            <tr>
                                <th>Cant.</th>
                                <th>Producto</th>
                                <th>P. Unitario</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
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
                    <button
                        className={`${styles.actionBtn} ${styles.cancelBtn}`}
                        onClick={() => setCurrentOrder([])}
                        disabled={isLoading}
                    >
                        Limpiar Ticket
                    </button>
                    <button
                        className={`${styles.actionBtn} ${styles.checkoutBtn}`}
                        onClick={handleCheckout}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Procesando...' : 'Procesar Pago'}
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
                                    <span className={styles.orderSource}>{order.nombre_cliente}</span>
                                </div>

                                <ul className={styles.orderList}>
                                    {order.detalle_venta?.slice(0, 3).map((item, index) => (
                                        <li key={index} className={styles.orderListItem}>
                                            <span>{item.cantidad}x {item.nombre_producto}</span>
                                        </li>
                                    ))}
                                    {(order.detalle_venta?.length || 0) > 3 && (
                                        <li className={styles.summaryText}>
                                            ... ({(order.detalle_venta?.length || 0) - 3} más)
                                        </li>
                                    )}
                                </ul>

                                <div className={styles.cardFooter}>
                                    <div className={styles.totalInfo}>
                                        <p>Total:</p>
                                        <span className={styles.orderTotal}>${Math.round(order.total).toLocaleString('es-CL')}</span>
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
                            <p className={styles.modalSource}>Fuente:{openedOrder.nombre_cliente}</p>
                            <hr />

                            <div className={styles.modalItems}>
                                <h4>Productos:</h4>
                                <ul className={styles.detailList}>
                                    {openedOrder.detalle_venta?.map((item, index) => (
                                        <li key={index} className={styles.detailListItem}>
                                            <span className={styles.detailItemQty}>{item.cantidad}</span>
                                            <span className={styles.detailItemName}>{item.nombre_producto}</span>
                                            <span className={styles.detailItemPrice}>${Math.round(item.precio_unitario).toLocaleString('es-CL')} c/u</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.modalSummary}>
                                <h4>TOTAL: <span className={styles.modalTotal}>${Math.round(openedOrder.total).toLocaleString('es-CL')}</span></h4>
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