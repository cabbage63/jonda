//URL毎に処理を分岐
var url = location.href;
console.log('現在のURL：' + url);

var arrayOfUrl = url.split('/');
var len = arrayOfUrl.length;
for(i=0; i<len; i++){
    console.log('arrayOfUrl['+i+']: '+ arrayOfUrl[i]);
}

if( arrayOfUrl.indexOf('stock') != -1 ){
    //ストック一覧ページの場合の処理
    console.log('stockpage!');
}


init_list();

function init_list(){
    //ストックした記事毎に解析
    var articleVar = $('article');
    var articleLength = articleVar.length;
    var articleIds = [];

    console.log(articleVar.length);
    $.each(articleVar,
            function(idx, article){
                //console.log('[' + idx + ']' + article);
                //要素追加
                $(this).find('ul.publicItem_statusList').append(add_button(false,idx));

                //ボタンにイベント追加
                (function(){
                    var num = idx;
                    var button = $("#itembt"+num+" button");
                    var txt = "";
                    button.click(function(){
                        button.toggleClass('isRead');
                        set_button_status(button, button.hasClass('isRead'));
                        save_status(articleIds[num], button.hasClass('isRead'));
                    });
                })();

                //記事IDを取得
                articleIds.push($(this).data('uuid'));
            }
    );
    restore_status(articleIds);
}

function set_button_status(button, isRead){
    var txt;
    var clsOn,clsOff;
    if(isRead){
        txt = "既読";
        clsOn = "btn-success isRead";
        clsOff = "btn-default";
    }else{
        txt = "未読";
        clsOff = "btn-success isRead";
        clsOn = "btn-default";
    }
    button.toggleClass(clsOn,true).toggleClass(clsOff,false).text(txt);
}


//未読・既読に応じてタグを挿入
function add_button(isRead, idx){
    if(isRead){
        return '<li id="itembt' + idx + '" class="publicItem_isRead"><button class="btn btn-success isRead">既読</button></li>'
    }else{
        return '<li id="itembt' + idx + '" class="publicItem_isRead"><button class="btn btn-default">未読</button></li>'
    }
}


function save_status(uuid, isRead) {
    var val = {uuid:true}
    val[uuid] = isRead;
    chrome.storage.local.set(val
            , function() {
                if(chrome.extension.lastError !== undefined){
                    alert("error!");
                }else{
                    // Update status to let user know options were saved.
                    alert("saved status as " + isRead + "(key:" + uuid + ")");
                }
            });
}

//ボタンに状態を付与する
function restore_status(idList) {
    chrome.storage.local.get(idList,
            function(items) {
                var itemKeys = Object.keys(items);
                var itemLen = itemKeys.length;
                var button; 
                for(i=0; i<itemLen; i++){
                    button = $('article[data-uuid = ' + itemKeys[i] + '] button');
                    set_button_status(button, items[itemKeys[i]]);
                }
                if(chrome.extension.lastError !== undefined){
                    alert('error!');
                }
            });
}

//デバッグ用
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
    }
});
