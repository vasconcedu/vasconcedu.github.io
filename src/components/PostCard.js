import { Col, Card, Button } from 'react-bootstrap'

const PostCard = ({ cap, alt, title, headline, updated, btn, href }) => {
  return (

    <Col sm={12} md={6} xl={3} className="d-flex align-items-stretch">
      <Card className="my-card mt-5 shadow">

        <Card.Img variant="top" src={cap} className="img-fluid" alt={alt} />

        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            <p>{headline}</p>
            <p><small className="text-muted">Last updated {updated}</small></p>
          </Card.Text>
          <Button className="my-card-btn stretched-link" variant="primary" href={href}>{btn}</Button>
        </Card.Body>

      </Card>
    </Col>

  )
}

export default PostCard