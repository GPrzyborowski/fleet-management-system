import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function Home() {
	return (
		<>
			<Header text="Fleet management system" />
			<img className="mb-32 lg:mb-24 mx-auto" src="/hero.png" alt="trucks standing next to each other" />
			<div className="flex justify-center">
				<Link
					to="/login"
					className="btn btn-accent btn-wide sm:w-auto px-12 py-6 text-white shadow-md hover:bg-primary-focus transition-colors flex items-center justify-center no-underline">
					Go to dashboard
				</Link>
			</div>
		</>
	)
}
