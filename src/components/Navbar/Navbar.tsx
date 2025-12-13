'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cart from '../Cart/Cart';
import { useCart } from '@/context/CartContext';
import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
    const { toggleCart, isCartOpen, cartItems } = useCart();
    const { user, logout, isAuthenticated } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuDropdownRef = useRef<HTMLDivElement>(null);
    const [urlmenu, setUrlmenu] = useState('/');

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (menuDropdownRef.current && !menuDropdownRef.current.contains(event.target as Node)) {
                setIsMenuDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const pathname = usePathname();

    useEffect(() => {
        if (user?.rol === "admin" || user?.rol === "cajero" || user?.rol === "garzon" || user?.rol === 'cocinero') {
            setUrlmenu('/roles')
        } else {
            setUrlmenu('/')
        }
    }, [user]);

    if (pathname === '/') return null;

    return (
        <>
            <header className="site-header">
                <div className="logo-container">
                    <Link href={urlmenu}>
                        <span>Servento</span>
                    </Link>
                </div>
                <div className="user-actions">
                    <div className={styles.profileContainer} ref={menuDropdownRef}>
                        <button
                            className={`${styles.hamburgerBtn} ${isMenuDropdownOpen ? styles.hamburgerOpen : ''}`}
                            onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                            aria-label="Menú de opciones"
                        >
                            <span className={styles.hamburgerLine}></span>
                            <span className={styles.hamburgerLine}></span>
                            <span className={styles.hamburgerLine}></span>
                        </button>

                        {isMenuDropdownOpen && (
                            <div className={styles.dropdown}>
                                <Link href="/menu" className={styles.dropdownItem} onClick={() => setIsMenuDropdownOpen(false)}>
                                    Menu
                                </Link>
                                <div className={styles.dropdownDivider}></div>
                                <Link href="/products?category=Carnes" className={styles.dropdownItem} onClick={() => setIsMenuDropdownOpen(false)}>
                                    Carnes
                                </Link>
                                <Link href="/products?category=Acompañamiento" className={styles.dropdownItem} onClick={() => setIsMenuDropdownOpen(false)}>
                                    Acompañamiento
                                </Link>
                                <Link href="/products?category=Chorrillanas" className={styles.dropdownItem} onClick={() => setIsMenuDropdownOpen(false)}>
                                    Chorrillanas
                                </Link>
                                <Link href="/products?category=Hamburguesas" className={styles.dropdownItem} onClick={() => setIsMenuDropdownOpen(false)}>
                                    Hamburguesas
                                </Link>
                                <Link href="/products?category=Licores" className={styles.dropdownItem} onClick={() => setIsMenuDropdownOpen(false)}>
                                    Licores
                                </Link>
                                <Link href="/products?category=Especialidad" className={styles.dropdownItem} onClick={() => setIsMenuDropdownOpen(false)}>
                                    Especialidad
                                </Link>
                                <Link href="/products?category=Bebidas-y-Jugos" className={styles.dropdownItem} onClick={() => setIsMenuDropdownOpen(false)}>
                                    Bebidas y Jugos
                                </Link>
                            </div>
                        )}
                    </div>

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
                            {isAuthenticated ? `👤 ${user?.name}` : '👤 Perfil'}
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
                </div>
            </header>

            <Cart isOpen={isCartOpen} onClose={toggleCart} />
        </>
    );
}
