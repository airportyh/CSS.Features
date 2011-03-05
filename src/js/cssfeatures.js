(function(){
    
    function parseBrowser(){
        function parseVersion(version){
            var parts = version.split('.')
            return parseFloat(parts[0] + '.' + parts.slice(1).join(''))
        }
        var regexs = {
            ie: /MSIE ([0-9]+(\.[0-9]+)+)/,
            ff: /Firefox\/([0-9]+(\.[0-9]+)+)/,
            safari: /Version\/([0-9]+(\.[0-9]+)+) Safari/,
            chrome: /Chrome\/([0-9]+(\.[0-9]+)+)/,
            opera: /Opera.* Version\/([0-9]+(\.[0-9]+)+)/
        }
        var ua = navigator.userAgent;
        for (var browser in regexs){
            var regex = regexs[browser]
            var match = ua.match(regex)
            if (match)
                return {name: browser, version: parseVersion(match[1])}
        }
        return null
    }
    
    function capitalize(str){
        return str.charAt(0).toUpperCase() + str.substring(1)
    }
    
    function camelcase(str){
        var parts = str.split('-')
        if (parts.length <= 1) return str
        return parts[0] + parts.slice(1).map(function(p){
            return capitalize(p)
        }).join('')
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
        if (Browser.name == 'ie') return checkPropIE(prop)
        var props = [prop]
        if (Browser) props.push(Browser + capitalize(prop))
        var elm = document.createElement('div')
        for (var i = 0; i < props.length; i++)
            if (undefined !== getStyle(elm, props[i]))
                return true
        return false
    }
    
    function checkValue(prop, value){
        var elm = document.createElement('div')
        try{
            elm.style[prop] = value
            var res = getStyle(elm, prop)
            return Boolean(res)
        }catch(e){
            return false
        }
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
                classes.push('Has' + feat)
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
            //BorderImage: checkProp('borderImage'),
            BackgroundSize: checkProp('backgroundSize'),
            //HSLColors: checkColor('hsl(0, 1%, 1%)'),
            //HSLAColors: checkColor('hsls(0, 1%, 1%, 0)'),
            Opacity: checkProp('opacity'),
            RGBAColors: checkColor('rgba(0, 0, 0, 0)'),
            //TextOverflow: checkProp('textOverflow'),
            //WordWrap: checkProp('wordWrap'),
            //BoxSizing: checkProp('boxSizing'),
            //Outline: checkProp('outline'),
            //Columns: checkProp('columnRule'),
            //WebKitGradient: checkWebKitGradient(),
            MinMaxHeightWidth: checkProp('minWidth'),
            PositionFixed: Browser.name == 'ie' ? (Browser.version >= 7) : checkValue('position', 'fixed'),
            //MaskImage: checkProp('maskImage'),
            //Animation: checkProp('animation'),
            Transform: checkProp('transform'),
            Transition: checkProp('transition'),
            PNGTransparency: Browser.name == 'ie' ? (Browser.version >= 7) : true
            // TODO: Anyway to detect support for multiple backgrounds?
        }
    }
    var CSS = {
        addFeatures: function(moreFeatures){
            
        },
        Browser: Browser,
        init: function(){
            checkAllFeatures()
            setBodyClasses(CSS.Features)
        },
        getStyle: getStyle,
        checkProp: checkProp
    };
    window.CSS = CSS
    
})()