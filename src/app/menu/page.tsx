'use client';

import { useEffect, useState, useMemo } from 'react';
import { api } from '../../../lib/api';
import { Product } from '@/models/products';
import { useCart } from '@/context/CartContext';
import styles from './menu.module.css';

export default function MenuPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [tableNumber, setTableNumber] = useState<number>(1);

    // Global Cart Context
    const { cartItems, addToCart, updateQuantity, subtotal, toggleCart } = useCart();

    useEffect(() => {
        api.json<Product[]>('/products')
            .then((data: Product[]) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err: any) => {
                console.error("Failed to fetch products", err);
                setProducts([]);
                setLoading(false);
            });
    }, []);

    // Group products by category
    const productsByCategory = useMemo(() => {
        const grouped: { [key: string]: Product[] } = {};
        products.forEach(product => {
            const cats = product.categorias && product.categorias.length > 0
                ? product.categorias.map(c => c.vch_nombre)
                : ['Otros'];

            cats.forEach(catName => {
                if (!grouped[catName]) grouped[catName] = [];
                grouped[catName].push(product);
            });
        });
        return grouped;
    }, [products]);

    const categories = Object.keys(productsByCategory).sort();

    // Helper to get quantity from global cart
    const getQuantity = (productId: number) => {
        return cartItems.find(item => item.id === productId)?.quantity || 0;
    };

    const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handlePlaceOrder = () => {
        // Open the global cart drawer/modal
        toggleCart();
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Cargando menú...</div>;
    }

    return (
        <div className={styles.menuContainer}>
            <div className={styles.menuWrapper}>

                {/* Header */}
                <div className={styles.menuHeader}>
                    <h1 className={styles.menuTitle}>SABOR & FUEGO</h1>
                    <h2 className={styles.menuSubtitle}>Menú Digital</h2>
                </div>

                {/* Table Selection */}
                <div className={styles.tableSection}>
                    <label htmlFor="tableNum" className={styles.tableLabel}>Número de Mesa:</label>
                    <input
                        id="tableNum"
                        type="number"
                        min="1"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}
                        className={styles.tableInput}
                    />
                </div>

                {/* Categories & Products */}
                <div className={styles.categoriesGrid}>
                    {categories.map(category => (
                        <section key={category} className={styles.categorySection}>
                            <h3 className={styles.categoryTitle}>{category}</h3>
                            <div className={styles.productsList}>
                                {productsByCategory[category].map(product => {
                                    const qty = getQuantity(product.id);
                                    return (
                                        <div key={`${category}-${product.id}`} className={styles.productCard}>
                                            {product.imagenes && product.imagenes.length > 0 && (
                                                <img
                                                    src={product.imagenes[0].url_image}
                                                    alt={product.nombre}
                                                    className={styles.productImage}
                                                />
                                            )}
                                            <div className={styles.productInfo}>
                                                <a href={`/vip/${product.id}`} className={styles.productName}>
                                                    {product.nombre}
                                                </a>
                                                {product.descriptions && (
                                                    <p className={styles.productDescription}>{product.descriptions}</p>
                                                )}
                                                <span className={styles.productPrice}>
                                                    ${Number(product.price).toLocaleString('es-CL')}
                                                </span>
                                            </div>

                                            <div className={styles.productActions}>
                                                {qty === 0 ? (
                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className={styles.addButton}
                                                    >
                                                        Agregar
                                                    </button>
                                                ) : (
                                                    <div className={styles.quantityControls}>
                                                        <button
                                                            onClick={() => updateQuantity(product.id, qty - 1)}
                                                            className={styles.qtyBtn}
                                                        >
                                                            -
                                                        </button>
                                                        <span className={styles.qtyValue}>{qty}</span>
                                                        <button
                                                            onClick={() => updateQuantity(product.id, qty + 1)}
                                                            className={styles.qtyBtn}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>

            {/* Cart Summary Footer */}
            {cartItemCount > 0 && (
                <div className={styles.cartSummary}>
                    <div className={styles.cartTotal}>
                        <span className={styles.totalLabel}>{cartItemCount} items</span>
                        <span className={styles.totalAmount}>${subtotal.toLocaleString('es-CL')}</span>
                    </div>
                    <button onClick={handlePlaceOrder} className={styles.placeOrderBtn}>
                        Ver Pedido
                    </button>
                </div>
            )}
        </div>
    );
}
