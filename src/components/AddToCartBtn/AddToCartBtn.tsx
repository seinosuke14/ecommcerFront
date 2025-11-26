'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/models/products';
import styles from './AddToCartBtn.module.css';

interface AddToCartBtnProps {
    product: Product;
    quantity?: number;
    className?: string;
    children?: React.ReactNode;
}

export default function AddToCartBtn({ product, quantity = 1, className, children }: AddToCartBtnProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if inside a Link
        e.stopPropagation();
        addToCart(product, quantity);
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
