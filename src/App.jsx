import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import loginService from './services/login'
import blogService from './services/blog'


const App = () => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)
  const [blog,setBlog] = useState({
    title: '',
    author: '',
    url:'',
    likes: 0
  })
  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedUserObj')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      console.log(loggedUser.token)
      blogService.setToken(loggedUser.token)
    }
  },[])

  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const loggeduser = await loginService.login( {username,password} )

      window.localStorage.setItem('loggedUserObj',JSON.stringify(loggeduser))
      blogService.setToken(loggeduser.token)
      setUser(loggeduser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
    }
  }
  const addBlog = async (event) => {
    event.preventDefault()
    try{
      delete blog._id
      const blogCreated = await blogService.createBlog( blog )
      setBlog(blogCreated)
    } catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <label>Username: </label>
      <input type='text' value={username} name='username'
      onChange={(event) => setUsername(event.target.value)}/>
      <label>Password: </label>
      <input type='password' value={password} name='password'
      onChange={(event) => setPassword(event.target.value)}/>
      <button type='submit'>Login</button>
    </form>
  )
  const blogForm = () => (
    <form onSubmit={addBlog}>
      <label>Title : </label>
      <input type='text' name='title' value={blog.title} 
      onChange={(event) => setBlog({...blog,title:event.target.value})}/>
      <label>Author : </label>
      <input type='text' name='author' value={blog.author}
      onChange={(event) => setBlog({...blog,author:event.target.value})}/>
      <label>Likes : </label>
      <input type='number' name='likes' value={blog.likes}
      onChange={(event) => setBlog({...blog,likes:event.target.value})}/>

      <button type='submit'>Save</button>
    </form>
  )
return (
  <div>
    {!user && loginForm()}
    {user && <div><p>{user.name} logged in</p>
    <p>{user.token}</p>
    {blogForm()}</div>}
  </div>
)
}
export default App