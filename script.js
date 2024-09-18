$(document).ready(function() {
    $('#search-icon').click(function(event) {

        $('.navbar-item').addClass('hidden');

       
        setTimeout(function() {
            $('.navbar-item').css('display', 'none');
            $('.search-bar').addClass('active').focus(); 
        }, 250); 

        event.stopPropagation(); 
    });

    // hiện lại các navbar-item và ẩn ô tìm kiếm
    $(document).click(function(event) {
        if (!$(event.target).is('.search-bar') && !$(event.target).closest('div').length) {
            $('.search-bar').removeClass('active').blur(); 

            
            setTimeout(function() {
                $('.navbar-item').css('display', 'block');
                setTimeout(function() {
                    $('.navbar-item').removeClass('hidden');
                }, 5); 
            }, 100);
        }
    });

    // ẩn hiện account-bar
    $('#account-item').click(function () { 
        $('.account-bar').addClass('show-account');
    });
    $('.close-icon').click(function () { 
        $('.account-bar').removeClass('show-account');     
    });

    // ẩn hiện notifications

    $('#notifi').on("click", function(){
        $('.noti-div').addClass('show-noti-div');
        $('#notifi').attr("src", 'asset/notifications_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png');
    });
    $('#close-noti').on("click", function(){
        $('.noti-div').removeClass('show-noti-div');
    });
    // ẩn hiện timer
    $('#timer-button').on("click", function () {
        if($('.time-choices').hasClass('expand')){
            $('.time-choices').removeClass('expand');
        }else {
            $('.time-choices').addClass('expand');
        }
    });

    // update noti cho timer
    function updateTimer(e){
        $('#notifi').attr("src", 'asset/notifications_active_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png');
        $('.noti-content').append($('<p>').text(e));
        $('.noti-content').find('p').each(function(){
            if ($(this).text() === 'No Older Notifications') {
                $(this).remove();
            }
        });
    }
    // timer functon

    let timer;
    $('.time-choice').on("click", function () {
        const timeM = $(this).data('time');
        const timerMm = timeM * 60 * 1000;

        if(timer){
            clearTimeout(timer);
        }
         timer = setTimeout(function(){
            pauseSong();
         }, timerMm);
         const message = `Timer for ${timeM} minutes set.`;
         updateTimer(message);
    });
    // dark mode 
    $('body').addClass('dark-mode');
    $('#dark-mode').attr('src', 'asset/night-mode.png');
    $('#dark-mode').on('click', function(){
    if($('body').hasClass('dark-mode')){
        $('body').removeClass('dark-mode');
        $(this).attr('src', 'asset/dark_mode_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png');
        $('#background-video').find('source').attr('src', 'asset/Moving Gradient Background.webm');
        
    } else {
        $('body').addClass('dark-mode');
        $(this).attr('src', 'asset/night-mode.png');
        $('#background-video').find('source').attr('src', 'asset/Animated Gradient Background - After effects - Royalty Free - Sea Blue.webm');
    }
    $('#background-video')[0].load();
});
  
    // search-bar active
$('.search-bar').on('input', function() {
    const searchText = $(this).val().toLowerCase();

    if (searchText === '') {
        $('.main-content').fadeIn();
    } else {
        
        $('.main-content').hide();

        
        $('.main-content').filter(function() {
            const title = $(this).find('span').text().toLowerCase();
            return title.includes(searchText);
        }).fadeIn(); 
    }
});

    //phát nhạc
const $playButton = $('#Play');
const $prevButton = $('#Previous');
const $nextButton = $('#Next');
const $progress = $('.progres');
const $progressBar = $('.progres-bar');
const $title = $('.song-title');
const $artistName = $('.song-artist');
const $songCover = $('.song-cover');
const $audio = $('#audio');
const $volumeSlider = $('.volume-slider');

let songs = [];
let songIndex = 0;

// Tải dữ liệu từ s3/json
const dataUrl = 'https://raw.githubusercontent.com/jimmi69-falton/music-data/main/songs.json';
$.getJSON(dataUrl, function(data) {
    songs = data.songs;

    
    // tạo html
    songs.forEach((song, index) => {
        const songElement = `
          <div class="main-content" data-index="${index}">
            <div class="song-content">
              <img src="${song.imageUrl}" alt="${song.title}">
              <span>${song.title}</span>
            </div>
          </div>
        `;

    
        $('.main').append(songElement);
    });

    // nhấn để phát song
    $('.main-content').on('click', function() {
        songIndex = $(this).data('index'); 
        loadSong(songs[songIndex]); 
        playSong();
    });

   
    loadSong(songs[songIndex]);
});


function loadSong(song) {
    $title.text(song.title);
    $artistName.text(song.artist);
    $songCover.attr("src", song.imageUrl);
    $audio.attr("src", song.audioUrl);
}

// phát bài hát
function playSong() {
    $('.playimg').attr("src", 'asset/pause_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 (1).png');
    $playButton.addClass('play');
    $audio.get(0).play();
}

// dừng bài hát
function pauseSong() {
    $('.playimg').attr("src", 'asset/play_arrow_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png');
    $playButton.removeClass('play');
    $audio.get(0).pause();
}


function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = songs.length - 1;
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    songIndex++;
    if (songIndex >= songs.length) songIndex = 0;
    loadSong(songs[songIndex]);
    playSong();
}


function updateProgress() {
    const duration = $audio.get(0).duration;
    const currentTime = $audio.get(0).currentTime;
    const percent = (currentTime / duration) * 100;
    $progressBar.css("width", `${percent}%`);
}


function setProgress(e) {
    const width = $(this).width();
    const clickX = e.offsetX;
    const duration = $audio.get(0).duration;
    $audio.get(0).currentTime = (clickX / width) * duration;
}

// âm lượng
$volumeSlider.on('input', function() {
    const volume = $(this).val() / 100;
    $audio.get(0).volume = volume;
    updateVolumeIcon(volume); // Cập nhật biểu tượng âm lượng
});

// biểu tượng âm lượng
function updateVolumeIcon(volume) {
    if (volume === 0) {
        $('#volume-icon').attr("src", 'asset/volume_off_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png');
        $('.volume').addClass('off');
    } else if (volume <= 0.4) {
        $('#volume-icon').attr("src", 'asset/volume_down_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png');
    } else {
        $('#volume-icon').attr("src", 'asset/volume_up_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png');
    }
}

// các event listener
$playButton.on("click", function() {
    const isPlaying = $playButton.hasClass('play');
    isPlaying ? pauseSong() : playSong();
});


$prevButton.on("click", prevSong);
$nextButton.on("click", nextSong);


$audio.on("timeupdate", updateProgress);

$progress.on("click", setProgress);

$audio.on("ended", nextSong);

loadSong(songs[songIndex]);




});


