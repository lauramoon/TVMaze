/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const url = `http://api.tvmaze.com/search/shows?q=${query}`;
  const res = await axios.get(url);
  const showData = res.data.map(function(show) {
    const { id, name, summary, image } = show.show;
    const imgUrl = (!image) ? 'https://tinyurl.com/tv-missing' : image.medium;
    return ({ id, name, summary, image: imgUrl });
  })
  return showData;
}


/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary episode" data-toggle="modal" data-target="#infoModal">Episodes</button>
             <button class="btn btn-primary cast" data-toggle="modal" data-target="#infoModal">Cast</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);

    // add click handler to episodes button
    $item.on('click', 'button', async function handleClick (evt) {
      const id = $(this).closest('.card').attr('data-show-id');
      console.log($(this));
      if ($(this).hasClass('episode')) {
        $('#modalTitle').text("Episodes");
        const episodes = await getEpisodes(id);
        populateEpisodes(episodes);
      } else if ($(this).hasClass('cast')) {
        $('#modalTitle').text("Cast");
        const cast = await getCast(id);
        populateCast(cast);
      }
    })
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const url = `http://api.tvmaze.com/shows/${id}/episodes`;
  const res = await axios.get(url);     
  const episodes = res.data.map((episode) => {
    const {id, name, season, number} = episode;
    return ({id, name, season, number});
  });
  return episodes;
}

// populate the episode are with the list of episodes of the selected show

function populateEpisodes(episodes) {
  const $episodesList = $('#item-list');
  $episodesList.html('');
  if (episodes.length === 0) {
    $episodeList.append("<p>No episode information available</p>");
  }

  for (let episode of episodes) {
    const {name, season, number} = episode;
    const $entry = `<li>${name} (season ${season}, episode ${number})`;
    $episodesList.append($entry);
  }
}

// given a show id, get the show's cast in a list: {person, character}

async function getCast(id) {
  const url = `http://api.tvmaze.com/shows/${id}/cast`;
  const res = await axios.get(url);     
  const cast = res.data.map((member) => {
    const {person, character} = member;
    return ({person: person.name, character: character.name});
  });
  return cast;
}

function populateCast(cast) {
  const $castList = $('#item-list');
  $castList.html('');
  if (cast.length === 0) {
    $castList.append("<p>No cast information available</p>");
  }

  for (let member of cast) {
    const {person, character} = member;
    const $entry = `<li>${person} plays ${character}`;
    $castList.append($entry);
  }
}
