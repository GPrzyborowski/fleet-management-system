import { useState, useEffect } from 'react'

type Props = {
	addHandler: (
		licensePlate: string,
		brand: string,
		model: string,
		year: number,
		mileage: number,
		fuelLevel: number,
		status: string,
	) => Promise<void>
	onUpdate: () => void
}

export default function NewVehicleModal({ addHandler, onUpdate }: Props) {
	const [licensePlate, setLicensePlate] = useState('')
	const [brand, setBrand] = useState('')
	const [model, setModel] = useState('')
	const [year, setYear] = useState('')
	const [mileage, setMileage] = useState('')
	const [fuelLevel, setFuelLevel] = useState('')
	const [status, setStatus] = useState('available')

	useEffect(() => {
		const init = async () => {
			await import('flyonui/flyonui')
		}
		init()
	}, [])

	return (
		<>
			<button
				type="button"
				className="btn btn-accent w-fit self-end py-6 mb-4 text-white shadow-md hover:bg-primary-focus transition-colors"
				aria-haspopup="dialog"
				aria-expanded="false"
				aria-controls="new-vehicle-modal"
				data-overlay="#new-vehicle-modal">
				<span className="icon-[tabler--plus] size-6"></span>
			</button>
			<div
				id="new-vehicle-modal"
				className="overlay modal modal-middle overlay-open:opacity-100 overlay-open:duration-300 hidden"
				role="dialog"
				tabIndex={-1}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="modal-title">Add vehicle</h3>
							<button
								type="button"
								className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
								aria-label="Close"
								data-overlay="#new-vehicle-modal">
								<span className="icon-[tabler--x] size-4"></span>
							</button>
						</div>
						<form
							onSubmit={async e => {
								e.preventDefault()
								await addHandler(licensePlate, brand, model, Number(year), Number(mileage), Number(fuelLevel), status)
								onUpdate()
							}}>
							<div className="modal-body pt-0 flex flex-col gap-4">
								<div className="flex gap-4 max-sm:flex-col">
									<div className="w-full">
										<label className="label-text cursor-text">Brand</label>
										<input
											type="text"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											value={brand}
											onChange={e => setBrand(e.target.value)}
											required
										/>
									</div>
									<div className="w-full">
										<label className="label-text cursor-text">Model</label>
										<input
											type="text"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											value={model}
											onChange={e => setModel(e.target.value)}
											required
										/>
									</div>
								</div>
								<div>
									<label className="label-text cursor-text">License plate</label>
									<input
										type="text"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										value={licensePlate}
										onChange={e => setLicensePlate(e.target.value)}
										required
									/>
								</div>
								<div className="flex gap-4 max-sm:flex-col">
									<div className="w-full">
										<label className="label-text cursor-text">Year of manufacture</label>
										<input
											type="number"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											value={year}
											onChange={e => setYear(e.target.value)}
											min={1900}
											max={new Date().getFullYear()}
											required
										/>
									</div>
									<div className="w-full">
										<label className="label-text cursor-text">Current mileage (km)</label>
										<input
											type="number"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											value={mileage}
											onChange={e => setMileage(e.target.value)}
											min={0}
											required
										/>
									</div>
								</div>
								<div>
									<label className="label-text cursor-text">Fuel level (%)</label>
									<input
										type="number"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										value={fuelLevel}
										onChange={e => setFuelLevel(e.target.value)}
										min={0}
										max={100}
										required
									/>
								</div>
								<div>
									<label className="label-text cursor-text">Status</label>
									<select
										className="select w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										value={status}
										onChange={e => setStatus(e.target.value)}>
										<option value="available">Available</option>
										<option value="unavailable">Not available</option>
									</select>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-soft btn-secondary" data-overlay="#new-vehicle-modal">
									Cancel
								</button>
								<button type="submit" className="btn btn-accent">
									Add vehicle
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}
