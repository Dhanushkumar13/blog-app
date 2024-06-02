import React, { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext';

export const Header = () => {
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(()=>{
    fetch('https://blog-1-0bqs.onrender.com/profile', { 
    }).then(response => {
      response.json().then(res =>{
        setUserInfo(userInfo);
      })
    })
  },[])

  async function logout(){
    await fetch('https://blog-1-0bqs.onrender.com/logout', {
      method: 'POST',
    })
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
    <Link to='/' className='logo'>MyBlog</Link>
    <nav>
      {username && (
        <>
          <Link to='/create'>Create new post</Link>
          <a onClick={logout}>Logout</a>
        </>
      )}
      {!username && (
        <>
          <Link to='/login'>Login</Link>
          <Link to='/register'>Signup</Link>
        </>
      )}
    </nav>
  </header>  
  )
}
 