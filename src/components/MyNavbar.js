import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link } from 'react-router-dom'
import logo from '../images/logo.png'

const MyNavbar = () => {
  return (

    <div className="bg-dark w-100 mt-0 my-navbar-div mb-5">
      <Container>
        <Navbar variant="dark" expand="lg">
          <Container className="ps-0 pe-0">
            <Navbar.Brand as={Link} to="/">
              <img
                src={logo}
                alt="Logo"
                width="48"
                height="48"
                className="d-inline-block align-top"
              />{' '}
            </Navbar.Brand>
            <Navbar.Toggle className="ms-auto" aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto me-auto text-center">
                <Nav.Link className="fs-5 ms-lg-2" href="https://github.com/vasconcedu/my-resume/blob/master/resume.pdf" target="_blank" rel="noreferrer">Resume</Nav.Link>
                <Nav.Link className="fs-5 ms-lg-2" href="https://www.linkedin.com/in/vasconcedu/" target="_blank" rel="noreferrer">LinkedIn</Nav.Link>
                <Nav.Link className="fs-5 ms-lg-2" href="https://github.com/vasconcedu" target="_blank" rel="noreferrer">GitHub</Nav.Link>
                <Nav.Link className="fs-5 ms-lg-2" href="mailto:eduardo@eduardovasconcelos.com" target="_blank" rel="noreferrer">Contact</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>
    </div>
    
  )
}

export default MyNavbar
