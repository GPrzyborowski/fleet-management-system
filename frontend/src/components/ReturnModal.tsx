import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { API_URL, SOCKET_URL } from '../config/api'

type Props = {
	licensePlate: string
	assignmentId: number
	onReturn: () => void
}

type FormData = {
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
	fileKey: keyof FormData
	value: File | null
	onFileChange?: (file: File) => void
	onFormDataChange?: (key: keyof FormData, file: File) => void
}

function FileInput({ label, fileKey, value, onFileChange, onFormDataChange }: FileInputProps) {
	return (
		<div>
			<label className="label-text mb-1 block">{label}</label>
			<label className="flex items-center gap-2 cursor-pointer">
				<span className="btn btn-accent btn-sm">Choose file</span>
				<span className="text-sm text-base-content/60 truncate max-w-36">{value?.name ?? 'No file chosen'}</span>
				<input
					type="file"
					accept="image/*"
					className="sr-only"
					onChange={e => {
						const file = e.target.files?.[0] ?? null
						if (!file) return
						if (onFileChange) {
							onFileChange(file)
						} else if (onFormDataChange) {
							onFormDataChange(fileKey, file)
						}
					}}
				/>
			</label>
		</div>
	)
}

export default function ReturnModal({ licensePlate, assignmentId, onReturn }: Props) {
	const [isOpen, setIsOpen] = useState(false)
	const [step, setStep] = useState(1)
	const [ocrLoading, setOcrLoading] = useState(false)
	const [dashboardImageUrl, setDashboardImageUrl] = useState<string | null>(null)
	const [formData, setFormData] = useState<FormData>({
		dashboardImage: null,
		mileage: '',
		fuelLevel: '',
		frontImage: null,
		leftImage: null,
		rightImage: null,
		backImage: null,
	})

	const socketRef = useRef<Socket | null>(null)
	const socketIdRef = useRef<string>('')
	const token = localStorage.getItem('token')

	useEffect(() => {
		const socket = io(SOCKET_URL)
		socketRef.current = socket

		socket.on('connect', () => {
			socketIdRef.current = socket.id ?? ''
			socket.emit('join', socket.id)
		})

		socket.on('dashboard-ocr-result', (data: { mileage: number | null; fuelLevel: number | null }) => {
			setFormData(prev => ({
				...prev,
				mileage: data.mileage != null ? String(data.mileage) : prev.mileage,
				fuelLevel: data.fuelLevel != null ? String(data.fuelLevel) : prev.fuelLevel,
			}))
			setOcrLoading(false)
		})

		return () => {
			socket.disconnect()
		}
	}, [])

	const resetForm = () => {
		setStep(1)
		setOcrLoading(false)
		setDashboardImageUrl(null)
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

	const handleClose = () => {
		setIsOpen(false)
		resetForm()
	}

	const handleDashboardUpload = async (file: File) => {
		setFormData(prev => ({ ...prev, dashboardImage: file, mileage: '', fuelLevel: '' }))
		setOcrLoading(true)

		const body = new FormData()
		body.append('image', file)
		body.append('socketId', socketIdRef.current)

		try {
			const res = await fetch(`${API_URL}/assignments/dashboard-image`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body,
			})
			const data = await res.json()
			setDashboardImageUrl(data.imageUrl)
		} catch (err) {
			console.error(err)
			setOcrLoading(false)
		}
	}

	const handleFormDataChange = (key: keyof FormData, file: File) => {
		setFormData(prev => ({ ...prev, [key]: file }))
	}

	const handleReturn = async () => {
		const body = new FormData()
		body.append('mileage', formData.mileage)
		body.append('fuelLevel', formData.fuelLevel)
		body.append('dashboardImageUrl', dashboardImageUrl ?? '')

		if (formData.frontImage) body.append('frontImage', formData.frontImage)
		if (formData.leftImage) body.append('leftImage', formData.leftImage)
		if (formData.rightImage) body.append('rightImage', formData.rightImage)
		if (formData.backImage) body.append('backImage', formData.backImage)

		handleClose()

		fetch(`${API_URL}/assignments/return/${assignmentId}`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
			body,
		})
			.then(() => onReturn())
			.catch(err => console.error(err))
	}

	return (
		<>
			<button type="button" className="btn btn-accent text-white" onClick={() => setIsOpen(true)}>
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
								onFileChange={handleDashboardUpload}
							/>
							{ocrLoading && (
								<div className="flex items-center gap-2 text-sm text-base-content/60">
									<span className="loading loading-spinner loading-xs" />
									Reading dashboard data...
								</div>
							)}
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
								If the information was read correctly, press <strong>Next</strong>.
							</p>
							<p className="text-xs text-base-content/50">Otherwise, enter correct data manually above.</p>
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
									<FileInput
										key={key}
										label={label}
										fileKey={key}
										value={formData[key]}
										onFormDataChange={handleFormDataChange}
									/>
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
							<button
								type="button"
								className="btn btn-accent text-white"
								disabled={ocrLoading || !formData.dashboardImage}
								onClick={() => setStep(2)}>
								Next
								<span className="icon-[tabler--chevron-right] size-4" />
							</button>
						) : (
							<button type="button" className="btn btn-accent text-white" onClick={handleReturn}>
								<span className="icon-[tabler--check] size-4" />
								Return
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
