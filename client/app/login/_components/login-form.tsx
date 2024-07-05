"use client";

import {Button} from "@/components/ui/button";
import Image from 'next/image';

export const LoginForm = () => {

    const handleGithubLogin = () => {
        window.location.href = 'http://localhost:5000/auth/github';
    };

    return (
        <div className="w-80">
            <div className="items-center justify-center md:ml-auto md:justify-end w-full space-y-5">
                <div className="w-full text-left">
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold">
                        Compara y analiza.
                    </h3>
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-darkGray">
                        Accede fácil a Hound ️😄.
                    </h3>
                </div>

                <Button onClick={handleGithubLogin} variant={"normal"}
                        className=" w-full flex items-center justify-center gap-2 rounded-lg">
                    <Image src="/github.png" alt="GitHub Logo" width={24} height={24}/>
                    <span className="text-center">Continua con Github</span>
                </Button>

                <hr className="w-full border-1"/>

                <h3 className="w-full text-left text-xs sm:text-sm md:text-base font-bold">
                    O ingresa tu token de acceso a Hound.
                </h3>

                <form method="POST">
                    <label className="w-full text-left block mb-4 text-darkGray">
                        <span className="text-xs font-medium">Token</span>
                        <input
                            type="text"
                            name="name"
                            className="pl-2 h-8 text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            placeholder="Ingresa tu token"
                            required
                        />
                    </label>
                    <label className="w-full text-left block mb-5 text-darkGray">
                        <span className="text-xs font-medium">Email</span>
                        <input
                            name="email"
                            type="email"
                            className="pl-2 h-8 text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                            placeholder="Ingresa tu dirección de email"
                            required
                        />
                    </label>
                    <Button variant={"normal"} className=" w-full flex items-center justify-center rounded-lg">
                        <span className="text-center">Continuar</span>
                    </Button>
                </form>

                <p className="w-full text-xs text-left font-normal text-darkGray leading-3">
                    Para poder utilizar Hound de manera ilimitada, es necesario proporcionar un token para el uso de la
                    API.
                </p>
            </div>
        </div>
    );
};
