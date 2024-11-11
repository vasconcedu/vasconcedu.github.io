import './App.css'
import './css/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css'
import { Routes, Route } from 'react-router-dom'
import Main from './components/Main'
import MyNavbar from './components/MyNavbar'
import Container from 'react-bootstrap/Container'
import Post from './components/Post'
import NotFound from './components/NotFound';

function App() {
  return (

    <div>
      <MyNavbar />
      <Container className="mt-5"> 

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/blog/:slug" element={<Post />} />
          <Route path="*" status={404} element={<NotFound />} />
        </Routes>

      </Container>
    </div>

  )
}

export default App
