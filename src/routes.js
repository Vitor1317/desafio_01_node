import { randomUUID } from 'node:crypto'
import { Database } from './database.js';
import { buildRouteUrl } from './utils/build-route-url.js';

const database = new Database()

export const routes = [
    {
        method: 'GET',
        url: buildRouteUrl('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const tasks = database.select('tasks', search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        url: buildRouteUrl('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;

            if (!title) {
                return res.writeHead(400).end(JSON.stringify({ message: "The title is required" }))
            }

            if (!description) {
                return res.writeHead(400).end(JSON.stringify({ message: "The description is required" }))
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date()
            }

            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        url: buildRouteUrl('/tasks/:id'),
        handler: (req, res) => {
            const { title, description } = req.body;
            const { id } = req.params

            if (!database.hasId('tasks', id)) {
                return res.writeHead(404).end()
            }

            if (!title && !description) {
                return res.writeHead(400).end(JSON.stringify({ message: "title or description is required" }))
            }

            database.update('tasks', id, { title, description })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        url: buildRouteUrl('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            if (!database.hasId('tasks', id)) {
                return res.writeHead(404).end()
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        url: buildRouteUrl('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            if (!database.hasId('tasks', id)) {
                return res.writeHead(404).end()
            }

            database.patch('tasks', id)

            return res.writeHead(204).end()
        }
    },
]