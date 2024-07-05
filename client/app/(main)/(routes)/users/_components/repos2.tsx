import Repo from "./repo2";

const Repos = ({repos}: { repos: any[] }) => {
    return (
        <div className='md:w-full w-full px-1 md:px-0 grid md:grid-cols-2 gap-4 pt-4'>
            <h2 className='col-span-full text-xl font-bold'>Repositorios</h2>
            {repos.map((repo) => (
                <Repo key={repo.id} repo={repo}/>
            ))}
            {repos.length === 0 &&
                <p className='flex items-center justify-center h-32'>
                    No se encontraron repositorios.
                </p>
            }

        </div>
    );
};
export default Repos;