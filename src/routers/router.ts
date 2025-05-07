import { Router } from "express";
import database from "../database/config";

const router = Router();

interface Task {
    title: string
    description: string
    date: number | Date
    done: boolean
}

router.get('/tasks',async function(request,response):Promise <any | void> {
    try {
        const tasks = await (await database).query(`
            SELECT * FROM Tasks    
        `).then((res) => res[0]);
        return response.status(200).json({tasks});
    }
    catch (e) {
        console.log(e);
        return response.status(500).json({
            message: "Erro no servidor,tente novamente mais tarde."
        });
    };
});

router.post('/create-task', async function (request, response): Promise<any | void> {
    const body: Task = request.body;
    try {
        if (!body.title || !body.description) {
            return response.status(400).json({
                message: "Título ou descrição invalídos."
            });
        };
        (await database).query(`
            INSERT INTO Tasks (title,description,date,done) VALUES (?,?,?,?)
        `, [body.title, body.description, Date.now(), false]);
        return response.status(201).json({
            message: "Tarefa adicionada com sucesso."
        });
    }
    catch (e) {
        console.log(e);
        return response.status(500).json({
            message: "Erro no servidor,tente novamente daqui a pouco."
        });
    };
});
router.put('/update-task', async function (request, response): Promise<any | void> {
    const id = request.query.id as string;
    const body: Task = request.body;
    if (!body.title || !body.description) {
        return response.status(400).json({
            message: "Título ou descrição invalídos."
        });
    };
    try {
        const [task] = await (await database).query(`
            SELECT * FROM Tasks WHERE id = ?
        `, id).then((data: any) => data.find((t: any) => t));
        console.log(task)
        if (!task) {
            return response.status(404).json({
                message: "Tarefa não encontrada."
            });
        };
        !body.title ? body.title = task.title as string : '';
        !body.description ? body.description = task.description : '';

        (await database).query(`
            UPDATE Tasks SET title = ?,description = ? WHERE id = ? 
        `, [body.title, body.description, id]);
        return response.status(200).json({
            message: "Tarefa atualizada com sucesso."
        });
    }
    catch (e) {
        console.log(e);
        return response.status(500).json({
            message: "Erro no servidor,tente novamente mais tarde."
        });
    };
});
router.delete('/delete-task', async function (request, response): Promise<any> {
    const id = request.query.id;

    try {
        const [task] = await (await database).query(`
            SELECT * FROM Tasks WHERE id = ?
        `, id).then((data: any) => data.find((t: any) => t));
        if (!task) {
            return response.status(404).json({
                message: "Tarefa não encontrada."
            });
        };
        (await database).query(`DELETE FROM Tasks WHERE id = ?`,id);
        return response.status(200).json({
            message: "Tarefa deletada com sucesso."
        });
    }
    catch (e) {
        console.log(e);
        return response.status(500).json({
            message: "Erro no servidor,tente novamente mais tarde."
        });
    };
});
router.use(function (request, response): any {
    return response.status(404).json({
        message: "Rota ou endpoint não encontrado."
    });
});

export default router;