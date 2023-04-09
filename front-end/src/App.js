import logo from './assets/Verisave-Logo-2c-White.png';
import iconProfile from './assets/user-circle.svg';
import iconLogout from './assets/logout.svg';
import iconSearch from './assets/search.svg';
import './App.css';

function App() {
  return (
    <header class="sticky-header">
		<div class="logo-container">
		    <img src={logo} alt="Verisave" class="h-[50px] py-1 px-1"/>
		</div>
		<div class="columns-3 flex float-right">
		    <div class="search-box flex px-2">
		        <input type="text" placeholder="Search" class="search bg-neutral-300 text-black text-sm my-2 px-2 py-1 h-[32px]"/>
		    	<button type="submit" class="bg-zinc-400 button-fit-to-input my-2 h-[32px] w-[32px]">
					<img src={iconSearch} alt="Go" />
				</button>
			</div>
		    <div class="profile-name flex py-4 px-2 text-sm text-zinc-400">
		    	<img src={iconProfile} alt="" class="w-[20px] h-[20px] mr-1"/>
		        Profile Name
		    </div>
		    <div class="logout flex py-4 px-2 text-sm">
		        <a href="/" class="text-yellow-300">
		            Logout
					<img src={iconLogout} alt="Logout" class="inline w-[20px] h-[20px] ml-1"/>
		        </a>
		    </div>
		</div>
	</header>
  );
}
export default App;