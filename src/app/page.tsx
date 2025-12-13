'use client';

import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.iconContainer}>
        {/* Waiter Icon placeholder */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/3448/3448609.png"
          alt="Servento Logo"
          className={styles.icon}
        />
      </div>

      <h1 className={styles.title}>Servento</h1>

      <p className={styles.subtitle}>
        Creando momentos a la mesa
      </p>

      <div className={styles.buttonGroup}>
        <Link href="/menu" className={styles.button}>
          Menu
        </Link>
        <Link href="/login" className={styles.button}>
          Iniciar Sesión
        </Link>
        <Link href="/registro" className={styles.button}>
          Registrarse
        </Link>
      </div>
    </div>
  );
}
