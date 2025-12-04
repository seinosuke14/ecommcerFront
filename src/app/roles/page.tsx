'use client';

import Link from 'next/link';
import styles from './roles.module.css';
import { useAuth } from '@/context/AuthContext';
import { roles } from '@/app/config/roles';


export default function RoleSelectionPage() {
    const { isAdmin, isCajero } = useAuth();

    const useRol = isAdmin ? 'administrador' : isCajero ? 'cajero' : null;

    const filteredRoles = isAdmin ? roles :

        roles.filter(roles => roles.rolEspecifico.includes(useRol!));

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Gestion de Usuarios segun Rol</h1>
            </div>

            <div className={`${styles.grid} ${filteredRoles.length === 1 ? styles.gridSingle : ''}`}>
                {filteredRoles.map((role) => (
                    <Link key={role.path} href={role.path} className={styles.card}>
                        <div className={styles.iconWrapper}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={styles.icon}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d={role.icon} />
                            </svg>
                        </div>
                        <h2 className={styles.roleName}>{role.name}</h2>
                        <p className={styles.roleDescription}>{role.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
