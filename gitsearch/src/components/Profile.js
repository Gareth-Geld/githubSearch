import '../css/Profile.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import loading from '../images/loading.gif';
//This is the profile component This displays the users profile if their result was clicked
function Profile() {
    const { username } = useParams();
    const [error, setError] = useState('');
    const [backendData, setBackendData] = useState(null);
    const [repositories, setRepositories] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [loadingImg] = useState(loading);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/github/${username}`);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data:', data); // Log the fetched data
                    setBackendData(data);

                    // Fetch user's repositories
                    const reposResponse = await fetch(data.repos_url);
                    if (reposResponse.ok) {
                        const reposData = await reposResponse.json();
                        console.log('Fetched repositories:', reposData);

                        // Get the first two repositories
                        const firstTwoRepos = reposData.slice(0, 2);
                        // Fetch detailed repository information for each repository
                        const detailedRepos = await Promise.all(
                            firstTwoRepos.map(async (repo) => {
                                const detailedRepoResponse = await fetch(repo.url);
                                if (detailedRepoResponse.ok) {
                                    const detailedRepoData = await detailedRepoResponse.json();

                                    // Fetch the last 5 commits for each repository
                                    const commitsResponse = await fetch(`${repo.url}/commits?per_page=5`);
                                    if (commitsResponse.ok) {
                                        const commitsData = await commitsResponse.json();
                                        detailedRepoData.commits = commitsData;
                                    }

                                    return detailedRepoData;
                                }
                                return null;
                            })
                        );

                        setRepositories(detailedRepos);
                        setIsLoading(false);
                    }
                } else {
                    console.error('Fetch failed with status:', response.status);
                    setError('User not found');
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('An error occurred:', error);
                setError('An error occurred');
                setIsLoading(false);
            }
        };

        fetchData(); // Call the async function to fetch data
    }, [username]); // Include username as a dependency to re-run the effect when it changes
    //This renders the  Profile it checks if the backedData is there before rendering anything it just displays a loading if if the data is not ready to be presented
    return (
        <div className="profileContainer">
            {isLoading ? (
                <div className="loadingContainer">
                    <img src={loadingImg} alt="loading" srcset="" />
                </div>
            ) : backendData ? (
                <div>
                    <div className="row">
                        <div className="col-sm">
                            <img src={backendData.avatar_url} className='avatarProfile' alt="" srcSet="" />
                            <a href={backendData.html_url} target="_blank" rel="noopener noreferrer"><p className="githubLink">Github Profile</p></a>
                        </div>
                        <div className="col-sm"><p className='title'>{backendData.name || username}</p></div>
                    </div>
                    <div className="row">
                        <div className="col-sm">
                            <div className="userInfo">
                                <p className='BioText'>{backendData.bio || 'No bio available.'}</p>
                                <p>Followers: {backendData.followers || 0}</p>
                                <p>Following: {backendData.following || 0}</p>
                            </div>
                        </div>
                        <div className="col-sm">
                            <div className="repoList">
                                <h2 className='repoListTitle'>Repositories:</h2>
                                <ul>
                                    {repositories.map((repo) => (
                                        <li key={repo.id}>
                                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                                {repo.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <p className='repoTitle'>REPO'S</p>
                        {repositories.map((repo) => (
                            <div className="col-sm">
                                <div className="repoInfo">
                                    <div key={repo.id}>
                                        <h3>
                                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                                {repo.name}
                                            </a>
                                        </h3>
                                        <p>Created: {new Date(repo.created_at).toLocaleDateString()}</p>
                                        <p>Last Commit: {new Date(repo.updated_at).toLocaleDateString()}</p>
                                        <p>Description: {repo.description || 'No description available.'}</p>

                                        <h4>Last 5 Commits:</h4>
                                        <ul>
                                            {repo.commits.map((commit) => (
                                                <li key={commit.sha}>{commit.commit.message}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>

                </div>
            ) : (
                <p>{error}</p>
            )
            }
        </div >
    );
}

export default Profile;