import React from "react";
import styles from '../styles/Home.module.css';
import { Link } from "react-router-dom";
import UserModal from "../components/UserModal";
import { useState } from "react";
import Header from '../components/Header';
import { RiPlayListAddLine } from "react-icons/ri";
import { GoGear } from "react-icons/go";

function Home({ usersHome, permission, reloadUsersHome }) {
    const [openModal, setOpenModal] = useState(false);

    const formatStatus = (status) => {
        return status === 'A' ? 'Sim' : 'Não';
    };

    return (
        <div className={styles.main}>
            <Header />
            <main className={styles.mainContainer}>
                <section className={styles.mainSectionContainer}>
                    <article className={styles.articleTable}>
                        <div className={`${styles.tableRow} ${styles.firsRow}`}>
                            <div className={styles.idNameContainer}>
                                <span className={`${styles.idCell} ${styles.firstRow}`}>ID</span>
                                <span className={`${styles.nameCell} ${styles.firstRow}`}>NOME</span>
                            </div>

                            <div className={styles.cargoSettingsContainer}>
                                <span className={`${styles.cargo} ${styles.firstRow}`}>CARGO</span>
                                <span className={`${styles.ativo} ${styles.firstRow}`}>ATIVO</span>
                                <button onClick={() => setOpenModal(true)}><RiPlayListAddLine /></button>
                                
                            </div>
                            <UserModal
                                isOpen={openModal}
                                setModalOpen={() => setOpenModal(!openModal)}
                                permission={permission.length ? permission : []}
                                reloadUsersHome={reloadUsersHome}
                            />
                        </div>

                        <div className={styles.overflowTable}>
                            {usersHome.map((user) => (
                                <React.Fragment key={user.ID_Usuario}>
                                    <div className={`${styles.tableRow} ${styles.tableRowHover}`}>
                                        <div className={styles.idNameContainer}>
                                            <span className={styles.idCell}>{user.ID_Usuario}</span>
                                            <span className={styles.nameCell}>{user.Nome_Usuario}</span>
                                        </div>

                                        <div className={styles.cargoSettingsContainer}>
                                            <span className={styles.roleCell}>{user.Cargo}</span>
                                            <span className={styles.activeCell}>{formatStatus(user.Status)}</span>
                                            <Link to={`/profile/${user.ID_Usuario}`} className={styles.optionsCell} >
                                            <GoGear />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className={styles.line}></div>
                                </React.Fragment>
                            ))}
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Home;