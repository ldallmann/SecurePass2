import { database } from "../database.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secretKey = "chaveSecreta";

export const getUsers = (_, response) => {
    try {
        const query = "SELECT * FROM Usuario ORDER BY Nome_Usuario";

        database.query(query, (error, data) => {
            if (error) {
                console.error("Erro ao buscar usuários:", error);
                return response.status(500).json({ error: "Erro ao buscar usuários." });
            }

            return response.status(200).json(data);
        });
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        response.status(500).json({ error: "Erro ao buscar usuários." });
    }
};

export const getUsersHome = (_, response) => {
    try {
        const query = "SELECT u.ID_Usuario, u.Nome_Usuario, p.Cargo, u.Status FROM Usuario u JOIN Permissoes p ON u.Permissoes_ID_Permissoes = p.ID_Permissoes ORDER BY u.ID_Usuario ASC";

        database.query(query, (error, data) => {
            if (error) {
                console.error("Erro ao buscar dados de usuários na home:", error);
                return response.status(500).json({ error: "Erro ao buscar dados de usuários na home." });
            }

            return response.status(200).json(data);
        });
    } catch (error) {
        console.error("Erro ao buscar dados de usuários na home:", error);
        response.status(500).json({ error: "Erro ao buscar dados de usuários na home." });
    }
};

export const getUserInfo = (request, response) => {
    try {
        const query = "SELECT Nome_Usuario, Email, Status, Permissoes_ID_Permissoes FROM Usuario WHERE ID_Usuario = ?";
        const userID = request.params.userID;
        database.query(query, [userID], (error, data) => {
            if (error) {
                console.error(`Erro ao buscar informações do usuário com ID ${userID}:`, error);
                return response.status(500).json({ error: "Erro ao buscar informações do usuário." });
            }

            return response.status(200).json(data[0] || {});
        });
    } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
        response.status(500).json({ error: "Erro ao buscar informações do usuário." });
    }
};

export const addUser = (request, response) => {
    try {
        const query = "INSERT INTO Usuario (`Nome_Usuario`, `Email`, `Telefone`, `Permissoes_ID_Permissoes`) VALUES (?)";
        const values = [
            request.body.Nome_Usuario,
            request.body.Email,
            request.body.Telefone,
            request.body.Permissoes_ID_Permissoes
        ];

        database.query(query, [values], (error) => {
            if (error) {
                console.error("Erro ao adicionar usuário:", error);
                return response.status(500).json({ error: `Erro ao adicionar usuário: ${error.sqlMessage || error}` });
            }

            return response.status(200).json("Usuário criado com sucesso.");
        });
    } catch (error) {
        console.error("Erro ao adicionar usuário:", error);
        response.status(500).json({ error: "Erro ao adicionar usuário." });
    }
};

export const updateUser = (request, response) => {
    try {
        const query = "UPDATE Usuario SET `Nome_Usuario` = ?, `Email` = ?, `Status` = ?, `Permissoes_ID_Permissoes` = ? WHERE `ID_Usuario` = ?";

        const values = [
            request.body.Nome_Usuario,
            request.body.Email,
            request.body.Status,
            request.body.Permissoes_ID_Permissoes,
            request.params.userID
        ];

        database.query(query, values, (error) => {
            if (error) {
                console.error(`Erro ao atualizar usuário com ID ${request.params.userID}:`, error);
                return response.status(500).json({ error: "Erro ao atualizar usuário." });
            }

            return response.status(200).json("Usuário atualizado com sucesso.");
        });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        response.status(500).json({ error: "Erro ao atualizar usuário." });
    }
};

export const deleteUser = (request, response) => {
    try {
        const query = "DELETE FROM Usuario WHERE `ID_Usuario` = ?";

        database.query(query, [request.params.userID], (error) => {
            if (error) {
                console.error(`Erro ao deletar usuário com ID ${request.params.userID}:`, error);
                return response.status(500).json({ error: "Erro ao deletar usuário." });
            }

            return response.status(200).json("Usuário deletado com sucesso.");
        });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);
        response.status(500).json({ error: "Erro ao deletar usuário." });
    }
};

export const registerUser = (request, response) => {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({ msg: "Preencha todos os campos." });
        }

        const checkEmailQuery = "SELECT * FROM usuariologin WHERE email = ?";
        database.query(checkEmailQuery, [email.toLowerCase()], (error, results) => {
            if (error) {
                console.error("Erro ao verificar email:", error);
                return response.status(500).json({ msg: "Erro interno do servidor." });
            }

            if (results.length > 0) {
                return response.status(409).json({ msg: "Email já cadastrado." });
            }

            bcrypt.hash(password, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    console.error("Erro ao criptografar senha:", hashError);
                    return response.status(500).json({ msg: "Erro interno do servidor." });
                }

                const insertUserQuery = "INSERT INTO usuariologin (`name`, `email`, `password`) VALUES (?, ?, ?)";
                database.query(insertUserQuery, [name, email.toLowerCase(), hashedPassword], (insertError) => {
                    if (insertError) {
                        console.error("Erro ao registrar usuário:", insertError);
                        return response.status(500).json({ msg: "Erro interno do servidor." });
                    }

                    return response.status(201).json({ msg: "Usuário cadastrado com sucesso." });
                });
            });
        });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        response.status(500).json({ error: "Erro ao registrar usuário." });
    }
};

export const loginUser = (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ msg: "Preencha todos os campos." });
        }

        const checkEmailQuery = "SELECT * FROM usuariologin WHERE email = ?";
        database.query(checkEmailQuery, [email.toLowerCase()], (error, results) => {
            if (error) {
                console.error("Erro ao verificar email:", error);
                return response.status(500).json({ msg: "Erro interno do servidor." });
            }

            if (results.length === 0) {
                return response.status(404).json({ msg: "Email ou senha inválidos." });
            }

            const user = results[0];

            bcrypt.compare(password, user.password, (compareError, isPasswordValid) => {
                if (compareError) {
                    console.error("Erro ao comparar senha:", compareError);
                    return response.status(500).json({ msg: "Erro interno do servidor." });
                }

                if (!isPasswordValid) {
                    return response.status(401).json({ msg: "Email ou senha inválidos." });
                }

                const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });

                return response.status(200).json({
                    success: true,
                    msg: "Login bem-sucedido.",
                    token,
                });
            });
        });
    } catch (error) {
        console.error("Erro ao logar usuário:", error);
        response.status(500).json({ error: "Erro ao logar usuário." });
    }
};