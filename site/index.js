function keys(obj){
    var ret = []
    for (var key in obj) ret.push(key)
    return ret
}
if (!window.console){
    window.console = {log: function(){}}
}

function init(){
    
    $('#features_overview').prepend('<ul id="features"></ul>')
    $('.featureIntro').css({position: 'absolute'}).hide()
    $('#console').text('<body class="' + document.body.className + '">')
    console.log(3)
    var features = keys(CSS.Features).sort()
    for (var i = 0; i < features.length; i++){
        var feat = features[i]
        console.log('feat: ' + feat)
        var className = CSS.Features[feat] ? 'works' : 'broken'
        var li = $('<li id="' + feat + '" class="' + 
            className + '">' + feat + '</li>')
            .mouseover(function(){
              $('.selected').each(function(){
                $('#' + this.id + 'Intro').hide()
              })
              var offset = $('#features').offset()
              var listWidth = $('#features').width()
              var width = $('#features_overview').width() - listWidth - offset.left
              var intro = $('#' + this.id + 'Intro')
              intro.css({
                  left: (listWidth + offset.left - 35) + 'px',
                  width: width + 'px'
              })
              var introBottom = $("#features").offset().top + intro.height()
              console.log('$("features").offset().top' + $("#features").offset().top)
              console.log('intro.offset().top: ' + intro.offset().top)
              console.log('intro.height(): ' + intro.height())
              console.log('intro.padding-top: ' + intro.css('padding-top'))
              console.log('introBottom: ' + introBottom)
              console.log('$(this).offset().top: ' + $(this).offset().top)
              
              if (introBottom < $(this).offset().top){
                  console.log('too low')
                  intro.css({
                      top: ($(this).offset().top - 
                        intro.height() + ($(this).height() / 2) - 
                        offset.top) + 'px'
                  })
              }
              intro.show()
          
              $(this).addClass('highlight')
            })
            .mouseout(function(){
              if (!$(this).hasClass('selected')){
                $('#' + this.id + 'Intro').hide()
              }
              $('.selected').each(function(){
                $('#' + this.id + 'Intro').show()
              })  
              $(this).removeClass('highlight')
          
            })
            .click(function(){
              $('.selected').removeClass('selected')
              $(this).addClass('selected')
              var intro = $('#' + this.id + 'Intro')
              if ($('#features_overview').height() < intro.height() + 40){
                  $('#features_overview').css({height: (intro.height() + 40) + 'px'})
              }
            })
        $('#features').append(li)
        
    }
    $('#browserDisplay').text(CSS.Browser.name + ' ' + CSS.Browser.version)
    console.log(5)
}

$(function(){
    setTimeout(init, 200)
})