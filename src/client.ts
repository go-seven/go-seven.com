const basePath = "https://api.go-seven.com/v1"

const headersForJson = {
  "Accept": "application/json",
  "Content-Type": "application/json",
}

const headersWithAuthentication = (token) => ({
  ...headersForJson,
  Authorization: `BEARER ${token}`,
})

const checkResponse = (response) => {
  if (response.ok) {
    return response.json()
  } else {
    return response.json().then(({ error }) => {
      // Pass error data as string in Error message. See parseError function below.
      throw new Error(JSON.stringify(error))
    })
  }
}

// Strip initial "Error :" in stringified error and return result parsed as JSON.
export const parseError = (error: Error) => (
  JSON.parse(error.toString().substring("Error :".length))
)

const client = (method, endpoint, token?) => {
  const headers = token ? headersWithAuthentication(token) : headersForJson

  return fetch(`${basePath}${endpoint}`, { headers, method }).then(checkResponse)
}

const clientSend = (method, endpoint, data, token?) => {
  const body = JSON.stringify(data)
  const headers = token ? headersWithAuthentication(token) : headersForJson

  return fetch(`${basePath}${endpoint}`, { body, headers, method }).then(checkResponse)
}

export const del = (endpoint, token) => client("DELETE", endpoint, token)

export const get = (endpoint, token?) => client("GET", endpoint, token)

export const put = (endpoint, data, token?) => clientSend("PUT", endpoint, data, token)

export const post = (endpoint, data, token?) => clientSend("POST", endpoint, data, token)
