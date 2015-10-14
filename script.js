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

initList();

function initList(){
    //ストックした記事毎に解析
    var articleVar = $('article');
    var articleLength = articleVar.length;
    var articleIds = [];
    console.log(articleVar.length);
    $.each(articleVar,
            function(idx, article){
                //console.log('[' + idx + ']' + article);
                //要素追加
                $(this).find('ul.publicItem_statusList').append(addButton(true,idx));

                //ボタンにイベント追加
                (function(){
                    var num = idx;
                    var button = $("#itembt"+num+" button");
                    var txt = "";
                    button.click(function(){
                        if(button.hasClass('isRead')){
                            txt = "既読";
                        }else{
                            txt = "未読";
                        }
                        button.toggleClass('btn-success btn-default isRead').text(txt);
                    });
                })();

                //記事IDを取得
                articleIds.push($(this).data('uuid'));
            }
    );

    console.log(articleIds);
}


//未読・既読に応じてタグを挿入
function addButton(isRead, idx){
    if(isRead){
        return '<li id="itembt' + idx + '" class="publicItem_isRead"><button class="btn btn-success">既読</button></li>'
    }else{
        return '<li id="itembt' + idx + '" class="publicItem_isRead"><button class="btn btn-default">未読</button></li>'
    }
}

/*
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

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options(idList) {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        favoriteColor: 'red',
        likesColor: true
    }, function(items) {
        document.getElementById('color').value = items.favoriteColor;
        document.getElementById('like').checked = items.likesColor;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
        save_options);
        */
