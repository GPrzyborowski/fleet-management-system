import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {

	const navigate = useNavigate()

	const handleLogout = () => {
		localStorage.removeItem('token')
		navigate('/')
	}

	return (
		<nav className="navbar rounded-box shadow-base-300/20 shadow-sm">
			<div className="w-full md:flex md:items-center md:gap-2">
				<div className="flex items-center justify-between">
					<div className="navbar-start items-center justify-between justify-end max-md:w-full">
						<div className="md:hidden">
							<button
								type="button"
								className="collapse-toggle btn btn-outline border-none btn-secondary btn-sm btn-square"
								data-collapse="#default-navbar-collapse"
								aria-controls="default-navbar-collapse"
								aria-label="Toggle navigation">
								<span className="icon-[tabler--menu-2] collapse-open:hidden size-4 text-base-content"></span>
								<span className="icon-[tabler--x] collapse-open:block hidden size-4 text-base-content"></span>
							</button>
						</div>
					</div>
				</div>
				<div
					id="default-navbar-collapse"
					className="md:navbar-end collapse hidden grow basis-full overflow-hidden transition-[height] duration-300 max-md:w-full">
					<ul className="menu md:menu-horizontal gap-2 p-0 text-base max-md:mt-2">
						<li>
							<Link to="/dashboard" className="menu-item">
								Dashboard
							</Link>
						</li>
						<li>
							<button className="menu-item w-full" onClick={handleLogout}>
								Log out
							</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	)
}
