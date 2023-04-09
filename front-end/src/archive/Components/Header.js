import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom'
import logo from "../images/logo.png";

function Header({userName, isAuthenticated, oktaAuth}){
    const logout = async () => {
        await oktaAuth.signOut();
    }
    
      if (isAuthenticated){
        return (
          <>
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" rel="stylesheet" />
            
            <div id="page-container">
                <header>
                    <div className="flex_header_right">
                        <div className="parent">
                            <div className="left">
                                <div className="d-flex flex-column flex-md-row align-items-center p-2 px-md-4 mb-3 bg-white border-bottom box-shadow">
                                    <h5 className="my-0 mr-md-auto font-weight-normal">
                                    <Link className="p-2 text-dark" to="/"><img src={logo} alt="Verisave Company Logo"/></Link>
                                    </h5>
                                    <span style={{ width:"100%", textAlign:"center"}}className="p-2 text-dark" >Welcome {userName.split(" ")[0]}!</span>
                                    <nav className="my-2 my-md-0 mr-md-3">
                                        
                                        <Link className="p-2 text-dark" to="/Statements">Statements</Link>
                                        {/* <Link className="p-2 text-dark" href="#">Page2</Link>
                                        <Link className="p-2 text-dark" href="#">Page3</Link>
                                        <Link className="p-2 text-dark" href="#">Page4</Link> */}
                                    </nav>
                                    <Link className="btn btn-outline-primary" to="#" onClick={logout}>Logout</Link>
                                </div>
                            </div> 
                        </div>
                    </div>
                </header>  
             </div>
          </>
        );
    } //if
} //Header Function


export default Header;