import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}
    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    constructor() {

        fs.readFile(databasePath, 'utf8').then((data) => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })

    }

    hasId(table, id) {
        const task = this.#database[table].some((task) => task.id === id)

        if (!task) {
            return false;
        }

        return true;
    }

    select(table, search) {
        let data = this.#database[table] ?? []

        if (search) {
            data = data.filter(item => {
                return Object.entries(search).some(([key, value]) => {
                    return item[key].includes(value)
                })
            })
        }

        return data
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data);
        } else {
            this.#database[table] = [data]
        }

        this.#persist()

        return data
    }

    update(table, id, data) {
        const indexTask = this.#database[table].findIndex((task) => task.id === id)
        const task = this.#database[table].find((task) => task.id === id)

        if (indexTask > -1) {
            this.#database[table][indexTask] = { ...task, updated_at: new Date(), ...data }
            this.#persist()
        }
    }

    delete(table, id) {
        const indextask = this.#database[table].findIndex((task) => task.id === id)

        if (indextask > -1) {
            this.#database[table].splice(indextask, 1)
            this.#persist()
        }
    }

    patch(table, id) {
        const indexTask = this.#database[table].findIndex((task) => task.id === id)
        const task = this.#database[table].find((task) => task.id === id)

        if (indexTask > -1 && task.completed_at == null) {
            this.#database[table][indexTask] = { ...task, completed_at: new Date(), updated_at: new Date() }
            this.#persist()
            return;
        }

        if (indexTask > -1 && task.completed_at != null) {
            this.#database[table][indexTask] = { ...task, completed_at: null, updated_at: new Date() }
        }
    }
}