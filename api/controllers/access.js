import { database } from "../database.js";

export const getAccess = (_, response) => {
    try {
        const query = "SELECT * FROM RegistroAcesso";

        database.query(query, (error, data) => {
            if (error) {
                console.error("Erro ao buscar registros de acesso:", error);
                return response.status(500).json({ error: "Erro ao buscar registros de acesso." });
            }

            return response.status(200).json(data);
        });
    } catch (error) {
        console.error("Erro ao buscar registros de acesso:", error);
        response.status(500).json({ error: "Erro ao buscar registros de acesso." });
    }
};

export const getAccessTest = (_, response) => {
    try {
        const query = "SELECT u.Nome_Usuario, p.Nome, r.Data_Hora_acesso FROM RegistroAcesso r, usuario u, porta p WHERE r.Usuario_ID_Usuario = u.ID_Usuario AND r.Porta_ID_Porta = p.ID_Porta ORDER BY r.ID_RegistroAcesso";

        database.query(query, (error, data) => {
            if (error) {
                console.error("Erro ao buscar dados de acesso:", error);
                return response.status(500).json({ error: "Erro ao buscar dados de acesso." });
            }

            return response.status(200).json(data);
        });
    } catch (error) {
        console.error("Erro ao buscar dados de acesso:", error);
        response.status(500).json({ error: "Erro ao buscar dados de acesso." });
    }
};

export const getAccessLog = (request, response) => {
    try {
        const query = "SELECT p.Nome, r.Data_Hora_acesso FROM RegistroAcesso r, porta p, usuario u WHERE r.Porta_ID_Porta = p.ID_Porta AND r.Usuario_ID_Usuario = u.ID_Usuario AND u.ID_Usuario = ?";
        const userID = request.params.userID;
        database.query(query, [userID], (error, data) => {
            if (error) {
                console.error(`Erro ao buscar log de acesso para o usuário ${userID}:`, error);
                return response.status(500).json({ error: "Erro ao buscar log de acesso." });
            }

            return response.status(200).json(data);
        });
    } catch (error) {
        console.error("Erro ao buscar log de acesso para o usuário:", error);
        response.status(500).json({ error: "Erro ao buscar log de acesso." });
    }
};

export const addAccess = (request, response) => {
    try {
        const query = "INSERT INTO RegistroAcesso (`Codigo_Chave`, `Data_Hora_acesso`, `Usuario_ID_Usuario`, `Porta_ID_Porta`) VALUES (?)";
        const values = [
            request.body.Codigo_Chave,
            request.body.Data_Hora_acesso,
            request.body.Usuario_ID_Usuario,
            request.body.Porta_ID_Porta
        ];

        database.query(query, [values], (error) => {
            if (error) {
                console.error("Erro ao adicionar registro de acesso:", error);
                return response.status(500).json({ error: `Erro ao adicionar registro de acesso: ${error.sqlMessage || error}` });
            }

            return response.status(200).json("Registro de acesso criado com sucesso.");
        });
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        response.status(500).json({ error: "Erro ao buscar usuários." });
    }
};