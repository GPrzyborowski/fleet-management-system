import { useState, useEffect } from 'react'

declare global {
	interface Window {
		HSOverlay: {
			autoInit: () => void
		}
	}
}

type Props = {
	id: number
	licensePlate: string
	brand: string
	model: string
	year: number
	status: string
	updateHandler: (
		id: number,
		licensePlate: string,
		brand: string,
		model: string,
		year: number,
		status: string,
	) => Promise<void>
	onUpdate: () => void
}

export default function EditVehicleModal({
	id,
	licensePlate,
	brand,
	model,
	year,
	status,
	updateHandler,
	onUpdate,
}: Props) {
	const [editLicensePlate, setEditLicensePlate] = useState(licensePlate)
	const [editBrand, setEditBrand] = useState(brand)
	const [editModel, setEditModel] = useState(model)
	const [editYear, setEditYear] = useState(year)
	const [editStatus, setEditStatus] = useState(status)

	useEffect(() => {
		if (window.HSOverlay) {
			window.HSOverlay.autoInit()
		}
	}, [])

	return (
		<>
			<button
				type="button"
				className="btn btn-circle btn-text btn-sm"
				aria-haspopup="dialog"
				aria-expanded="false"
				aria-controls={`edit-vehicle-modal-${id}`}
				data-overlay={`#edit-vehicle-modal-${id}`}>
				<span className="icon-[tabler--pencil] size-5"></span>
			</button>

			<div
				id={`edit-vehicle-modal-${id}`}
				className="overlay modal modal-middle overlay-open:opacity-100 overlay-open:duration-300 hidden"
				role="dialog"
				tabIndex={-1}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="modal-title">Edit vehicle</h3>
							<button
								type="button"
								className="btn btn-text btn-circle btn-sm absolute end-3 top-3"
								aria-label="Close"
								data-overlay={`#edit-vehicle-modal-${id}`}>
								<span className="icon-[tabler--x] size-4"></span>
							</button>
						</div>
						<form
							onSubmit={async e => {
								e.preventDefault()
								await updateHandler(id, editLicensePlate, editBrand, editModel, editYear, editStatus)
								onUpdate()
							}}>
							<div className="modal-body pt-0 flex flex-col gap-4">
								<div>
									<label className="label-text cursor-text">License plate</label>
									<input
										type="text"
										className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										defaultValue={editLicensePlate}
										onChange={e => setEditLicensePlate(e.target.value)}
									/>
								</div>
								<div className="flex gap-4 max-sm:flex-col">
									<div className="w-full">
										<label className="label-text cursor-text">Brand</label>
										<input
											type="text"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											defaultValue={editBrand}
											onChange={e => setEditBrand(e.target.value)}
										/>
									</div>
									<div className="w-full">
										<label className="label-text cursor-text">Model</label>
										<input
											type="text"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											defaultValue={editModel}
											onChange={e => setEditModel(e.target.value)}
										/>
									</div>
								</div>
								<div className="flex gap-4 max-sm:flex-col">
									<div className="w-full">
										<label className="label-text cursor-text">Year</label>
										<input
											type="text"
											className="input w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
											defaultValue={editYear}
											onChange={e => setEditYear(Number(e.target.value))}
										/>
									</div>
								</div>
								<div>
									<label className="label-text cursor-text">Status</label>
									<select
										className="select w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
										value={editStatus}
										onChange={e => setEditStatus(e.target.value)}>
										<option value="available">Available</option>
										<option value="unavailable">Not available</option>
									</select>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-soft btn-secondary" data-overlay={`#edit-vehicle-modal-${id}`}>
									Cancel
								</button>
								<button type="submit" className="btn btn-accent">
									Save changes
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}
