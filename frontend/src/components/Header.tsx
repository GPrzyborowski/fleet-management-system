type Props = {
	text: string
}

export default function Header({ text }: Props) {
	return (
		<h1 className="mt-12 mb-46 lg:mb-20 sm:my-16 md:my-20 lg:my-24 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-info sm:text-5xl md:text-6xl max-w-4xl mx-auto pb-2 text-center">
			{text}
		</h1>
	)
}
