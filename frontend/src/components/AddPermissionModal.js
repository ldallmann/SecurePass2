import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/PermissionModal.module.css";
import closeIcon from "../assets/closeIcon.svg";
import { toast } from "react-toastify";

function AddPermissionModal({ isOpen, setModalOpen, userID, reloadPermissions }) {
    const [selectedDoor, setSelectedDoor] = useState("");
	
    if (!isOpen) return null;

    return (
        <main className={styles.mainContainer}>
            <form>
                <button type="button" className={styles.closeModal} onClick={() => setModalOpen(false)}>
                    <img src={closeIcon} alt="Fechar" />
                </button>
                <div className={styles.inputsContainer}>
                    <label>Portas de Acesso:</label>
                    <select
                        name="door"
                        value={selectedDoor}
                        onChange={(e) => setSelectedDoor(e.target.value)}
                    >
                        <option value="">Selecione uma porta</option>
                        <option value="entradaPrincipal">Entrada Principal</option>
                        <option value="salaReuniaoUm">Sala de Reunião 1</option>
                        <option value="salaReuniaoDois">Sala de Reunião 2</option>
                        <option value="salaReuniaoTres">Sala de Reunião 3</option>
                        <option value="entradaFundos">Entrada dos Fundos</option>
                        <option value="saida">Saída</option>
                    </select>
                </div>
                <div className={styles.buttonsContainer}>
                    <button type="submit">Adicionar</button>
                </div>
            </form>
        </main>
    );
}

export default AddPermissionModal;
