import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const createBlog = async params => {
    const config = {
        headers: { Authorization: token }
    }
    console.log(config.headers)
    const response = await axios.post(baseUrl,params,config)
    return response.data
}

const getBlogs = async () =>{
    const response = await axios.get(baseUrl)
    return response.data
}

export default { createBlog, setToken, getBlogs }