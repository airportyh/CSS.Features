(function(){
    
    var Browser = (function(){
        var ua = navigator.userAgent;
        var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]'
        if (!!window.attachEvent && !isOpera) return 'IE'
        if (isOpera) return 'O'
        if (ua.indexOf('AppleWebKit/') > -1) return 'Webkit'
        if (ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1) return 'Moz'
        return null
      })()
    
    function capitalize(str){
        return str.charAt(0).toUpperCase() + str.substring(1)
    }
      
    function getStyle(element, style){
        var value = element.style[style]
        if (value) return value
        if (document.defaultView && document.defaultView.getComputedStyle){
            var css = document.defaultView.getComputedStyle(element, null)
            return css ? css[style] : null
        }
        if (element.currentStyle){
            return element.currentStyle(style)
        }
    }
    
    function checkPropIE(prop){
        var elm = document.createElement('div')
        try{
            elm.style[prop] = '_______'
            return false
        }catch(e){
            return true
        }
    }
    
    function checkProp(prop){
        if (Browser == 'IE') return checkPropIE(prop)
        var props = [prop]
        if (Browser) props.push(Browser + capitalize(prop))
        var elm = document.createElement('div')
        for (var i = 0; i < props.length; i++)
            if (undefined !== getStyle(elm, props[i]))
                return true
        return false
    }
    
    function checkColor(color){
        var elm = document.createElement('div')
        try{
            elm.style.backgroundColor = color
            var res = getStyle(elm, 'backgroundColor')
            return Boolean(res)
        }catch(e){
            return false
        }
    }
    
    function checkWebKitGradient(){
        if (Browser != 'Webkit') return false
        var val = "-webkit-gradient(linear, 0% 0%, 0% 90%, from(rgba(28, 91, 155, 0.8)), to(rgba(108, 191, 255, .9)))"
        var elm = document.createElement('div')
        elm.style.display = 'none'
        // gradient requires the element to by added to the document for the value
        // to show up in js
        document.body.appendChild(elm)
        elm.style.backgroundImage = val
        var res = getStyle(elm, 'backgroundImage')
        document.body.removeChild(elm)
        if (!res) return false
        return res.indexOf('-webkit-gradient') == 0
    }
    
    function setBodyClasses(features){
        var classes = document.body.className.split(' ')
        if (classes[0] == '') classes = []
        for (var feat in features){
            if (!features[feat])
                classes.push('No' + feat)
            else
                classes.push(feat)
        }
        if (classes.length > 0)
            document.body.className = classes.join(' ')
    }
    
    function checkAllFeatures(){
        CSS.Features = {
            BoxShadow: checkProp('boxShadow'),
            TextShadow: checkProp('textShadow'),
            BorderRadius: checkProp('borderRadius'),
            BorderColors: checkProp('borderBottomColors'),
            BorderImage: checkProp('borderImage'),
            BackgroundOrigin: checkProp('backgroundOrigin'),
            BackgroundClip: checkProp('backgroundClip'),
            BackgroundSize: checkProp('backgroundSize'),
            HSLColors: checkColor('hsl(0, 1%, 1%)'),
            HSLAColors: checkColor('hsls(0, 1%, 1%, 0)'),
            Opacity: checkProp('opacity'),
            RGBAColors: checkColor('rgba(0, 0, 0, 0)'),
            TextOverflow: checkProp('textOverflow'),
            WordWrap: checkProp('wordWrap'),
            BoxSizing: checkProp('boxSizing'),
            Resize: checkProp('resize'),
            Outline: checkProp('outline'),
            ColumnWidth: checkProp('columnWidth'),
            ColumnCount: checkProp('columnCount'),
            ColumnRule: checkProp('columnRule'),
            WebKitGradient: checkWebKitGradient()
        }
    }
    // TODO: Anyway to detect support for multiple backgrounds?
    var CSS = {
        init: function(){
            checkAllFeatures()
            setBodyClasses(CSS.Features)
        },
        getStyle: getStyle
    };
    window.CSS = CSS
    
})()