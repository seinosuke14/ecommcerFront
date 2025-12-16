'use client';

import { useEffect, useState, ReactNode } from 'react';
import { api } from '../../../lib/api';
import { Venta } from '@/models/venta';
import { DetalleVenta } from '@/models/detalle_venta';
import styles from './kitchen.module.css';
import Link from 'next/link';

export default function KitchenPage() {
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = () => {
        setLoading(true);
        // Fetch ALL orders so we can filter by 'aprobada' AND 'espera'
        api.json<Venta[]>('/ventas')
            .then((data) => {
                setVentas(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch orders", err);
                setVentas([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders
    const newOrders = ventas.filter(o => o.estado === 'aprobada');
    const prepOrders = ventas.filter(o => o.estado === 'espera');

    const cancelOrders = async (orderId: number) => {
        try {
            await api.put(`/ventas/${orderId}`, {
                estado: 'cancelada'
            });
            alert(`Pedido #${orderId} CANCELADO.`);
            fetchOrders();
        } catch (error) {
            console.error("Failed to cancel order", error);
            alert("Error cancelling order");
        }
    }

    const acceptOrders = async (orderId: number) => {
        try {
            await api.put(`/ventas/${orderId}`, {
                estado: 'espera'
            });
            alert(`Pedido #${orderId} EN ESPERA.`);
            fetchOrders();
        } catch (error) {
            console.error("Failed to accept order", error);
            alert("Error accepting order");
        }
    }

    const completeOrders = async (orderId: number) => {
        try {
            await api.put(`/ventas/${orderId}`, {
                estado: 'completada'
            });
            alert(`Pedido #${orderId} COMPLETADO.`);
            fetchOrders();
        } catch (error) {
            console.error("Failed to complete order", error);
            alert("Error completing order");
        }
    }

    if (loading) {
        return (
            <div className={styles.kitchenContainer}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white' }}>
                    Wait...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.kitchenContainer}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Pantalla de Cocina</h1>
                <Link href="/roles">
                    <button className={styles.exitButton}>
                        <span>&larr;</span> Volver atras
                    </button>
                </Link>
            </header>

            {/* Split Columns */}
            <div className={styles.columnsContainer}>


                <div className={styles.column}>
                    <div className={`${styles.columnHeader} ${styles.newOrdersHeader}`}>
                        Nuevos Pedidos ({newOrders.length})
                    </div>
                    <div className={styles.ordersList}>
                        {newOrders.length === 0 && (
                            <div className={styles.emptyState}>Sin Pedidos.</div>
                        )}
                        {newOrders.map(order => (
                            <OrderCard key={order.id} order={order}>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        onClick={() => cancelOrders(order.id)}
                                        style={{ backgroundColor: '#ef4444', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => acceptOrders(order.id)}
                                        style={{ backgroundColor: '#22c55e', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </OrderCard>
                        ))}
                    </div>
                </div>

                <div className={styles.column}>
                    <div className={`${styles.columnHeader} ${styles.preparationHeader}`}>
                        En Espera ({prepOrders.length})
                    </div>
                    <div className={styles.ordersList}>
                        {prepOrders.length === 0 && (
                            <div className={styles.emptyState}>0 pedidos en espera</div>
                        )}
                        {prepOrders.map(order => (
                            <OrderCard key={order.id} order={order}>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button
                                        onClick={() => completeOrders(order.id)}
                                        style={{ backgroundColor: '#3b82f6', color: 'white', padding: '5px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Completar
                                    </button>
                                </div>
                            </OrderCard>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Helper component for rendering an order card
function OrderCard({ order, children }: { order: Venta, children?: ReactNode }) {
    return (
        <div className={styles.orderCard}>
            <h2 className={styles.orderNumber}>Order #{order.id}</h2>
            <p className={styles.orderTable}>Table {order.usuario_id}</p>

            <div className={styles.orderItems}>
                {order.detalle_venta?.map((item: DetalleVenta) => (
                    <div key={item.id} className={styles.orderItem}>
                        <p className={styles.orderItemName}>{item.nombre_producto}</p>
                        <p className={styles.orderItemQuantity}>x{item.cantidad}</p>
                    </div>
                ))}
            </div>
            {children}
        </div>
    );
}
