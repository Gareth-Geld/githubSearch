const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch'); // Import node-fetch
const app = express();
const helmet = require('helmet');
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(helmet());

//This is mybackend - IT used githubs api to fetch data from github
// Function to fetch GitHub user data based on the query parameter
async function fetchGitHubUserData(query) {
    try {
        const response = await fetch(`https://api.github.com/search/users?q=${query}`);
        if (response.ok) {
            const data = await response.json();
            const users = data.items;
            return users;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return null;
    }
}

// Route to fetch and return GitHub user data
app.get('/api/github', async (req, res) => {
    const query = req.query.username; // Get the query parameter

    const gitHubData = await fetchGitHubUserData(query);

    if (gitHubData) {
        res.json(gitHubData);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});



// Function to fetch GitHub user data
async function fetchGitSingleUser(username) {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (response.ok) {
            return await response.json();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return null;
    }
}

// Route to fetch and return GitHub user data
app.get('/api/github/:username', async (req, res) => {
    const username = req.params.username;

    const gitHubData = await fetchGitSingleUser(username);

    if (gitHubData) {
        res.json(gitHubData);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

app.listen(port, () => console.log('Listening engaged'));