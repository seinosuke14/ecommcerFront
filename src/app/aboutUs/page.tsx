'use client';

import { useEffect, useState } from 'react';


import styles from './aboutUs.module.css';

export default function AboutUsPage() {
    return (
        <section className={styles.container}>
            <h2 className={styles.title}>Sobre Nosotros</h2>
            <p className={styles.text}>Esta es la página de sobre nosotros.</p>
        </section>
    );
}