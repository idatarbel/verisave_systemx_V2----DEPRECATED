import iconClients from './assets/accounts.svg';
import iconAudit from './assets/document-text.svg';
import iconApprove from './assets/shield-checkw.svg';
import iconReports from './assets/accounts.svg';
import iconAdmin from './assets/users.svg';
import './Nav.css';

function Nav() {
    return (
        <nav className="fixed-navigation">
            <div className="nav-item">
                <a href="#">
                    <img src={iconClients} alt="" className="nav-item-icon"/>
                    Clients
                </a>
            </div>
            <div className="nav-item">
                <a href="#">
                    <img src={iconApprove} alt="" className="nav-item-icon"/>
                    Approve
                </a>
            </div>
            <div className="nav-item">
                <a href="#">
                    <img src={iconAudit} alt="" className="nav-item-icon"/>
                    Audit
                </a>
            </div>
            <div className="nav-item">
                <a href="#">
                    <img src={iconReports} alt="" className="nav-item-icon"/>
                    Reports
                </a>
            </div>
            <div className="nav-item">
                <a href="#">
                    <img src={iconAdmin} alt="" className="nav-item-icon"/>
                    Admin
                </a>
            </div>
        </nav>
    );
  }
export default Nav;