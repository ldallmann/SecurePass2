import React from "react";
import styles from '../styles/Header.module.css';
import { Link } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { Navigate } from 'react-router-dom';
import { CiCreditCard1 } from "react-icons/ci";
import { GoHome } from "react-icons/go";
import TopShield from '../assets/topShield.svg';
import BottomShield from '../assets/bottomShield.svg';

function Header() {

    const handleLogout = () => {
        localStorage.removeItem('token');
        <Navigate to="/" />;
    };

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerTitles}>
                <div className={styles.logoContainer}>
                    <img className={styles.imgHeader1} src={TopShield} alt='imagem' />
                    <p><span>Secure</span>Pass</p>
                    <img className={styles.imgHeader2} src={BottomShield} alt='imagem' />
                </div>
                <h3>Módulos</h3>
            </div>
            <span className={styles.border}></span>
            <nav className={styles.navbar}>
                <ul>
                    <li>
                        <Link to="/home" className={styles.navbarLinks}>
                            <GoHome className={styles.svg} />
                            <p>Home</p>
                        </Link>
                    </li>
                    <li>
                        <Link to="/access" className={styles.navbarLinks}>
                            <CiCreditCard1 className={styles.svg} />
                            <p>Acessos</p>
                        </Link>
                    </li>
                    <li>
                        <Link onClick={handleLogout} to="/" className={styles.navbarLinks}>
                            <CiLogout className={styles.svg} />
                            <p>Sair</p>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;