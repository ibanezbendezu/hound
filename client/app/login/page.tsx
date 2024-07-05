import {Footer} from "./_components/footer";
import {LoginForm} from "./_components/login-form";

const LoginPage = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            <div
                className="flex flex-col items-center justify-center md:justify-start text-center gap-y-10 flex-1 px-6 pb-4">
                <LoginForm/>
            </div>
            <Footer/>
        </div>
    );
};

export default LoginPage;
