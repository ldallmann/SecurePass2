import { database } from "../database.js";

export const getPermissions = (_, response) => {
    try {
        const query = "SELECT * FROM Permissoes ORDER BY Cargo";

        database.query(query, (error, data) => {
            if (error) {
                console.error("Erro ao buscar permissões:", error);
                return response.status(500).json({ error: "Erro ao buscar permissões." });
            }

            return response.status(200).json(data);
        });
    } catch (error) {
        console.error("Erro ao buscar permissões:", error);
        response.status(500).json({ error: "Erro ao buscar permissões." });
    }
};

export const getPermissionsUser = (request, response) => {
    try {
        const query = "SELECT r.ID_Porta, r.Nome FROM usuario u, Permissoes p, porta r, Permissoes_has_Porta pr WHERE p.ID_Permissoes = u.Permissoes_ID_Permissoes AND pr.Permissoes_ID_Permissoes = p.ID_Permissoes AND pr.Porta_ID_Porta = r.ID_Porta AND u.ID_Usuario = ?";

        const userID = request.params.userID;

        database.query(query, [userID], (error, data) => {
            if (error) {
                console.error(`Erro ao buscar permissões do usuário com ID ${userID}:`, error);
                return response.status(500).json({ error: "Erro ao buscar permissões do usuário." });
            }

            return response.status(200).json(data);
        });
    } catch (error) {
        console.error("Erro ao buscar permissões do usuário:", error);
        response.status(500).json({ error: "Erro ao buscar permissões do usuário." });
    }
};

export const addPermissionToDoor = (request, response) => {
    try {
        const { Permissoes_ID_Permissoes, Porta_ID_Porta } = request.body;

        if (!Permissoes_ID_Permissoes || !Porta_ID_Porta) {
            return response.status(400).json({ error: "Dados insuficientes para inserir a permissão." });
        }

        const query = `
            INSERT INTO Permissoes_has_Porta (Permissoes_ID_Permissoes, Porta_ID_Porta)
            VALUES (?, ?)
        `;

        database.query(query, [Permissoes_ID_Permissoes, Porta_ID_Porta], (error, result) => {
            if (error) {
                console.error("Erro ao adicionar permissão à porta:", error);
                return response.status(500).json({ error: "Erro ao adicionar permissão à porta." });
            }

            return response.status(201).json({ message: "Permissão adicionada com sucesso.", result });
        });
    } catch (error) {
        console.error("Erro interno ao adicionar permissão à porta:", error);
        response.status(500).json({ error: "Erro interno ao adicionar permissão à porta." });
    }
};

export const removePermissionFromDoor = (request, response) => {
    try {
        const { Permissoes_ID_Permissoes, Porta_ID_Porta } = request.body;

        if (!Permissoes_ID_Permissoes || !Porta_ID_Porta) {
            return response.status(400).json({ error: "Dados insuficientes para excluir a permissão." });
        }

        const query = `
            DELETE FROM Permissoes_has_Porta
            WHERE Permissoes_ID_Permissoes = ? AND Porta_ID_Porta = ?
        `;

        database.query(query, [Permissoes_ID_Permissoes, Porta_ID_Porta], (error, result) => {
            if (error) {
                console.error("Erro ao remover permissão da porta:", error);
                return response.status(500).json({ error: "Erro ao remover permissão da porta." });
            }

            if (result.affectedRows === 0) {
                return response.status(404).json({ error: "Nenhum registro encontrado para exclusão." });
            }

            return response.status(200).json({ message: "Permissão removida com sucesso." });
        });
    } catch (error) {
        console.error("Erro interno ao remover permissão da porta:", error);
        response.status(500).json({ error: "Erro interno ao remover permissão da porta." });
    }
};
