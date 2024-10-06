import Link from "next/link"

type Props = {
    title: string;
    url: string;
}

export default function MainButton({ title, url }: Props) {
    return (
        <>
            <Link href={url}>
                <div className=" bg-cyan-900 rounded-full w-2/3 p-4 mx-auto cursor-pointer transition hover:opacity-80">
                    <p className="text-lg font-bold text-center text-white">{title}</p>
                </div>
            </Link>
        </>
    )
}