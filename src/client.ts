
const basePath = "https://api.go-seven.com/v1"

const headersForJson = {
  "Accept": "application/json",
  "Content-Type": "application/json",
}

const headersWithAuthentication = (token) => ({
  ...headersForJson,
  'Authorization': `BEARER ${token}`,
})

const checkResponse = (response) => {
  if (response.ok) {
    return response.json()
  } else {
    throw new Error(response.statusText)
  }
}

function client(method, endpoint, data, token?) {
  const body = JSON.stringify(data)
  const headers = token ? headersWithAuthentication(token) : headersForJson

  return fetch(`${basePath}${endpoint}`, { body, headers, method }).then(checkResponse)
}

export function post(endpoint, data, token?) {
  return client("POST", endpoint, data, token)
}
