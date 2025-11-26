'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

import styles from './usuarios.module.css';

export default function UsersPage() {
    type Users = { id: number; nombre: string; email: string; edad: number; };
    const [users, setUsers] = useState<Users[]>([]);


    useEffect(() => {
        api.json<Users[]>('/users')
            .then(setUsers)
            .catch(() => setUsers([]));
    }, []);


    return (
        <section className={styles.container}>
            <h2 className={styles.title}>Usuarios</h2>
            {users.length === 0 ? <p>Sin usuarios</p> :
                <div className={styles.listContainer}>
                    {users.map(u => (
                        <details key={u.id} className={styles.accordionItem}>
                            <summary className={styles.accordionSummary}>
                                <span>{u.nombre}</span>
                                <span className={styles.age}>{u.edad}</span>
                            </summary>
                            <div className={styles.accordionDetails}>
                                <p><strong>Edad:</strong> {u.edad}</p>
                                <p><strong>Correo:</strong> {u.email}</p>
                            </div>
                        </details>
                    ))}
                </div>
            }
        </section>
    );
}