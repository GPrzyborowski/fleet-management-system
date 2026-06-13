import { useState, useEffect } from 'react'

type Props = {
	addHandler: (formData: FormData) => Promise<void>
	onUpdate: () => void
}

type FileInputProps = {
	label: string
	value: File | null
	onChange: (file: File) => void
}

function FileInput({ label, value, onChange }: FileInputProps) {
	return (
		<div>
			<label className="label-text cursor-text">{label}</label>
			<label className="flex items-center gap-2 cursor-pointer mt-1">
				<span className="btn btn-accent btn-sm">Choose file</span>
				<span className="text-sm text-base-content/60 truncate max-w-48">{value?.name ?? 'No file chosen'}</span>
				<input
					type="file"
					accept="image/*"
					className="sr-only"
					onChange={e => {
						const file = e.target.files?.[0]
						if (file) onChange(file)
					}}
				/>
			</label>
		</div>
	)
}

export default function NewVehicleModal({ addHandler, onUpdate }: Props) {
	const [licensePlate, setLicensePlate] = useState('')
	const [brand, setBrand] = useState('')
	const [model, setModel] = useState('')
	const [year, setYear] = useState('')
	const [mileage, setMileage] = useState('')
	const [fuelLevel, setFuelLevel] = useState('')
	const [status, setStatus] = useState('available')
	const [frontImage, setFrontImage] = useState<File | null>(null)
	const [leftImage, setLeftImage] = useState<File | null>(null)
	const [rightImage, setRightImage] = useState<File | null>(null)
	const [backImage, setBackImage] = useState<File | null>(null)

	useEffect(() => {
		const init = async () => {
			const flyonui = await import('flyonui/flyonui')
			if (typeof flyonui.HSStaticMethods?.autoInit === 'function') {
				flyonui.HSStaticMethods.autoInit()
			}
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
								const body = new FormData()
								body.append('licensePlate', licensePlate)
								body.append('brand', brand)
								body.append('model', model)
								body.append('year', year)
								body.append('mileage', mileage)
								body.append('fuelLevel', fuelLevel)
								body.append('status', status)
								if (frontImage) body.append('frontImage', frontImage)
								if (leftImage) body.append('leftImage', leftImage)
								if (rightImage) body.append('rightImage', rightImage)
								if (backImage) body.append('backImage', backImage)
								await addHandler(body)
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
								<div className="border-t border-base-content/25 pt-4">
									<p className="text-sm font-medium mb-3">Base reference photos</p>
									<div className="grid grid-cols-2 gap-3">
										<FileInput label="Front" value={frontImage} onChange={setFrontImage} />
										<FileInput label="Left" value={leftImage} onChange={setLeftImage} />
										<FileInput label="Right" value={rightImage} onChange={setRightImage} />
										<FileInput label="Back" value={backImage} onChange={setBackImage} />
									</div>
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
