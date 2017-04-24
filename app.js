var DATA;
var resultsElement = '#search-container';
function init() {
  console.log('YouTube authenticating')
  gapi.client.setApiKey('AIzaSyCcOL-DY65TugTefc9at8Hlwh5jLADIfNs');
  gapi.client.load("youtube", "v3", function(){
    console.log('YouTube ready!')
    $('#search-button').attr('disabled', false).removeClass('is-loading');
  });
}

// Render
function render(data, element){
  resultsHtml = data.map(function(item){
    var published = new Date(item.snippet.publishedAt);
    var title = item.snippet.title;
    if (title.length > 45) {
      title = title.substr(0, 45) + '…';
    }
    var channel = item.snippet.channelTitle;
    var channelUrl = 'https://www.youtube.com/channel/' + item.snippet.channelId;
    var thumbnailUrl = item.snippet.thumbnails.medium.url;
    var link = 'https://www.youtube.com/watch?v=' + item.id.videoId;
    var itemHtml = (
        '<div class="column is-one-quarter">' +
          '<a href="'+ link + '" target="_blank">' +
            '<div class="card is-3">' +
              '<div class="card-image">' +
                '<figure class="image is-4by3">' +
                  '<img src="' + thumbnailUrl + '" alt="Image"> '+
                '</figure>' +
              '</div>' +
              '<div class="card-content">' +
                '<small>'+ published.toDateString()+'</small>'+
                '<h3 class="subtitle">' + title + '</h3>'+
              '</div>' +
              // '<footer class="card-footer">' +
              //   '<p class="card-footer-item">' +
              //     '<span>' +
              //         'More from <a href="' + channelUrl + '">' + channel + '</a>' +
              //     '</span>' +
              //   '</p>' +
              // '</footer>' +
            '</div> '+
          '</a> ' +
        '</div>'
    )
    return itemHtml;
  })
  $(element).html(resultsHtml);
}

// Search
function search(query) {
  var request = gapi.client.youtube.search.list({
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: 12,
    order: 'viewCount'
  });

  request.execute(function(response) {
    console.log(response.items);
    render(response.items, resultsElement);
  });
}

// Event Listener
$('#search').on('submit', function(event){
  event.preventDefault();
  var currentQuery = encodeURIComponent($('#searchQuery').val()).replace(/%20/g, '+');
  search(currentQuery);
})

// [ ] Make the images clickable, playing them in a lightbox
// [ ] Show a link for more from the channel that each video came from
// [ ] Show buttons to get more results (using the previous and next page links from the JSON)