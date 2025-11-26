'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/models/products';

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    isCartOpen: boolean;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    toggleCart: () => void;
    clearCart: () => void;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product: Product, quantity: number = 1) => {
        setCartItems(prev => {
            const existingItem = prev.find(item => item.id === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) return;
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const clearCart = () => setCartItems([]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleCart,
            clearCart,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
