import { useState } from 'react'

type Props = {
	id: number
	licensePlate: string
	brand: string
	model: string
	fuelLevel: number
	onTake: (vehicleId: number) => void
}

export default function VehicleCard({ id, licensePlate, brand, model, fuelLevel, onTake }: Props) {
	const [isOpen, setIsOpen] = useState(false)

	const handleConfirm = () => {
		onTake(id)
		setIsOpen(false)
	}

	return (
		<>
			<div className="card border border-base-content/10 transition-all duration-200 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10">
				<div className="card-body">
					<div className="flex items-start justify-between">
						<h5 className="card-title text-lg mb-2.5">
							{brand} {model}
						</h5>
						<span className="icon-[tabler--truck] size-8 text-blue-500" />
					</div>
					<p className="text-base-content/60 text-sm mb-1">{licensePlate}</p>
					<p className="text-base-content/60 text-sm mb-4">Fuel level: {fuelLevel}%</p>
					<button type="button" className="btn btn-accent text-white w-full" onClick={() => setIsOpen(true)}>
						Take vehicle
					</button>
				</div>
			</div>

			<div
				className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
					isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
				}`}>
				<div
					className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
						isOpen ? 'opacity-100' : 'opacity-0'
					}`}
					onClick={() => setIsOpen(false)}
				/>
				<div
					className={`relative z-10 bg-base-100 rounded-lg shadow-xl w-full max-w-sm mx-4 p-6 transition-all duration-300 ${
						isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
					}`}>
					<h3 className="text-lg font-semibold mb-2">Take vehicle</h3>
					<p className="text-base-content/70 mb-6">
						Are you sure you want to take{' '}
						<span className="font-medium text-base-content">
							{brand} {model}
						</span>{' '}
						({licensePlate})?
					</p>
					<div className="flex justify-end gap-2">
						<button type="button" className="btn btn-soft btn-secondary" onClick={() => setIsOpen(false)}>
							Cancel
						</button>
						<button type="button" className="btn btn-accent text-white" onClick={handleConfirm}>
							<span className="icon-[tabler--check] size-4" />
							Confirm
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
