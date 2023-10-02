import React from 'react';
import '../css/Results.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
//Basic results component that displays Username and avatar of the user
const Results = ({ error, username, avatarImg, gitHubLink }) => {
    const profileLink = `/profile/${username}`;
    //Using bootstrap here to render the profileCard to be presentable 
    return (
        <Link to={profileLink}>
            <div class="profileCard">
                <div class="row">
                    <div class="col-md-8">
                        <div class="maintxt">
                            <img className='avatar' src={avatarImg} alt="avatar" />
                            {username && <p className='username'>{username}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Results;