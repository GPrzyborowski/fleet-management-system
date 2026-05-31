import { Link } from 'react-router-dom'
import EditVehicleModal from './EditVehicleModal'

type Props = {
	id: number
	licensePlate: string
	brand: string
	model: string
	year: number
	mileage: number
	status: string
	removeHandler: (id: number) => void
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

export default function VehicleRow({
	id,
	licensePlate,
	brand,
	model,
	year,
	mileage,
	status,
	removeHandler,
	updateHandler,
	onUpdate,
}: Props) {
	return (
		<tr>
			<td>
				<span className="inline-flex items-stretch border-2 border-gray-900 rounded overflow-hidden font-black text-sm bg-white text-gray-900 h-8 w-34">
					<span className="flex items-center justify-center bg-blue-800 text-white text-[11px] w-7 flex-shrink-0 tracking-wide">
						PL
					</span>
					<span className="flex-1 flex items-center justify-start pl-2 tracking-wide">{licensePlate}</span>
				</span>
			</td>
			<td>
				{brand} {model}
			</td>
			<td>{year}</td>
			<td>{mileage}</td>
			<td>
				<span className={`badge badge-soft ${status === 'available' ? 'badge-success' : 'badge-error'} text-xs`}>
					{status === 'available' ? 'Available' : 'Not available'}
				</span>
			</td>
			<td>
				<EditVehicleModal
					id={id}
					licensePlate={licensePlate}
					brand={brand}
					model={model}
					year={year}
					status={status}
					updateHandler={updateHandler}
					onUpdate={onUpdate}
				/>
				<button
					className="btn btn-circle btn-text btn-sm"
					aria-label="Remove employee"
					onClick={() => removeHandler(id)}>
					<span className="icon-[tabler--trash] size-5"></span>
				</button>

				<Link
					to={`/vehicles/${id}`}
					state={{ id, licensePlate, brand, model, year, mileage, status }}
					className="btn btn-circle btn-text btn-sm"
					aria-label="Show vehicle details">
					<span className="icon-[tabler--circle-arrow-right] size-5"></span>
				</Link>
			</td>
		</tr>
	)
}
