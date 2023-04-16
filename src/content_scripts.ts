import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

interface CardType {
    name: string,
    id: string,
    set: string
}

// ボタンを作成 
const newElement = document.createElement('div')
newElement.className = 'execute_script_wrappaer'
newElement.innerHTML = '<button id="execute">カード画像を表示する</button>'
document.body.appendChild(newElement)

// スクロールで出たり消えたりさせる
let start = 0
const target = document.getElementsByClassName('execute_script_wrappaer')[0]
window.addEventListener('scroll',( )=>{
    const scrollTop = window.scrollY
    if (scrollTop >= 550){
        if( scrollTop >= start){
            target.classList.add('fadeout')
            target.classList.remove('fadein')
        } else {
            target.classList.add('fadein')
            target.classList.remove('fadeout')
        }
    }
    start = scrollTop
})

// カードデータを取得する
const viewCardImage = function( json:CardType[] ){

    const pList = document.getElementsByTagName('p')
    Array.prototype.forEach.call(pList, ( element:HTMLElement ) => {

        // class属性に added-image が存在していたら処理しない
        if(element.classList.contains('added-image')) return true
        
        // class属性に処理済フラグを追加する
        element.classList.add('added-image')

        const html = element.innerHTML
        const regexp = /(?<bracketName>«(?<cardName>[^»]+?)»)/g
        const regexpMatchCardList = html.matchAll(regexp)

        Array.from(regexpMatchCardList).forEach( (regexpMatchCard, index) => {
            // « » つきの文字列が存在しなかったら処理しない
            if(
                typeof regexpMatchCard === 'undefined'
                || regexpMatchCard === null
                || typeof regexpMatchCard.groups === 'undefined'
            ) return true

            const bracketCard = regexpMatchCard.groups.bracketName
            const card = regexpMatchCard.groups.cardName

            const filterdJson = json.filter( item => item.name == card )
                
            // カード名が存在しなければ処理しない
            if(filterdJson.length == 0) return true

            let number = index + 1

            const cardText = document.createElement('a')
            cardText.classList.add('lorCardImage')
            cardText.setAttribute('href', '#')
            cardText.textContent = bracketCard
            cardText.dataset.cardCode = filterdJson[0].id
            cardText.dataset.cardSet = filterdJson[0].set

            element.innerHTML = element.innerHTML.replace(regexp, ( match ) => {
                if(--number == 0){
                    // 置換
                    return cardText.outerHTML
                } else {
                    // 置換しない
                    return match
                }
            })
        })
    })
    
    const instance = tippy('.lorCardImage', {
        content: (reference) => {
            const url = chrome.runtime.getURL('./public/images/card-placeholder.png')
            const img = `<img src="${url}" loading="lazy">`
            return img!=null? img:''
        },
        arrow: false,
        placement: 'right',
        allowHTML: true,
        onShow(instance){
            const code = instance.reference.getAttribute('data-card-code')
            const set = instance.reference.getAttribute('data-card-set')
            const url = 'https://dd.b.pvp.net/latest/' + set + '/ja_jp/img/cards/' + code + '.png'
            const img = instance.popper.querySelector('img')
            if( img == null) return false
            img.src = url
        }
    })
}

chrome.runtime.sendMessage('hoge')

chrome.runtime.onMessage.addListener( (request :CardType[]) => {
    const executeScript = document.getElementById("execute")
    if(executeScript) executeScript.addEventListener('click', ()=> viewCardImage(request) )
})