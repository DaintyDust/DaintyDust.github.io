import Background from "@/features/Background/Index";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <>
      <Background />
      <div className="page-content">
        <div className="error-code">404</div>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-description">Oops! Something went wrong.</p>
        <p className="error-description">We can’t find the page you’re looking for.</p>

        <div className="error-actions">
          <Link className="button" to="/" onClick={() => window.history.back()}>
            Go Back
          </Link>
          <a href="/" className="button">
            Home Page
          </a>
          <a href="/linktree" className="button">
            View Links
          </a>
        </div>
      </div>
    </>
  );
}

export default NotFound;
