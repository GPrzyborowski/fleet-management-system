import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

const animations = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -10 },
}

export default function PageTransition({ children }: { children: ReactNode }) {
	return (
		<motion.div
			variants={animations}
			initial="initial"
			animate="animate"
			exit="exit"
			transition={{ duration: 0.2 }}
			className="w-full h-full">
			{children}
		</motion.div>
	)
}
