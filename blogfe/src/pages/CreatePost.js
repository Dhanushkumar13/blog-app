import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import {Navigate} from 'react-router-dom'
import Editor from "../Editor";


export default function CreatePost(){
    const [title, setTitle]= useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState('')

    async function createNewPost(e){
      e.preventDefault();
      const data = new FormData();
      data.set('title', title);
      data.set('summary', summary);
      data.set('content', content);
      data.set('file', files[0]);
      
      fetch('https://blog-appbe.onrender.com/post',{
        method: 'POST',
        body: data,
      }).then(response => {
        if (response.ok) {
          setRedirect(true)
          // Handle success, e.g., redirect to another page
        } else {
          console.error('Failed to create post');
          // Handle error
        }
      }).catch(error => {
        console.error('Error creating post:', error);
        // Handle error
      });

    }

    if(redirect){
      return <Navigate to={'/'}></Navigate>
    }

    return(
        <form onSubmit={createNewPost}>
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <input type="text" placeholder="Summary" value={summary} onChange={e => setSummary(e.target.value)} />
            <input type="file" onChange={e => setFiles(e.target.files)} />
            <Editor value={content} onChange={setContent}/>
            <button style={{marginTop: '5px'}} type="submit">Create Post</button>
        </form>
    )
}
