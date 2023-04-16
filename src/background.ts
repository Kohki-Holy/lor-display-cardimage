chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    const url = chrome.runtime.getURL('cards.json')
    fetch(url)
        .then( response => response.json())
        .then( ( data:String ) => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                const tabId = tabs[0].id
                if(tabId){
                    chrome.tabs.sendMessage(tabId, data)
                }
            })
        })
        .catch(error => console.error(error))
})