// export const API_ROOT = 'http://localhost:8017'

let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-bi8b.onrender.com'
}

console.log('API Root', apiRoot)

export const API_ROOT = apiRoot