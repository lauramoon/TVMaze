it('should retrieve list of shows from the api with given search term', async () => {
    let bletchleyShows = await searchShows('bletchley');
    expect(bletchleyShows.length).toEqual(2);
    expect(bletchleyShows[0].id).toEqual(1767);
    expect(bletchleyShows[0].image).toEqual("https://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg");
    expect(bletchleyShows[0].name).toEqual("The Bletchley Circle");
    expect(bletchleyShows[0].summary.length).toBeGreaterThan(100);
});
it('should retrieve episodes for show with given id', async () => {
    let bletchleyEpisodes = await getEpisodes(1767);
    expect(bletchleyEpisodes.length).toEqual(7);
    expect(bletchleyEpisodes[0].id).toEqual(152950)
    expect(bletchleyEpisodes[0].name).toEqual("Cracking a Killer's Code, Part 1");
    expect(bletchleyEpisodes[0].season).toEqual(1);
    expect(bletchleyEpisodes[0].number).toEqual(1);
});
it('should retrieve cast of show with given id', async () => {
    let bletchleyEpisodes = await getCast(1767);
    expect(bletchleyEpisodes.length).toEqual(5);
    expect(bletchleyEpisodes[0].person).toEqual("Julie Graham");
    expect(bletchleyEpisodes[0].character).toEqual("Jean McBrian");
});
