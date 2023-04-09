import iconClients from './assets/accounts.svg';
import iconAudit from './assets/document-text.svg';
import iconApprove from './assets/shield-checkw.svg';
import iconReports from './assets/accounts.svg';
import iconAdmin from './assets/users.svg';
import './Nav.css';

function Nav() {
    return (
        <nav class="fixed-navigation">
            <div class="nav-item">
                <a href="#">
                    <img src={iconClients} alt="" class="nav-item-icon"/>
                    Clients
                </a>
            </div>
            <div class="nav-item">
                <a href="#">
                    <img src={iconApprove} alt="" class="nav-item-icon"/>
                    Approve
                </a>
            </div>
            <div class="nav-item">
                <a href="#">
                    <img src={iconAudit} alt="" class="nav-item-icon"/>
                    Audit
                </a>
            </div>
            <div class="nav-item">
                <a href="#">
                    <img src={iconReports} alt="" class="nav-item-icon"/>
                    Reports
                </a>
            </div>
            <div class="nav-item">
                <a href="#">
                    <img src={iconAdmin} alt="" class="nav-item-icon"/>
                    Admin
                </a>
            </div>
        </nav>
    );
  }
export default Nav;