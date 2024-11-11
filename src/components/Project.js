import { Col, Card, Button } from 'react-bootstrap'

const Project = ({ title, text, btn, href, cursor}) => {
  return (
    
    <Col sm={12} md={6} xl={3} className="d-flex align-items-stretch">
      <Card className="my-card mt-5 shadow">
        
        <Card.Body>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-folder-fill mb-2" viewBox="0 0 16 16">
            <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a2 2 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3m-8.322.12q.322-.119.684-.12h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981z"/>
          </svg>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            <p>{text}</p>
          </Card.Text>
          <Button className="my-card-btn stretched-link" variant="primary" href={href} style={{ cursor: `url(${cursor}), auto` }}>{btn}</Button>
        </Card.Body>

      </Card>
    </Col>

  )
}

export default Project
