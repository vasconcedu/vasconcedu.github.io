import { Row, Col } from 'react-bootstrap';
import notFound from '../images/404.png';

const NotFound = () => {
  return (

    <div class="mt-5">
        <Row>
            <Col sm={12} xl={6}>
                <img src={notFound} alt="404" class="img-fluid shadow mb-5 my-404-img" />
            </Col>
            <Col sm={12} xl={6}>
                <h1>404</h1>
                <h2>Page not found</h2>
                <p>Sorry, the page you are looking for does not exist.</p>
                <p><a href="/">Go to home</a>.</p>
            </Col>
        </Row>
    </div>
  )
}

export default NotFound
