let nextPageToken = ''; // Variable to store the next page token for pagination
let prevPageToken = ''; // Variable to store the previous page token for pagination

// Function to fetch YouTube videos based on search query and page token
async function fetchVideos(searchQuery, pageToken) {
  try {
    const apiKey = 'AIzaSyBdUEmsbe2MM2IakDwWvdYtEhrw58t7GnI'; // Replace with your actual YouTube Data API key
    const maxResults = 21; // Change this number as needed

    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&key=${apiKey}&q=${searchQuery}&pageToken=${pageToken}`);
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    const data = await response.json();

    const videoCards = document.getElementById('videoCards');
    videoCards.innerHTML = ''; // Clear previous results

    if (data.items) {
      data.items.forEach(item => {
        const videoId = item.id.videoId;
        const videoTitle = item.snippet.title;
        const videoThumbnail = item.snippet.thumbnails.medium.url;

        // Create a video card
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'mb-3');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card');

        // Create an iframe for the YouTube player
        const videoPlayer = document.createElement('iframe');
        videoPlayer.setAttribute('width', '100%');
        videoPlayer.setAttribute('height', '315');
        videoPlayer.setAttribute('src', `https://www.youtube.com/embed/${videoId}?playsinline=1`); // Add playsinline attribute
        videoPlayer.setAttribute('frameborder', '0');
        videoPlayer.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        videoPlayer.setAttribute('allowfullscreen', 'true');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = videoTitle;

        // Add event listener to play the video when clicked
        card.addEventListener('click', () => {
          const currentVideo = document.querySelector('.current-video');
          if (currentVideo) {
            currentVideo.classList.remove('current-video');
          }
          videoPlayer.classList.add('current-video');
          videoPlayer.src = `https://www.youtube.com/embed/${videoId}`; // Start playing the video
        });

        cardBody.appendChild(videoPlayer); // Add the YouTube player to the card
        cardBody.appendChild(cardTitle);
        card.appendChild(cardBody);

        videoCards.appendChild(card);
      });
    }

    // Update pagination tokens
    nextPageToken = data.nextPageToken || '';
    prevPageToken = data.prevPageToken || '';

    // Update pagination visibility
    updatePaginationVisibility();

    // Update search query in breadcrumb
    document.getElementById('searchQuerySpan').textContent = searchQuery;
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Display error message on UI
    const videoCards = document.getElementById('videoCards');
    videoCards.innerHTML = `
      <div class="container d-flex justify-content-center">
        <div class="alert alert-danger" role="alert">
                      Failed to fetch videos. Please try again later.
        </div>
      </div>`;
  }
}

// Function to update pagination visibility based on available tokens
function updatePaginationVisibility() {
  const previousPage = document.getElementById('previousPage');
  const nextPage = document.getElementById('nextPage');

  if (prevPageToken) {
    previousPage.style.display = 'block';
  } else {
    previousPage.style.display = 'none';
  }

  if (nextPageToken) {
    nextPage.style.display = 'block';
  } else {
    nextPage.style.display = 'none';
  }
}

// Handle form submission
document.getElementById('searchForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent default form submission
  const searchQuery = document.getElementById('searchInput').value;
  await fetchVideos(searchQuery, '');
});

// Handle previous page button click
document.getElementById('previousPage').addEventListener('click', async function (event) {
  event.preventDefault();
  const searchQuery = document.getElementById('searchInput').value;
  await fetchVideos(searchQuery, prevPageToken);
});

// Handle next page button click
document.getElementById('nextPage').addEventListener('click', async function (event) {
  event.preventDefault();
  const searchQuery = document.getElementById('searchInput').value;
  await fetchVideos(searchQuery, nextPageToken);
});

// Call fetchLatestVideosPeriodically function when the page loads
window.onload = async function () {
  const searchQuery = 'music'; // Default search query (change as needed)
  await fetchVideos(searchQuery, '');
};