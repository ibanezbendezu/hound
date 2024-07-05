"use client";

export const Heading = () => {

    return (
        <div className="max-w-3xl space-y-4">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold">
                Tu aliado en la detección de similitudes entre códigos fuente, {" "}
                <span className="underline">Hound.</span>
            </h1>
            <h3 className="text-sm sm:text-lg md:text-xl font-medium">
                Compara fácilmente tus proyectos almacenados en GitHub.
            </h3>
        </div>
    );
};
