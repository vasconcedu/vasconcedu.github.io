import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import posts from '../posts.json'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

const Post = () => {
  let { slug } = useParams()
  let navigate = useNavigate()
  let [post, setPost] = useState({})

  useEffect(() => {
    getPost()
  }, [])

  let getPost = async () => {
    let post = posts.posts.find(post => post.slug === slug)
    if (post === undefined) {
      navigate('/404')
    } else {
      post.text = await(await fetch(`../${process.env.PUBLIC_URL}/markdown/${post.slug}.md`)).text()
      setPost(post)
    }
  }

  return (
    <div>
      <h1>{post?.title}</h1>
      <h2>{post?.headline}</h2>
      <p><small className="text-muted">Last updated {post?.updated}</small></p>
      <p class="mt-5 fs-5"><ReactMarkdown rehypePlugins={[rehypeRaw]}>{post?.text}</ReactMarkdown></p>
    </div>
  )
}

export default Post