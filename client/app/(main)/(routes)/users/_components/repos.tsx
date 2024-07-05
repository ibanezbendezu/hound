import {Key} from "react";
import Repo from "./repo";

const Repos = ({repos, alwaysFullWidth = false}: { repos: any[]; alwaysFullWidth?: boolean }) => {
    const className = alwaysFullWidth ? "w-full" : "lg:w-2/3 w-full";

    return (
        <div className={`${className} bg-glass rounded-lg px-8 py-6`}>
            <ol className='relative border-s border-gray-200'>
                {repos.map((repo: { id: Key | null | undefined; }) => (
                    <Repo key={repo.id} repo={repo}/>
                ))}
                {repos.length === 0 && <p className='flex items-center justify-center h-32 '>No repos found</p>}
            </ol>
        </div>
    );
};
export default Repos;