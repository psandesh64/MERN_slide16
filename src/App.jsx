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
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url:'',
    likes: 0
  })
  const [blogs,setBlogs] =  useState([])
  
  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedUserObj')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      console.log(loggedUser.token)
      blogService.setToken(loggedUser.token)
    }
  },[])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedBlogs = await blogService.getBlogs();
      setBlogs(fetchedBlogs);
    };
  
    fetchData();
  }, [newBlog]);
  

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
      const blogCreated = await blogService.createBlog( newBlog )
      // delete newBlog._id
      setNewBlog({
        title: '',
        author: '',
        url:'',
        likes: 0,
      })
    
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
      <input type='text' name='title' value={newBlog.title} 
      onChange={(event) => setNewBlog({...newBlog,title:event.target.value})}/>
      <label>Author : </label>
      <input type='text' name='author' value={newBlog.author}
      onChange={(event) => setNewBlog({...newBlog,author:event.target.value})}/>
      <label>Likes : </label>
      <input type='number' name='likes' value={newBlog.likes}
      onChange={(event) => setNewBlog({...newBlog,likes:event.target.value})}/>

      <button type='submit'>Save</button>
    </form>
  )
  if (user === null) {
    return (
      <div>
        <h2>Log in to Application</h2>
        {loginForm()}
      </div>
    )
  }

return (
  <div>
    <div>
    <h2>Blogs</h2>
    <button onClick={()=> {window.localStorage.removeItem('loggedUserObj');setUser(null)}}>Logout</button>
    </div>
    <div style={{margin:"10px"}}>{blogForm()}</div>
    {blogs.map(blog => (
      <div key={blog._id}>
        <h3>Title : {blog.title}</h3>
        <p>Author : {blog.author}</p>
        <span>Likes : {blog.likes}</span>
      </div>
    ))}
  </div>
)
}
export default App