import {Footer} from "./_components/footer";
import {Heading} from "./_components/heading";
import {Heroes} from "./_components/heroes";

const MarketingPage = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F] pt-12">
            <div
                className="flex flex-col items-center justify-center md:justify-start text-center gap-y-10 flex-1 px-6 pb-5">
                <Heading/>
                <Heroes/>
            </div>
            <Footer/>
        </div>
    );
};

export default MarketingPage;
