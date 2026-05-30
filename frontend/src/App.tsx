import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Vehicles from './pages/Vehicles'
import VehicleDetails from './pages/VehicleDetails'

function App() {
	const location = useLocation()
	const hideNavbar = ['/', '/login', '/forgot-password', '/reset-password'].includes(location.pathname)
	return (
		<>
			{!hideNavbar && <Navbar />}
			<AnimatePresence mode="wait">
				<Routes location={location} key={location.pathname}>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/forgot-password" element={<ForgotPassword />} />
					<Route path="/reset-password" element={<ResetPassword />} />
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
					<Route
						path="/vehicles"
						element={
							<ProtectedRoute>
								<Vehicles />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/vehicles/:id"
						element={
							<ProtectedRoute>
								<VehicleDetails />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</AnimatePresence>
		</>
	)
}

export default App
