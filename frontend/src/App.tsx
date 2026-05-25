import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'

function App() {
	const location = useLocation()
	const hideNavbar = ['/', '/login'].includes(location.pathname)
	return (
		<>
			{!hideNavbar && <Navbar />}
			<AnimatePresence mode="wait">
				<Routes location={location} key={location.pathname}>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/employees"
						element={
							<ProtectedRoute>
								<Employees />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</AnimatePresence>
		</>
	)
}

export default App
