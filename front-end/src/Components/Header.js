import '../App.css';
import React from 'react';
import { Link } from 'react-router-dom'
import logo from '../assets/Verisave-Logo-2c-White.png';
import iconProfile from '../assets/user-circle.svg';
import iconLogout from '../assets/logout.svg';
import iconSearch from '../assets/search.svg';

function Header({userName, isAuthenticated, oktaAuth}){
    const logout = async () => {
        await oktaAuth.signOut();
    }
    
      if (isAuthenticated){
        return (
            <header className="sticky-header">
                <div className="logo-container">
                    <img src={logo} alt="Verisave" className="h-[50px] py-1 px-1"/>
                </div>
                <div className="columns-3 flex float-right">
                    <div className="search-box flex px-2">
                        <input type="text" placeholder="Search" className="search bg-neutral-300 text-black text-sm my-2 px-2 py-1 h-[32px]"/>
                        <button type="submit" className="bg-zinc-400 button-fit-to-input my-2 h-[32px] w-[32px]">
                            <img src={iconSearch} alt="Go" />
                        </button>
                    </div>
                    <div className="profile-name flex py-4 px-2 text-sm text-zinc-400">
                        <img src={iconProfile} alt="" className="w-[20px] h-[20px] mr-1"/>
                        {userName.split(" ")[0]}
                    </div>
                    <div className="logout flex py-4 px-2 text-sm">
                        <Link className="text-yellow-300" to="/" onClick={logout}>
                            Logout
                            <img src={iconLogout} alt="Logout" className="inline w-[20px] h-[20px] ml-1"  onClick={logout}/>
                        </Link>

                    </div>
                </div>
            </header>
        );
    } //if
} //Header Function


export default Header;