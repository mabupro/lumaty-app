type Props = {
    subtitle: string | null;
    color: string | null;
}

export default function Subtitle({ subtitle, color }: Props) {

    return (
        <>
            <div className={color === "white" ? " text-white" : " text-gray-700"}>
                <h2 className="text-2xl font-bold text-center ">{subtitle}</h2>
            </div>
        </>
    )
}