'use client';

import Link from 'next/link';
import Cart from '../Cart/Cart';
import { useCart } from '@/context/CartContext';
import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { toggleCart, isCartOpen, cartItems } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

                    <div className={styles.profileContainer} ref={dropdownRef}>
                        <button
                            className="profile-btn"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {isAuthenticated ? `👤 ${user?.name}` : '👤 Perfil ⌄'}
                        </button>

                        {isDropdownOpen && (
                            <div className={styles.dropdown}>
                                {!isAuthenticated ? (
                                    <>
                                        <Link href="/login" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                                            Iniciar Sesión
                                        </Link>
                                        <Link href="/registro" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                                            Registrarse
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/usuarios" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                                            Mi Cuenta
                                        </Link>
                                        <div className={styles.dropdownDivider}></div>
                                        <button
                                            className={styles.dropdownItem}
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <button className="settings-btn">⚙️</button>
                </div>
            </header>

            <Cart isOpen={isCartOpen} onClose={toggleCart} />
        </>
    );
}
