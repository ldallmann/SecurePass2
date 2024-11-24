import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/Acessos.module.css";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Header from '../components/Header';

function Access({ users = [], doors = [], accessTest = [], reloadAccess }) {
    const [accessData, setAccessData] = useState({
        Usuario_ID_Usuario: "",
        Porta_ID_Porta: "",
        Codigo_Chave: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAccessData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAccessSubmit = async (e) => {
        e.preventDefault();

        if (!accessData.Usuario_ID_Usuario || !accessData.Porta_ID_Porta) {
            toast.error("Por favor, selecione um usuário e uma porta.");
            return;
        }
        if (!accessData.Codigo_Chave) {
            toast.error("Por favor, insira a chave de acesso.");
            return;
        }
        if (!/^[A-Za-z0-9]{8,45}$/.test(accessData.Codigo_Chave)) {
            toast.error("A chave de acesso deve ter entre 8 e 45 caracteres alfanuméricos.");
            return;
        }

        try {
            const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");

            const payload = {
                Codigo_Chave: accessData.Codigo_Chave,
                Data_Hora_acesso: formattedDate,
                Usuario_ID_Usuario: accessData.Usuario_ID_Usuario,
                Porta_ID_Porta: accessData.Porta_ID_Porta
            };

            const res = await axios.post("http://localhost:8800/access", payload);
            toast.success(res.data);

            reloadAccess();
        } catch (err) {
            const errorMessage = err.response && err.response.data
                ? (err.response.data.error || JSON.stringify(err.response.data))
                : "Erro desconhecido";

            console.error("Erro ao adicionar acesso:", errorMessage);
            toast.error(`Erro: ${errorMessage}`);
        }
    };

    return (
        <div className={styles.main}>
        <Header />
        <main className={styles.mainContainer}>
            <section className={styles.mainSectionContainer}>
                <article className={styles.articleTitleAccess}>
                    <h2>Acessos</h2>
                </article>

                <article className={styles.inputs}>
                    <div className={styles.containerSelects}>
                        <h4>Usuário</h4>
                        <select
                            name="Usuario_ID_Usuario"
                            value={accessData.Usuario_ID_Usuario}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione um Usuário</option>
                            {users.map(user => (
                                <option key={user.ID_Usuario} value={user.ID_Usuario}>
                                    {user.Nome_Usuario}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.containerSelects}>
                        <h4>Porta</h4>
                        <select
                            name="Porta_ID_Porta"
                            value={accessData.Porta_ID_Porta}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione uma Porta</option>
                            {doors.map(door => (
                                <option key={door.ID_Porta} value={door.ID_Porta}>
                                    {door.Nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.containerSelects}>
                        <h4>Chave de Acesso (RFID)</h4>
                        <input
                            type="text"
                            name="Codigo_Chave"
                            placeholder="Digite a chave de acesso"
                            className={styles.inputField}
                            value={accessData.Codigo_Chave}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button onClick={handleAccessSubmit} className={styles.accessButton}>
                        Acessar
                    </button>
                </article>

                <article className={styles.articleTable}>
                    <div className={`${styles.tableRow} ${styles.firsRow}`}>
                        <span>USUÁRIO</span>
                        <span>LOCAL</span>
                        <span>DATA E HORA</span>
                    </div>

                    <div className={styles.line}></div>

                    <div className={styles.overflowTable}>
                        {accessTest.map((item, i) => (
                            <React.Fragment key={i}>
                                <div className={styles.tableRow}>
                                    <span>{item.Nome_Usuario}</span>
                                    <span>{item.Nome}</span>
                                    <span>{item.Data_Hora_acesso}</span>
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

export default Access;