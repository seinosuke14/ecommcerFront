'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/models/products';
import { Menu } from '@/models/menu';
import styles from './AddToCartBtn.module.css';

interface AddToCartBtnProps {
    product: Product | Menu;
    quantity?: number;
    className?: string;
    children?: React.ReactNode;
}

export default function AddToCartBtn({ product, quantity = 1, className, children }: AddToCartBtnProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if inside a Link
        e.stopPropagation();

        // Map Menu to Product structure if necessary
        const productToAdd = 'precio_total' in product ? {
            ...product,
            price: product.precio_total,
            discount: product.descuento_porcentaje,
            descriptions: product.descripcion
        } : product;

        addToCart(productToAdd as Product, quantity);
    };

    return (
        <button
            onClick={handleAddToCart}
            className={`${styles.btn} ${className || ''}`}
        >
            {children || 'Agregar 🛒'}
        </button>
    );
}
