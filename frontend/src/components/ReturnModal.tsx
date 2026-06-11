import { useState } from 'react'

type Props = {
	licensePlate: string
	onReturn: (data: ReturnFormData) => void
}

export type ReturnFormData = {
	dashboardImage: File | null
	mileage: string
	fuelLevel: string
	frontImage: File | null
	leftImage: File | null
	rightImage: File | null
	backImage: File | null
}

type FileInputProps = {
	label: string
	fileKey: keyof ReturnFormData
	value: File | null
	onChange: (key: keyof ReturnFormData, file: File | null) => void
}

function FileInput({ label, fileKey, value, onChange }: FileInputProps) {
	return (
		<div>
			<label className="label-text mb-1 block">{label}</label>
			<label className="flex items-center gap-2 cursor-pointer">
				<span className="btn btn-accent btn-sm">Choose file</span>
				<span className="text-sm text-base-content/60 truncate">{value?.name ?? 'No file chosen'}</span>
				<input
					type="file"
					accept="image/*"
					className="sr-only"
					onChange={e => onChange(fileKey, e.target.files?.[0] ?? null)}
				/>
			</label>
		</div>
	)
}

export default function ReturnModal({ licensePlate, onReturn }: Props) {
	const [isOpen, setIsOpen] = useState(false)
	const [step, setStep] = useState(1)
	const [formData, setFormData] = useState<ReturnFormData>({
		dashboardImage: null,
		mileage: '',
		fuelLevel: '',
		frontImage: null,
		leftImage: null,
		rightImage: null,
		backImage: null,
	})

	const handleClose = () => {
		setIsOpen(false)
		setStep(1)
		setFormData({
			dashboardImage: null,
			mileage: '',
			fuelLevel: '',
			frontImage: null,
			leftImage: null,
			rightImage: null,
			backImage: null,
		})
	}

	const handleReturn = () => {
		onReturn(formData)
		handleClose()
	}

	const handleFileChange = (key: keyof ReturnFormData, file: File | null) => {
		setFormData(prev => ({ ...prev, [key]: file }))
	}

	return (
		<>
			<button
				type="button"
				className="btn btn-accent px-4 py-2 text-white shadow-md hover:bg-accent-focus transition-colors flex items-center justify-center"
				onClick={() => setIsOpen(true)}>
				Return
			</button>

			<div
				className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
					isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
				}`}>
				<div
					className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
						isOpen ? 'opacity-100' : 'opacity-0'
					}`}
					onClick={handleClose}
				/>

				<div
					className={`relative z-10 bg-base-100 rounded-lg shadow-xl w-full max-w-lg mx-4 transition-all duration-300 ${
						isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
					}`}>
					<div className="p-4 border-b border-base-content/25 flex items-center justify-between">
						<div>
							<p className="text-xs text-base-content/50">Step {step} of 2</p>
							<h3 className="text-lg font-semibold">
								You're returning <span className="text-accent">{licensePlate}</span>
							</h3>
						</div>
						<button type="button" className="btn btn-text btn-circle btn-sm" onClick={handleClose}>
							<span className="icon-[tabler--x] size-4" />
						</button>
					</div>

					<div className="flex gap-1 px-4 pt-3">
						<div
							className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-accent' : 'bg-base-content/20'}`}
						/>
						<div
							className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-accent' : 'bg-base-content/20'}`}
						/>
					</div>

					{step === 1 && (
						<div className="p-4 space-y-4">
							<FileInput
								label="Add dashboard picture"
								fileKey="dashboardImage"
								value={formData.dashboardImage}
								onChange={handleFileChange}
							/>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="label-text mb-1 block">Mileage</label>
									<input
										type="text"
										className="input w-full"
										placeholder="e.g. 150023"
										value={formData.mileage}
										onChange={e => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
									/>
								</div>
								<div>
									<label className="label-text mb-1 block">Fuel level (%)</label>
									<input
										type="text"
										className="input w-full"
										placeholder="e.g. 75"
										value={formData.fuelLevel}
										onChange={e => setFormData(prev => ({ ...prev, fuelLevel: e.target.value }))}
									/>
								</div>
							</div>
							<p className="text-xs text-base-content/50">
								If the information was read correctly, press <strong>Next</strong>. Otherwise, enter correct data
								manually above.
							</p>
						</div>
					)}

					{step === 2 && (
						<div className="p-4">
							<div className="grid grid-cols-2 gap-4">
								{(
									[
										{ label: 'Front picture', key: 'frontImage' },
										{ label: 'Left picture', key: 'leftImage' },
										{ label: 'Right picture', key: 'rightImage' },
										{ label: 'Back picture', key: 'backImage' },
									] as const
								).map(({ label, key }) => (
									<FileInput key={key} label={label} fileKey={key} value={formData[key]} onChange={handleFileChange} />
								))}
							</div>
						</div>
					)}

					<div className="p-4 border-t border-base-content/25 flex justify-between">
						{step === 1 ? (
							<button type="button" className="btn btn-soft btn-secondary" onClick={handleClose}>
								Cancel
							</button>
						) : (
							<button type="button" className="btn btn-soft btn-secondary" onClick={() => setStep(1)}>
								<span className="icon-[tabler--chevron-left] size-4" />
								Back
							</button>
						)}

						{step === 1 ? (
							<button type="button" className="btn btn-accent text-white" onClick={() => setStep(2)}>
								Next
								<span className="icon-[tabler--chevron-right] size-4" />
							</button>
						) : (
							<button type="button" className="btn btn-accent text-white" onClick={handleReturn}>
								<span className="icon-[tabler--check] size-4" />
								Return vehicle
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
