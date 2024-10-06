type Props = {
    menuTitle: string;
    onClick: () => void;
};

export default function MapMenuButton({ menuTitle, onClick }: Props) {
    return (
        <button className="mx-auto w-20 h-20 bg-slate-300 rounded-md shadow-sm" onClick={onClick}>
            {menuTitle}
        </button>
    )
}