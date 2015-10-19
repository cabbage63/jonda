//URL毎に処理を分岐
var url = location.href;
var arrayOfUrl = url.split('/');
var len = arrayOfUrl.length;

//ボタン呼び出し処理実行部分
chrome.storage.sync.get(["area", "username", "search"],
        function(items) {
            if( len == 5 && arrayOfUrl[4].indexOf('stock') != -1 ){
                if( items["area"] === "all" || arrayOfUrl[3] === items["username"] || items["area"] === undefined ){
                    init_stocklist();
                }
            }else if( len == 6 && arrayOfUrl[4].indexOf('items') != -1 ){
                if( items["area"] === "all" || $('span.itemStockButton').hasClass('stocked') || items["area"] === undefined ){
                    init_article();
                }
            }else if( len == 4 && arrayOfUrl[3].indexOf("search") != -1 ){
                if( items["search"] || items["area"] === undefined ){
                    init_search();
                }
            }
        });

//ストック一覧の初期化処理
function init_stocklist(){
    //ストックした記事毎に解析
    var articleVar = $('article');
    var articleLength = articleVar.length;
    var articleIds = [];

    $.each(articleVar,
            function(idx, article){
                //要素追加
                $(this).find('ul.publicItem_statusList').append(add_button_to_stocklist(false,idx));

                //ボタンにイベント追加
                (function(){
                    var num = idx;
                    var button = $("#itembt"+num+" button");
                    var txt = "";
                    button.click(function(){
                        button.toggleClass('isRead');
                        set_button_status_stocklist(button, button.hasClass('isRead'));
                        save_status(articleIds[num], button.hasClass('isRead'));
                    });
                })();

                //記事IDを取得
                articleIds.push($(this).data('uuid'));
            }
          );
    restore_status_stocklist(articleIds);
}

//記事ページの初期化処理
function init_article(){
    //要素追加
    $('div.itemsShowHeaderStock').append('<button class="btn btn-default btn-block isReadButton">未読</button>');

    restore_status_article(arrayOfUrl[5]);

    //ボタンにイベント追加
    (function(){
        var button = $('div.itemsShowHeaderStock button.isReadButton');
        button.click(function(){
            button.toggleClass('isRead');
            set_button_status_article(button, button.hasClass('isRead'));
            save_status(arrayOfUrl[5], button.hasClass('isRead'));
        });
    })();

}

//ストック一覧の初期化処理
function init_search(){
    var ch = chrome.runtime.getURL("/css/search.css");
    var css = '<link rel="stylesheet" type="text/css" href="'+ ch + '">';
    $('head').append(css);

    //ストックした記事毎に解析
    var articleVar = $('div.searchResult');
    var articleLength = articleVar.length;
    var articleIds = [];

    $.each(articleVar,
            function(idx, article){
                //要素追加
                $(this).find('ul.searchResult_statusList').append(add_button_to_stocklist(false,idx));

                //ボタンにイベント追加
                (function(){
                    var num = idx;
                    var button = $("#itembt"+num+" button");
                    var txt = "";
                    button.click(function(){
                        button.toggleClass('isRead');
                        set_button_status_stocklist(button, button.hasClass('isRead'));
                        save_status(articleIds[num], button.hasClass('isRead'));
                    });
                })();

                //記事IDを取得
                articleIds.push($(this).data('uuid'));
            }
          );
    restore_status_search(articleIds);
}

//ストック一覧のボタンの状態変更
function set_button_status_stocklist(button, isRead){
    var txt;
    var clsOn,clsOff;
    if(isRead){
        txt = "既読";
        clsOn = "btn-primary isRead";
        clsOff = "btn-default";
    }else{
        txt = "未読";
        clsOff = "btn-primary isRead";
        clsOn = "btn-default";
    }
    button.toggleClass(clsOn,true).toggleClass(clsOff,false).text(txt);
}

//記事ページのボタンの状態変更
function set_button_status_article(button, isRead){
    var txt;
    var clsOn,clsOff;
    if(isRead){
        txt = "既読";
        clsOn = "btn-primary isRead";
        clsOff = "btn-default";
    }else{
        txt = "未読";
        clsOff = "btn-primary isRead";
        clsOn = "btn-default";
    }
    button.toggleClass(clsOn,true).toggleClass(clsOff,false).text(txt);
}


//未読・既読に応じてタグを挿入
function add_button_to_stocklist(isRead, idx){
    if(isRead){
        return '<li id="itembt' + idx + '" class="publicItem_isRead"><button class="btn btn-primary isRead">既読</button></li>'
    }else{
        return '<li id="itembt' + idx + '" class="publicItem_isRead"><button class="btn btn-default">未読</button></li>'
    }
}

//ストレージにステータスを保存する
function save_status(uuid, isRead) {
    var val = {uuid:true}
    val[uuid] = isRead;
    chrome.storage.local.set(val
            , function() {
            });
}

//ボタンに状態を付与する
function restore_status_stocklist(idList) {
    chrome.storage.local.get(idList,
            function(items) {
                var itemKeys = Object.keys(items);
                var itemLen = itemKeys.length;
                var button; 
                for(i=0; i<itemLen; i++){
                    button = $('article[data-uuid = ' + itemKeys[i] + '] button');
                    set_button_status_stocklist(button, items[itemKeys[i]]);
                }
            });
}

//記事ページのボタン状態をストレージから呼び出す
function restore_status_article(id){
    chrome.storage.local.get(id,
            function(items) {
                set_button_status_article($('div.itemsShowHeaderStock button.isReadButton'), items[id]);
            });
}

//ボタンに状態を付与する
function restore_status_search(idList) {
    chrome.storage.local.get(idList,
            function(items) {
                var itemKeys = Object.keys(items);
                var itemLen = itemKeys.length;
                var button; 
                for(i=0; i<itemLen; i++){
                    button = $('div.searchResult[data-uuid = ' + itemKeys[i] + '] button');
                    set_button_status_stocklist(button, items[itemKeys[i]]);
                }
            });
}

//デバッグ用にストレージ登録状態を標準出力する
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
