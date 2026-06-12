import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendDamageAlert = async (
	vehicleInfo: { brand: string; model: string; licensePlate: string },
	description: string,
) => {
	await resend.emails.send({
		from: process.env.RESEND_FROM_EMAIL ?? '',
		to: process.env.DAMAGE_ALERT_EMAIL ?? '',
		subject: `Damage detected: ${vehicleInfo.licensePlate}`,
		html: `
            <h2>Damage alert: ${vehicleInfo.brand} ${vehicleInfo.model} (${vehicleInfo.licensePlate})</h2>
            <p><strong>Description:</strong></p>
            <p>${description}</p>
            <p>Log in to the fleet management system to review the incident.</p>
        `,
	})
}
