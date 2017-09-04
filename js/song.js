$(function() {
  
    let  id = parseInt(location.search.match(/\bid=([^&]*)/)[1],10);
    $.get('../song.json').done(function(response) {
        let songs = response;
        let song = songs.filter(function(s) {
            return s.id == id;
        })[0];
        let {url,name,lyric,coverImg,bgImg} = song;

        initPlayer.call(undefined,url);
        initText(name,lyric);
        initImg(coverImg,bgImg);

    }).fail(function() {
        console.log('请求出错')
    }) 

    function initImg (coverImg,bgImg) {
        $('.disc-container .cover').attr("src",coverImg)
        $('.layout').css({
            "background-image":"url("+bgImg+")"
        });
    }

    function initPlayer(url) {
        let audio = document.createElement('audio');
        audio.src = url;

        // audio.oncanplay = function(){
		// 	audio.play()
		// 	$('.cover,.halo').addClass('playing')
        //     $('.btn-pause').addClass('active')
        //     $('.ctr .btn-pause').siblings().removeClass('active')
		// }
        $('.icon-play').on('touchstart',function() {
            audio.play();
            $('.halo,.cover').addClass('playing')
            $('.btn-pause').addClass('active')
            $('.ctr .btn-pause').siblings().removeClass('active')
            
            
        })
         $('.icon-pause').on('touchstart',function() {
            audio.pause();
            $('.halo,.cover').removeClass('playing')
            $('.btn-play').addClass('active')
            $('.ctr .btn-play').siblings().removeClass('active')
        })

        setInterval( () => {
            
            let seconds = audio.currentTime;
            let minutes = ~~(seconds / 60);
            let left = seconds - minutes*60;
            let time = pad(minutes)+':'+pad(left);
            let $panel = $('.lyric > p');
            let $currentPanel;
            
        for (let i=0; i<$panel.length;i++) {
            if($panel.eq(i+1).length !== 0 && $panel.eq(i).attr('data-time') < time && $panel.eq(i+1).attr('data-time') > time) {
                $currentPanel = $panel.eq(i);
                break;      
            }
        }
            if($currentPanel) {
                $currentPanel.addClass('active').prev().removeClass('active')
                let $currentPanelTop = $currentPanel.offset().top; 
                let $lyricTop = $('.lyric').offset().top;
                let delta = $currentPanelTop - $lyricTop - $('.lyricWrap').height()/3;

                $('.lyric').css('transform','translateY(-'+delta+'px)');
            }
        

        },1000)
        function pad(number) {
            return number >= 10 ? number + '':'0'+number;
        }
        
    }

    function initText (name,lyric) {
        $('.songs-description > h1').text(name);
        let array = lyric.split('\n');
        let regex = /^\[(.+)\](.*)$/;
        array = array.map(function(string,index) {
            let matches = regex.exec(string)
            if(matches) {
                return {time:matches[1],words: matches[2]}
            }
        })
         array.map(function(object) {
            if(!object) {return}
            let $p = $('<p/>')
            $p.attr('data-time',object.time).text(object.words);
            $p.appendTo($('.lyric'))
        })
    }

})