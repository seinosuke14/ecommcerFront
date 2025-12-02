'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { api } from '../../../lib/api';
import { Product } from '@/models/products';
import styles from './menu.module.css';

export default function MenuPage() {
    const { isVisit, isClient, isCajero, isGarzon, isAdmin } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

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
    const productsByCategory: { [key: string]: Product[] } = {};

    products.forEach(product => {
        if (product.categorias && product.categorias.length > 0) {
            product.categorias.forEach(cat => {
                const catName = cat.vch_nombre;
                if (!productsByCategory[catName]) {
                    productsByCategory[catName] = [];
                }
                productsByCategory[catName].push(product);
            });
        } else {
            // Handle products with no category
            if (!productsByCategory['Otros']) {
                productsByCategory['Otros'] = [];
            }
            productsByCategory['Otros'].push(product);
        }
    });

    // Sort categories alphabetically
    const categories = Object.keys(productsByCategory).sort();

    if (loading) {
        return <div className={styles.loading}>Cargando menú...</div>;
    }

    return (
        <div className={styles.menuContainer}>
            <div className={styles.menuWrapper}>

                {/* Header */}
                <div className={styles.menuHeader}>
                    <h1 className={styles.menuTitle}>CAFE BAR</h1>
                    <h2 className={styles.menuSubtitle}>MENU</h2>
                </div>

                {/* Categories Grid */}
                <div className={styles.categoriesGrid}>
                    {categories.map(category => (
                        <section key={category} className={styles.categorySection}>
                            <h3 className={styles.categoryTitle}>
                                {category}
                            </h3>

                            <div className={styles.productsList}>
                                {productsByCategory[category].map(product => (
                                    <div key={`${category}-${product.id}`} className={styles.productItem}>
                                        <div className={styles.productHeader}>
                                            <span className={styles.productName}>
                                                {product.nombre}
                                            </span>

                                            {/* Dotted Leader */}
                                            <div className={styles.productDots}></div>

                                            <span className={styles.productPrice}>
                                                {Number(product.price).toLocaleString('es-CL', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>

                                        {product.descriptions && (
                                            <p className={styles.productDescription}>
                                                {product.descriptions}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer */}
                <div className={styles.menuFooter}>
                    <p className={styles.footerText}>
                        Sabor & Fuego • Restaurant
                    </p>
                </div>
            </div>
        </div>
    );
}
