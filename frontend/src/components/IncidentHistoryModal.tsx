import { useState } from 'react'
import IncidentRow, { type IncidentData } from './IncidentRow'

type Props = {
	incidents: IncidentData[]
}

export default function IncidentHistoryModal({ incidents }: Props) {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null)

	const handleClose = () => {
		setIsOpen(false)
		setSelectedIncident(null)
	}

	return (
		<>
			<button type="button" className="btn btn-soft btn-sm" onClick={() => setIsOpen(true)}>
				<span className="icon-[tabler--history] size-4" />
				View History
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
					className={`relative z-10 bg-base-100 rounded-lg shadow-xl w-full max-w-5xl mx-4 transition-all duration-300 ${
						isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
					}`}>
					<div className="p-4 border-b border-base-content/25 flex items-center justify-between">
						<h3 className="text-lg font-semibold">{selectedIncident ? 'Incident Details' : 'Incident History'}</h3>
						<button type="button" className="btn btn-text btn-circle btn-sm" onClick={handleClose}>
							<span className="icon-[tabler--x] size-4" />
						</button>
					</div>

					{selectedIncident ? (
						<div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
							<button type="button" className="btn btn-soft btn-sm" onClick={() => setSelectedIncident(null)}>
								<span className="icon-[tabler--arrow-left] size-4" />
								Back
							</button>
							<p className="text-base-content/80">{selectedIncident.ai_description}</p>
							<div className="grid grid-cols-2 gap-3">
								{selectedIncident.vehicle_incident_images.map(img => (
									<div key={img.id}>
										<p className="text-xs text-base-content/50 mb-1 capitalize">
											{img.image_type === 'base' ? 'Reference' : 'After trip'} - {img.side}
										</p>
										<img
											src={img.azure_blob_url}
											alt={`${img.image_type} ${img.side}`}
											className="rounded w-full object-cover aspect-video"
										/>
									</div>
								))}
							</div>
						</div>
					) : (
						<div className="p-4 max-h-96 overflow-y-auto overflow-x-auto">
							{incidents.length === 0 ? (
								<p className="text-base-content/50 text-sm text-center py-4">No incidents recorded.</p>
							) : (
								<table className="w-full text-sm min-w-max">
									<thead>
										<tr className="border-b border-base-content/25">
											<th className="pb-3 text-left font-medium text-base-content min-w-36">Date</th>
											<th className="pb-3 text-left font-medium text-base-content min-w-64">Description</th>
											<th className="pb-3 text-left font-medium text-base-content min-w-24">Status</th>
											<th className="pb-3 text-left font-medium text-base-content min-w-24">Details</th>
										</tr>
									</thead>
									<tbody>
										{incidents.map(incident => (
											<IncidentRow key={incident.id} {...incident} onView={setSelectedIncident} />
										))}
									</tbody>
								</table>
							)}
						</div>
					)}

					<div className="p-4 border-t border-base-content/25 flex justify-end">
						<button type="button" className="btn btn-soft btn-secondary" onClick={handleClose}>
							Close
						</button>
					</div>
				</div>
			</div>
		</>
	)
}
