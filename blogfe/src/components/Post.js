import React from 'react'
import {Link} from 'react-router-dom'
import {format} from 'date-fns'

export default function Post({_id,title, summary, cover, content, createdAt, author}){
  return (
    <div className='post'>
    <div className='image'>
      <Link to={`/post/${_id}`}>
        <img alt='' src={'https://blog-1-0bqs.onrender.com/'+ cover}></img>
      </Link>
    </div>
    <div className='texts'>
      <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
      </Link>
    <p className='info'>
      <span>
        <a className='author' href='/'>{author.username}</a>
        <time>{format(new Date(createdAt), 'MMM d, yyyy HH: mm')}</time>
      </span>
    </p>
    <p className='summary'>{summary}</p>
    </div>
  </div>
  )
}
