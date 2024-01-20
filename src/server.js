import { createServer } from 'node:http'
import { json } from './middleware/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'

const server = createServer(async (req, res) => {
    const { url, method } = req

    await json(req, res);

    const route = routes.find((route) => {
        return route.method === method && route.url.test(url)
    })

    if (route) {
        const urlParams = req.url.match(route.url)

        const { query, ...params } = urlParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3333)