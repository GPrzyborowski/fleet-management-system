import { Link } from 'react-router-dom'

type Props = {
	title: string
	description: string
	icon: string
	links: string
}

export default function ActionCard({ title, description, icon, links }: Props) {
	return (
		<Link to={`/${links}`}>
			<div className="card border border-base-content/10 cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10">
				<div className="card-body">
					<div className="flex items-start justify-between">
						<h5 className="card-title mb-2.5">{title}</h5>
						<span className={`${icon} size-10 text-blue-500`}></span>
					</div>
					<p className="mb-4">{description}</p>
				</div>
			</div>
		</Link>
	)
}
