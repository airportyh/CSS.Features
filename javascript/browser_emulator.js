function browserEmulator(){
    if (!CSS) alert('CSS.Features library not found. Please include the library on this page before using this bookmarklet.');
    function onCBChange(e){
        var elm = e.srcElement;
        var feat = elm.name;
        CSS.Features[feat] = elm.checked;
        CSS.render();
    }
    var ul = document.createElement('ul');
    with(ul.style){
        margin = '0px';
        padding = '1em';
        position = 'fixed';
        bottom = '10px';
        right = '10px';
        backgroundColor = 'rgba(255, 255, 255, 0.6)';
        WebkitBorderRadius = '5px';
        MozBorderRadius = '5px';
        borderRadius = '5px';
        listStyle = 'none';
    }
    for (var feat in CSS.Features){
        var li = document.createElement('li');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.name = feat;
        cb.checked = CSS.Features[feat];
        cb.addEventListener('change', onCBChange);
        var label = document.createElement('label');
        label.innerHTML = feat;
        if (!CSS.Features[feat]){
            label.style.color = '#666';
            cb.disabled = 'disabled';
        }
        li.appendChild(cb);
        li.appendChild(label);
        ul.appendChild(li);
    }
    document.body.appendChild(ul);
}