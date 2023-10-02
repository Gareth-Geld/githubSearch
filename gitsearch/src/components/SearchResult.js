import React from 'react';
import '../css/SearchResults.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Results from './Results';
//This component displays each result component found from the github query into a row of 3 entries - Cut off is 50
const SearchResults = ({ backendData }) => {
    // Check if backendData is null
    if (backendData === null) {
        return <div></div>;
    }

    // Define the maximum number of users to display
    const maxUsers = 50;

    // Split the backendData into groups of 6 users per row
    const usersPerRow = 3;
    const rows = [];

    // Limit the number of users displayed to 'maxUsers'
    const limitedData = backendData.slice(0, maxUsers);

    for (let i = 0; i < limitedData.length; i += usersPerRow) {
        const rowUsers = limitedData.slice(i, i + usersPerRow);
        rows.push(rowUsers);
    }

    return (
        <div>
            {rows.map((row, rowIndex) => (
                <div className="row" key={rowIndex}>
                    {row.map((user, userIndex) => (
                        <div className="col-sm" key={userIndex}>
                            <Results
                                username={user.name || user.login || 'User not found'}
                                avatarImg={user.avatar_url || 'Avatar not found'}
                                gitHubLink={user.html_url || 'URL not found'}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SearchResults;