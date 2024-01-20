export function buildRouteUrl(path) {
    const routeParameters = /:([a-zA-Z]+)/g
    const urlWithParams = path.replaceAll(routeParameters, '(?<$1>[a-z0-9\-_]+)')

    const urlRegex = new RegExp(`^${urlWithParams}(?<query>\\?(.*))?$`)

    return urlRegex
}