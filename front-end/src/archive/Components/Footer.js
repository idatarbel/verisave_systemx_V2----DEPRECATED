import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom';

function Footer(){
    const d = new Date();
    let year = d.getFullYear();
    return(
        <div className="container " style={{width: "100%"}} id="page-container">
            <footer 
                style={{ 
                    position: "fixed",
                    left: "0",
                    bottom: "0",
                    width: "100%",
                    color: "black",
                    paddingTop: "20px",
                    backgroundColor: "#F0F0F0"
                }}>
                <div className="row">
                    <div className="col-12 col-md">
                        <small className="d-block mb-3 text-muted">&copy; {year} Verisave, LLC</small>
                    </div>
                    <div className="col-9 col-md">
                        <h5>Resources</h5>
                        <ul className="list-unstyled text-small">
                        <li><Link className="text-muted" to="#">System X Documentation</Link></li>
                        <li><Link className="text-muted" to="#">Project Roadmap</Link></li>
                        <li><Link className="text-muted" target="_new" to="http://feenavigator.com">Fee Navigator</Link></li>
                        </ul>
                    </div>
                   
                    <div className="col-9 col-md">
                        <h5>Policies &amp; Procedures</h5>
                        <ul className="list-unstyled text-small">
                        <li><Link className="text-muted" to="#">Team</Link></li>
                        <li><Link className="text-muted" to="#">Locations</Link></li>
                        <li><Link className="text-muted" to="#">Privacy</Link></li>
                        <li><Link className="text-muted" to="#">Terms</Link></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;