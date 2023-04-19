chrome.action.onClicked.addListener( tab => {
    // note以外では処理しない
    if( tab.url?.indexOf('https://note.com/') == -1) return false
    const tabId = tab.id
    if(tabId){
        const url = chrome.runtime.getURL('cards.json')
        fetch(url)
            .then( response => {
                if(!response.ok) console.error('サーバーエラーです')
                return response.json()
            })
            .then( ( data ) => {
                // jsonデータを送信する
                chrome.tabs.sendMessage(tabId, data)
            })
            .catch(error => console.error(error,'hoge'))
    }
})