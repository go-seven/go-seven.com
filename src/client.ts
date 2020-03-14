declare type TEndpoint = string
declare type TToken = string

const basePath = 'https://api.go-seven.com/v1'

const headersForJson = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

const headersWithAuthentication = (token: TToken) => ({
  ...headersForJson,
  Authorization: `BEARER ${token}`
})

const checkResponse = (response) => {
  if (response.ok) {
    return response.json()
  } else {
    return response.json().then(({ error }) => {
      throw new Error(error)
    })
  }
}

const client = (method, endpoint: TEndpoint, token?) => {
  const headers = token ? headersWithAuthentication(token) : headersForJson

  return fetch(`${basePath}${endpoint}`, { headers, method }).then(checkResponse)
}

const clientSend = (method, endpoint, data, token?) => {
  const body = JSON.stringify(data)
  const headers = token ? headersWithAuthentication(token) : headersForJson

  return fetch(`${basePath}${endpoint}`, { body, headers, method }).then(checkResponse)
}

export const del = (endpoint, token) => client('DELETE', endpoint, token)

export const get = (endpoint, token?) => client('GET', endpoint, token)

export const put = (endpoint, data, token?) => clientSend('PUT', endpoint, data, token)

export const post = (endpoint, data, token?) => clientSend('POST', endpoint, data, token)
