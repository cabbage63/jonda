function save_options() {
    var color = document.getElementById('color').value;
    var likesColor = document.getElementById('like').checked;
    chrome.storage.sync.set({
        favoriteColor: color,
        likesColor: likesColor
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

function get_savedinfo() {
    chrome.storage.local.get(null,
            function(items) {
                var keys = Object.keys(items);
                keys.forEach(
                        function(value){
                            var li = document.createElement('li');
                            li.innerText = value + "(" + items[value] + ")";
                            document.getElementById('list').appendChild(li);
                        }
                        );
            });
}

function hoge(){
    var div = document.createElement('div');
    div.innerText = "hogehoge";
    document.getElementById('oya').appendChild(div);
}

document.addEventListener('DOMContentLoaded', get_savedinfo);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('test').addEventListener('click', hoge);
