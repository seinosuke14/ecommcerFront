'use client';

import Link from 'next/link';
import Cart from '../Cart/Cart';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const { toggleCart, isCartOpen, cartItems } = useCart();

    return (
        <>
            <header className="site-header">
                <div className="logo-container">
                    <Link href="/">
                        <span className="logo-icon">🦊</span>
                        <span className="logo-text">SOLO<span className="logo-highlight">TODO</span></span>
                    </Link>
                </div>

                <div className="search-container">
                    <input type="text" placeholder="Busca un producto" className="search-input" />
                    <button className="search-button">🔍</button>
                </div>

                <nav className="main-nav">
                    <Link href="/products?category=Tecnología">Tecnología</Link>
                    <Link href="/products?category=Hardware">Hardware</Link>
                    <Link href="/products?category=Periféricos">Periféricos</Link>
                    <Link href="/products?category=Electro">Electro</Link>
                </nav>

                <div className="user-actions">
                    <button
                        className="profile-btn"
                        onClick={toggleCart}
                        style={{ color: '#333' }}
                    >
                        🛒 Carrito {cartItems.length > 0 && `(${cartItems.length})`}
                    </button>
                    <button className="profile-btn">👤 Perfil ⌄</button>
                    <button className="settings-btn">⚙️</button>
                </div>
            </header>

            <Cart isOpen={isCartOpen} onClose={toggleCart} />
        </>
    );
}
