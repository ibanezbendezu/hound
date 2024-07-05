import Image from "next/image";

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <Image
                    src="/mascot.png"
                    width={180}
                    height={180}
                    className="relative w-[120px] h-[120px] sm:w-[145px] sm:h-[145px] md:w-[180px] md:h-[180px] object-contain"
                    alt="Mascot"
                    priority={true}
                />
            </div>
        </div>
    );
};
