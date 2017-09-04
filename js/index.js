$(function() {
    $.get('../song.json').done(function(response) {
        let items = response;
        console.log(items)
        items.forEach((item) => {
            let tpl = '<li class="songList">'
                    + '<a href="./song.html?id='+item.id+'">'
                    + '<h3>'+item.name+'</h3>'
                    + '<p><svg class="sq" aria-hidden="true"><use xlink:href="#icon-SQ"></use></svg>'
                    + item.singer+'</p>'
                    + '<svg class="play" aria-hidden="true"><use xlink:href="#icon-icon2"></use></svg>'
                    + '</a></li>';

            let $node = $(tpl);
            $('#songs-list').append($node);
        })
        $('.loading').remove();
    }).fail(function() {
        console.log('网络出错了');
    })

    $('.tabList').on('click','.navigator>li',function(e) {
        let $li = $(e.currentTarget).addClass('active');
            $li.siblings().removeClass('active')
        let index = $li.index();
       $li.trigger('tabchange',index)
        $('.tabContent>li').eq(index).addClass('active')
            .siblings().removeClass('active')
    })

    $('.tabList').on('tabchange',function(e,index) {
        let $isDown = $('.tabContent>li').eq(index)
        if(index === 1) {
            if( $isDown.attr('data-load') === 'yes') {
                return;
            }
            updateTime();
            function updateTime() {
                let date = new Date();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                if (month < 10) {
                    $('.update-time').text('更新日期：0' + month + '月' + day + '日')
                } else {
                    $('.update-time').text('更新日期：' + month + '月' + day + '日')
                }
            }
            $.get('../song.json').done(function (response) {
                let items = response;
                items.forEach((idx) => {
                    let tpl = '<li class="songList">'
                        + '<a href="./song.html?id=' + idx.id + '">'
                        + '<p class="order"></p>'
                        + '<h3>' + idx.name + '</h3>'
                        + '<p><svg class="sq" aria-hidden="true"><use xlink:href="#icon-SQ"></use></svg>'
                        + idx.singer + '</p>'
                        + '<svg class="play" aria-hidden="true"><use xlink:href="#icon-icon2"></use></svg>'
                        + '</a></li>';

                    let $node = $(tpl);
                    $('#hotSongs').append($node);
                    if(idx.id <=3) {
                        $node.find('.order').text('0'+idx.id);
                        $node.find('.order').css('color','#df3436');
                    }else if(idx.id >3 && idx.id <10){
                        $node.find('.order').text('0'+idx.id)
                    }else {
                        $node.find('.order').text(idx.id)
                    }
                    
                })
                $isDown.attr('data-load','yes')
                $('.loading').remove();
            }).fail(function () {
                console.log('网络出错了');
            })
        }
    })

    let timer = undefined;
    $('.search>input').on('input',function(e) {
        let $input=$(e.currentTarget)
        let value = $input.val().trim();
        if(value === '') {
            return;
        }
        timer = setTimeout(()=> {
            search(value).then((result) => {
                timer = undefined;
                if(result.length !== 0) {
                    $('#output').text('');
                    let $ul = $('<ul></ul>');
                    result.forEach((item)=> {
                        let $li =  '<li class="songList">'
                              + '<a href="./song.html?id=' + item.id + '">'
                              + '<h3>' + item.name + '</h3>'
                              + '<p><svg class="sq" aria-hidden="true"><use xlink:href="#icon-SQ"></use></svg>'
                              + item.singer + '</p>'
                              + '<svg class="play" aria-hidden="true"><use xlink:href="#icon-icon2"></use></svg>'
                              + '</a></li>';
                        $ul.append($li)
                    })
                    $ul.appendTo($('#output'))
                }else {
                    $('#output').text('暂无搜索结果')
                    $('#output').css("text-align","center")
                }
            })
        },300)
    })
    function search(keyword) {
        return new Promise((resolve,reject) => {
            $.get('../song.json').then((response)=> {
                let newArray = response;
                let result = newArray.filter(function(item) {
                    return (item.name.indexOf(keyword) >= 0 || item.singer.indexOf(keyword) >= 0)
                })
                resolve(result);
            })
        })   
    }
    window.search = search
})
