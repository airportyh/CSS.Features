(function(){
    
    (function(){
        var addLoadListener
        var removeLoadListener
        if (window.addEventListener){
            addLoadListener = function(func){
                window.addEventListener('DOMContentLoaded', func, false)
                window.addEventListener('load', func, false)
            }
            removeLoadListener = function(func){
                window.removeEventListener('DOMContentLoaded', func, false)
                window.removeEventListener('load', func, false)
            }
        }else if (document.attachEvent){
            addLoadListener = function(func){
                document.attachEvent('onreadystatechange', func)
                document.attachEvent('load', func)
            }
            removeLoadListener = function(func){
                document.detachEvent('onreadystatechange', func)
                document.detachEvent('load', func)
            }
        }

        var callbacks = null
        var done = false
        function __onReady(){
            done = true
            removeLoadListener(__onReady)
            if (!callbacks) return
            for (var i = 0; i < callbacks.length; i++){
                callbacks[i]()
            }
            callbacks = null
        }
        function OnReady(func){
            if (done){
                func()
                return
            }
            if (!callbacks){
                callbacks = []
                addLoadListener(__onReady)
            }
            callbacks.push(func)
        }
        window.OnReady = OnReady
    })()
    
    
    function init(){
        checkAllFeatures()
        render()
    }
    
    function parseBrowser(){
        var browserToPrefix = {
            ie: 'ms',
            firefox: 'moz',
            safari: 'webkit',
            chrome: 'webkit',
            opera: 'o'
        }
        
        function parseVersion(version){
            var parts = version.split('.')
            return parseFloat(parts[0] + '.' + parts.slice(1).join(''))
        }
        var regexs = {
            ie: /MSIE ([0-9]+(\.[0-9]+)+)/,
            firefox: /Firefox\/([0-9]+(\.[0-9]+)+)/,
            safari: /Version\/([0-9]+(\.[0-9]+)+) Safari/,
            chrome: /Chrome\/([0-9]+(\.[0-9]+)+)/,
            opera: /Opera.* Version\/([0-9]+(\.[0-9]+)+)/
        }
        var ua = navigator.userAgent;
        for (var browser in regexs){
            var regex = regexs[browser]
            var match = ua.match(regex)
            if (match)
                return {name: browser, 
                    version: parseVersion(match[1]), 
                    prefix: browserToPrefix[browser]}
        }
        return null
    }
    
    var Browser = parseBrowser()
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
        if (Browser) props.push(capitalize(Browser.prefix) + capitalize(prop))
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
        if (Browser.prefix != 'webkit') return false
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
    
    function render(){
        var features = CSS.Features
        var classes = document.body.className.split(' ')
        if (classes[0] == '') classes = []
        for (var feat in features){
            var clazz = 'Has' + feat
            var index = classes.indexOf(clazz)
            if (features[feat] && index < 0)
                classes.push(clazz)
            else if (!features[feat] && index >= 0)
                classes.splice(index, 1)
        }
        if (classes.length > 0)
            document.body.className = classes.join(' ')
    }
    
    function checkAllFeatures(){
        CSS.Features = {
            BoxShadow: checkProp('boxShadow'),
            TextShadow: checkProp('textShadow'),
            BorderRadius: Browser.prefix == 'moz' ?
                (Browser.version >= 3):
                checkProp('borderRadius'),
            BorderColors: checkProp('borderBottomColors'),
            //BorderImage: checkProp('borderImage'),
            BackgroundSize: checkProp('backgroundSize'),
            //HSLColors: checkColor('hsl(0, 1%, 1%)'),
            //HSLAColors: checkColor('hsls(0, 1%, 1%, 0)'),
            Opacity: checkProp('opacity'),
            RGBAColors: Browser.prefix == 'moz' ? 
                (Browser.version >= 3) :
                checkColor('rgba(0, 0, 0, 0)'),
            //TextOverflow: checkProp('textOverflow'),
            //WordWrap: checkProp('wordWrap'),
            //BoxSizing: checkProp('boxSizing'),
            //Outline: checkProp('outline'),
            //Columns: checkProp('columnRule'),
            //WebKitGradient: checkWebKitGradient(),
            MinMaxHeightWidth: checkProp('minWidth'),
            PositionFixed: Browser.name == 'ie' ? 
                (Browser.version >= 7) : 
                checkValue('position', 'fixed'),
            //MaskImage: checkProp('maskImage'),
            //Animation: checkProp('animation'),
            Transform: checkProp('transform'),
            //Transition: checkProp('transition'),
            PNGTransparency: Browser.name == 'ie' ? 
                (Browser.version >= 7) : 
                true
            // TODO: Anyway to detect support for multiple backgrounds?
            
        }
    }
    var CSS = {
        addFeatures: function(moreFeatures){
            
        },
        Browser: Browser,
        init: init,
        render: render,
        getStyle: getStyle,
        checkProp: checkProp
    };
    window.CSS = CSS
    
    OnReady(CSS.init)
    
})()