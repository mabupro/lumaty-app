'use client'
import { useState } from "react";

export default function HumbergerButton() {
    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

    const handleMenu = () => {
        setIsOpenMenu(!isOpenMenu)
    }

    return (
        <>
            <div>
                <button
                    onClick={handleMenu}
                    type="button"
                    className="z-10 space-y-1.5"
                >
                    <div
                        className={
                            isOpenMenu
                                ? "w-7 h-0.5 bg-gray-600 translate-y-0 rotate-45 transition duration-500 ease-in-out"
                                : "w-7 h-0.5 bg-gray-600 transition duration-500 ease-in-out"
                        }
                    />
                    <div
                        className={
                            isOpenMenu
                                ? "opacity-0 transition duration-500 ease-in-out"
                                : "w-7 h-0.5 bg-gray-600 transition duration-500 ease-in-out"
                        }
                    />
                    <div
                        className={
                            isOpenMenu
                                ? "w-7 h-0.5 bg-gray-600 -translate-y-2  -rotate-45 transition duration-500 ease-in-out"
                                : "w-7 h-0.5 bg-gray-600 transition duration-500 ease-in-out"
                        }
                    />
                </button>
            </div>
        </>
    )
}