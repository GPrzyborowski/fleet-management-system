type Props = {
	text: string
}

export default function Header({ text }: Props) {
	return <h1 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold my-2 text-sky-700">{text}</h1>
}
