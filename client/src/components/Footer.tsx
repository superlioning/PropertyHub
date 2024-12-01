import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-light">
      <div className="container">
        <div className="row py-4">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <h5 className="mb-3">PropertyHub</h5>
            <p className="text-muted">Making your property dreams come true.</p>
            <div className="social-links">
              <a href="#" className="me-3 text-secondary">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="me-3 text-secondary">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="me-3 text-secondary">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-secondary">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          <div className="col-lg-2 mb-4 mb-lg-0">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Contact
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Terms
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
          <div className="col-lg-6">
            <h6 className="mb-3">Newsletter</h6>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="text-center pt-3">
          <span className="text-muted">
            © 2024 PropertyHub. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;