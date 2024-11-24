import { database } from "../database.js";

export const getDoors = (_, response) => {
    try {
        const query = "SELECT * FROM Porta ORDER BY Nome";

        database.query(query, (error, data) => {
            if (error) {
                console.error("Erro ao buscar portas:", error);
                return response.status(500).json({ error: "Erro ao buscar portas." });
            }

            return response.status(200).json(data);
        });
    } catch (error) {
        console.error("Erro ao buscar portas:", error);
        response.status(500).json({ error: "Erro ao buscar portas." });
    }
};