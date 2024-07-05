import {FaCodeBranch, FaCopy, FaRegStar} from "react-icons/fa";
import {FaCodeFork} from "react-icons/fa6";
import {PROGRAMMING_LANGUAGES} from "../../../../../lib/utils";
import {useState, useEffect} from "react";
import useCart from './../../../../../store/repos';


const Repo = ({repo}: { repo: any }) => {
    const {cart, addItemToCart, removeItemFromCart} = useCart();

    const isRepoInCart = cart.some(item => item.id === repo.id);
    const [isSelected, setIsSelected] = useState(isRepoInCart);

    useEffect(() => {
        setIsSelected(isRepoInCart);
    }, [cart]);

    const handleSelectionChange = () => {
        if (!isSelected) {
            const alreadyInCart = cart.some(item => item.id === repo.id);
            if (!alreadyInCart) {
                addItemToCart({newItem: repo});
            }
        } else {
            const itemIndex = cart.findIndex((item) => item.id === repo.id);
            if (itemIndex !== -1) {
                removeItemFromCart({itemIndex});
            }
        }
        setIsSelected(!isSelected);
    };


    return (
        <div key={repo.id} className='border-2 px-4 py-4 rounded-lg text-sm'>

            <div className="flex justify-between items-center">
                <div>
                    <a href={repo.html_url} className='hover:underline text-sm font-semibold'>
                        {repo.name}
                    </a>
                    <p className='text-muted-foreground mt-2 text-xs font-light'>
                        {repo.description ? repo.description.slice(0, 500) : "No se proporciona descripción\n"}
                    </p>
                </div>
                <input className="translate-x-1 -translate-y-5" type="checkbox" checked={isSelected}
                       onChange={handleSelectionChange}/>
            </div>

            <div className='text-muted-foreground flex text-sm space-x-2 mt-6 items-center'>
                <span
                    className='bg-muted-foreground text-secondary text-xs font-normal px-2.5 py-0.5 rounded-full flex items-center gap-1'>
					<FaRegStar/> {repo.stargazers_count}
				</span>

                <span
                    className='bg-muted-foreground text-secondary text-xs font-normal px-2.5 py-0.5 rounded-full flex items-center gap-1'>
					<FaCodeFork/> {repo.forks_count}
				</span>

                {repo.language && (
                    <div className='font-normal text-xs'>
                        {repo.language}
                    </div>
                )}

                {PROGRAMMING_LANGUAGES[repo.language as keyof typeof PROGRAMMING_LANGUAGES] ? (
                    <img src={PROGRAMMING_LANGUAGES[repo.language as keyof typeof PROGRAMMING_LANGUAGES]}
                         alt='Programming language icon' className='h-5'/>
                ) : null}

            </div>
        </div>
    );
};
export default Repo;