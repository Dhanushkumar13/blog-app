import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './index.css';
// import { Post } from './components/Post';
import IndexPage from './pages/IndexPage';
import { LoginPage } from './pages/LoginPage';
import Layout from './components/Layout';
import RegisterPage from './pages/RegisterPage';
import {UserContextProvider} from './UserContext';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';

function App() {
  return (
    <UserContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout/>}>
          <Route index element={<IndexPage />} />
          <Route path='/register' element={<RegisterPage/>}></Route>
          <Route path='/login' element={<LoginPage />}></Route>
          <Route path='/create' element={<CreatePost/>}></Route>
          <Route path='/post/:id' element={<PostPage/>}></Route>
          <Route path='/edit/:id'element={<EditPost/>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContextProvider>

  );
}

export default App;
