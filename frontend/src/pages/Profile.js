import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Profile.module.css';
import ProfileImage from "../assets/profileImage.jpg";
import AddPermissionModal from "../components/AddPermissionModal";
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';
import Header from '../components/Header';

function Profile({ permission, permissionUser, accessLog, userInfo, reloadUsersHome }) {
    const [showFirstTable, setShowFirstTable] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [cargo, setCargo] = useState("");
    const { userID } = useParams();

    useEffect(() => {
        if (userInfo) {
            setNome(userInfo.Nome_Usuario || "");
            setEmail(userInfo.Email || "");
            setIsActive(userInfo.Status === 'A');
            setCargo(userInfo.Permissoes_ID_Permissoes || "");
        }
    }, [userInfo]);

    const validateForm = () => {
        if (!nome.trim()) {
            toast.error("O nome do usuário não pode estar vazio.");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Por favor, insira um e-mail válido.");
            return false;
        }
        if (!cargo) {
            toast.error("Por favor, selecione um cargo válido.");
            return false;
        }
        return true;
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await axios.put(`http://localhost:8800/user/${userID}`, {
                Nome_Usuario: nome,
                Email: email,
                Status: isActive ? 'A' : 'I',
                Permissoes_ID_Permissoes: cargo,
                ID_Usuario: userInfo?.ID_Usuario
            });
            toast.success("Alterações salvas com sucesso!");

            if (reloadUsersHome) {
                reloadUsersHome();
            }
        } catch (error) {
            console.error("Erro ao salvar alterações:", error);
            toast.error("Erro ao salvar alterações.");
        }
    };

    return (
        <div className={styles.main}>
            <Header />
            <main className={styles.mainContainer}>
                <section className={styles.mainSectionContainer}>
                    <article className={styles.articleInputs}>
                        <h2>Usuário</h2>
                        <div className={styles.inputsContainer}>
                            <div className={styles.inputs}>
                                <label>Nome</label>
                                <input
                                    className={styles.inputText}
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    placeholder="Insira um nome"
                                    required
                                />

                                <label>E-mail</label>
                                <input
                                    className={styles.inputText}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Insira um email"
                                    required
                                />

                                <label htmlFor="click">Ativo</label>
                                <input
                                    type="checkbox"
                                    id="click"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                />

                                <label>Cargo</label>
                                <select
                                    name="permission"
                                    value={cargo}
                                    onChange={(e) => setCargo(e.target.value)}
                                >
                                    {permission && permission.map(permission => (
                                        <option key={permission.ID_Permissoes} value={permission.ID_Permissoes}>
                                            {permission.Cargo}
                                        </option>
                                    ))}
                                </select>

                                <button type="submit" onClick={handleSave}>Salvar</button>
                            </div>

                            <div>
                                <img src={ProfileImage} alt="Imagem do funcionário" className={styles.profileImage} />
                            </div>
                        </div>
                    </article>

                    <article className={styles.trustedLogButton}>
                        <button onClick={() => setShowFirstTable(true)}>Permissões</button>
                        <button onClick={() => setShowFirstTable(false)}>Log de Acesso</button>
                    </article>

                    {showFirstTable && (
                        <article className={styles.articleTable}>
                            <div className={`${styles.tableRow} ${styles.firstRow}`}>
                                <span>ID</span>
                                <span>LOCAL</span>
                            </div>
                            <AddPermissionModal isOpen={openModal} setModalOpen={() => setOpenModal(!openModal)} />

                            <div className={styles.line}></div>

                            <div className={styles.overflowTable}>
                                {permissionUser && permissionUser.map((permissionUser, i) => (
                                    <React.Fragment key={i}>
                                        <div className={styles.tableRow}>
                                            <span>{permissionUser.ID_Porta}</span>
                                            <span>{permissionUser.Nome}</span>
                                        </div>
                                        <div className={styles.line}></div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </article>
                    )}

                    {!showFirstTable && (
                        <article className={styles.articleTable}>
                            <div className={`${styles.tableRow} ${styles.firstRow}`}>
                                <span>LOCAL</span>
                                <span>DATA E HORA</span>
                            </div>

                            <div className={styles.line}></div>

                            <div className={styles.overflowTable}>
                                {accessLog && accessLog.map((accessLog, i) => (
                                    <React.Fragment key={i}>
                                        <div className={styles.tableRow}>
                                            <span>{accessLog.Nome}</span>
                                            <span>{accessLog.Data_Hora_acesso}</span>
                                        </div>
                                        <div className={styles.line}></div>
                                    </React.Fragment>
                                ))}
                            </div>
                        </article>
                    )}
                </section>
            </main>
        </div>

    );
}

export default Profile;