
const basePath = "https://api.go-seven.com/v1"

const headersForJson = {
  "Accept": "application/json",
  "Content-Type": "application/json",
}

const headersWithAuthentication = (token) => ({
  ...headersForJson,
  Authorization: `BEARER ${token}`,
})

class GoSevenApiError extends Error {
  constructor({ message }) {
    super(message)
  }

  toJSON() {
    return {
      message: this.message
    }
  }
}

const checkResponse = (response) => {
  if (response.ok) {
    return response.json()
  } else {
    return response.json().then(({ error }) => {
      throw new GoSevenApiError(error)
    })
  }
}

function client(method, endpoint, token?) {
  const headers = token ? headersWithAuthentication(token) : headersForJson

  return fetch(`${basePath}${endpoint}`, { headers, method }).then(checkResponse)
}

function clientSend(method, endpoint, data, token?) {
  const body = JSON.stringify(data)
  const headers = token ? headersWithAuthentication(token) : headersForJson

  return fetch(`${basePath}${endpoint}`, { body, headers, method }).then(checkResponse)
}

export function del(endpoint, token?) {
  return client("DELETE", endpoint, token)
}

export function get(endpoint, token?) {
  return client("GET", endpoint, token)
}

export function put(endpoint, data, token?) {
  return clientSend("PUT", endpoint, data, token)
}

export function post(endpoint, data, token?) {
  return clientSend("POST", endpoint, data, token)
}
