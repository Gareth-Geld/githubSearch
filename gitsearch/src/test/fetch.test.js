test('check Fetch api', async () => {
    const fetched = await fetch(
        'https://api.github.com/users/octocat'
    );
    const result = await fetched.json();
    const githubLink = result.html_url;
    expect(githubLink).toBe("https://github.com/octocat");
});