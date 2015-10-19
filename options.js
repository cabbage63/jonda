function save_options() {
    var area = $('#area').val();
    var username = $('#username').val();
    var search = $('#search').prop('checked');
    chrome.storage.sync.set({
        area: area,
        username: username,
        search: search 
    }, function() {
        // Update status to let user know options were saved.
        var status = $('#status');
        status.text('オプションを保存しました。');
        setTimeout(function() {
            status.text('');
        }, 750);
    });
}

function restore_options(){
    chrome.storage.sync.get(["area", "username", "search"],
            function(items){
                $('#area').val(items.area);
                if(items.area === undefined){
                    $('#area').val("all");
                }
                $('#username').val(items.username);
                $('#search').prop('checked',items.search);
                activate();
            });

    chrome.storage.local.get(null,
            function(items) {
                var keys = Object.keys(items);
                keys.forEach(
                        function(value){
                            var li = $('<li>' + value + "(" + items[value] + ")" + '</li>');
                            $('#list').append(li);
                        }
                        );
            });
}

function get_savedinfo() {
    var list = $('#list');
    if( list.attr("hidden") == "hidden" ){
        list.removeAttr("hidden");
        $('#showAll').text("閉じる");
    }else{
        list.attr("hidden", "hidden");
        $('#showAll').text("すべて表示");
    }
}

function activate(){
    if( $('#area').val() == "user"){
       $('#labUsername').removeAttr("hidden");
       $('#labSearch').attr("hidden", "hidden");
    }else{
       $('#labUsername').attr("hidden", "hidden"); 
       $('#labSearch').removeAttr("hidden");
    }
}

document.getElementById('area').addEventListener('change', activate);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('showAll').addEventListener('click', get_savedinfo);
document.addEventListener('DOMContentLoaded', restore_options);
