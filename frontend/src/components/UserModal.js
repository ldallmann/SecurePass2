import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from '../styles/UserModal.module.css';
import closeIcon from "../assets/closeIcon.svg";
import { toast } from "react-toastify";

function UserModal({ isOpen, setModalOpen, permission, reloadUsersHome }) {
    const initialFormData = {
        Nome_Usuario: "",
        Email: "",
        Telefone: "",
        Permissoes_ID_Permissoes: ""
    };

    const [formData, setFormData] = useState(initialFormData);

    const resetForm = () => {
        setFormData(initialFormData);
    };

    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefoneRegex = /^[0-9()-\s]+$/;

        if (!formData.Nome_Usuario || formData.Nome_Usuario.length > 45) {
            toast.error("Nome é obrigatório e deve ter até 45 caracteres.");
            return false;
        }
        if (!emailRegex.test(formData.Email) || formData.Email.length > 45) {
            toast.error("Por favor, insira um email válido com até 45 caracteres.");
            return false;
        }
        if (!telefoneRegex.test(formData.Telefone) || formData.Telefone.length > 45) {
            toast.error("Telefone inválido. Use apenas números, parênteses e hifens, com até 45 caracteres.");
            return false;
        }
        if (!formData.Permissoes_ID_Permissoes) {
            toast.error("Por favor, selecione um cargo válido.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const res = await axios.post("http://localhost:8800/user/", formData);
            toast.success(res.data);
            reloadUsersHome();
            resetForm();
            setModalOpen(false);
        } catch (err) {
            const errorMessage = err.response && err.response.data
                ? (err.response.data.error || JSON.stringify(err.response.data))
                : "Erro desconhecido";

            console.error("Erro ao criar usuário:", errorMessage);
            toast.error(`Erro: ${errorMessage}`);
        }
    };

    if (isOpen) {
        return (
            <main className={styles.mainContainer}>
                <form onSubmit={handleSubmit}>
                    <button className={styles.closeModal} onClick={() => setModalOpen(false)}>
                        <img src={closeIcon} alt="Fechar" />
                    </button>
                    <div className={styles.inputsContainer}>
                        <label>Nome:</label>
                        <input
                            type="text"
                            name="Nome_Usuario"
                            placeholder="Insira o nome do colaborador"
                            value={formData.Nome_Usuario}
                            onChange={handleInputChange}
                            maxLength="45"
                        />
                        <label>Email:</label>
                        <input
                            type="email"
                            name="Email"
                            placeholder="Insira o email do colaborador"
                            value={formData.Email}
                            onChange={handleInputChange}
                            maxLength="45"
                        />
                        <label>Telefone:</label>
                        <input
                            type="text"
                            name="Telefone"
                            placeholder="Insira o telefone do colaborador"
                            value={formData.Telefone}
                            onChange={handleInputChange}
                            maxLength="45"
                        />
                        <label>Cargo:</label>
                        <select
                            name="Permissoes_ID_Permissoes"
                            value={formData.Permissoes_ID_Permissoes}
                            onChange={handleInputChange}
                        >
                            <option value="">Selecione um Cargo</option>
                            {Array.isArray(permission) && permission.map((perm) => (
                                <option key={perm.ID_Permissoes} value={perm.ID_Permissoes}>
                                    {perm.Cargo}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.buttonsContainer}>
                        <button type="button" className={styles.cancelButton} onClick={() => setModalOpen(false)}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.singupButton}>
                            Salvar
                        </button>
                    </div>
                </form>
            </main>
        );
    }
    return null;
}

export default UserModal;