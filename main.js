/// <reference path="jquery-3.6.3.js"/>

$(()=>{
// hide & show sections
$("section").hide()
$("#Currencies").show()
$("a").on("click", function(){
    $("section").hide()  
    let name= $(this).attr("data-section")
    $("#"+name).show()  
})

let coinsarr=[]
// General Ajax fetch
function getJSON(url){
    return new Promise((resolve, reject)=>{
        $.ajax({
            url:url,
            success: (data)=>resolve(data),
            error: (error)=>reject(error),
            type: "GET"
        })
    })
}
async function handleJSON(){
    try{
        coinsarr = await getJSON("https://api.coingecko.com/api/v3/coins/")
        console.log(coinsarr)
        console.log(coinsarr.length)
        createDynamicCardDesign(coinsarr)
    } catch (error){
        console.log(error.message)
    }
} handleJSON()

// DAS IST GUT
function createDynamicCardDesign(coinsarr){
    let html=""
for(let i=0; i<coinsarr.length; i++){
    html+=`
    <div class="cards" id="card${i}">
        <figure class="card" style="display: inline-block">
                <div class="contents">
                        <p style="font-size:20pt; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; ; ">${coinsarr[i].id}</p>
                        <img class="CoinImg" src="${coinsarr[i].image.large}"/>
                        <div class="form-check form-switch">
                            <span>${coinsarr[i].symbol}</span>
                            <input class="form-check-input toggled_off" type="checkbox" role="switch" id="togg-${coinsarr[i].id}" data-fakeID="${coinsarr[i].id}">
                        </div>
                 </div>
            <figcaption><button id="${coinsarr[i].id}" class="MoreInfoBTN">More info</button></figcaption>    
        </figure>
        
        <div class="MoreInfoDIV " id="div${coinsarr[i].id}" >  
        <img src="Assets/vecteezy_dollar-coin-clipart_.jpg" class="spinner-grow  m-3 " role="status"/>       

      </div>
    </div>
      ` 
//    .contents - is a div I added
}
$("#cardwrapperfromint").html(html)
    } 

// open / close More-info Div
$("#Currencies").on("click", "figcaption>button", async function openCloseDIV(){
    let singCoinID=$(this).attr("id")
    let thisDiv=$("#"+"div"+singCoinID)
            thisDiv.toggle()
            try{
                if((sessionStorage.getItem(`${singCoinID}`) === null)&&($(thisDiv).is(":visible"))){
                let thisCoinInfo = await getJSON(`https://api.coingecko.com/api/v3/coins/${singCoinID}`)
                contents_MoreInfo(thisCoinInfo, singCoinID)
                setSession(singCoinID, thisCoinInfo)
                    }
                else{
                let thisCoinInfo=JSON.parse(sessionStorage.getItem(`${singCoinID}`))
                contents_MoreInfo(thisCoinInfo, singCoinID)
                    }
            }catch(error){
                console.log(error.message)
            }  
})
// setSession
function setSession(key, value){ //`value` should be the info we have fetched = thisCoinInfo// `Key` should be the ID of (this)= singCoinID
   let val1=JSON.stringify(value)
   sessionStorage.setItem(key, val1)
        setTimeout(()=>{
          sessionStorage.removeItem(key);
         },120000) 
} 
// contents of More info // לא הוספתי את סימני המטבע בפרוייקט, כי זה לא אסתטי בעיני... אבל הנה: ...💲, 💰,
function contents_MoreInfo(thisCoinInfo, singCoinID){
    let html=`
    <span><span class="dollar">$&nbsp</span>${thisCoinInfo.market_data.current_price.usd}</span><br>
    <span><span class="dollar">EU &nbsp</span>${thisCoinInfo.market_data.current_price.eur}</span><br>
    <span> <span class="dollar">NIS&nbsp</span>${thisCoinInfo.market_data.current_price.ils}</span><br>
    `
    $("#"+"div"+singCoinID).html(html)
  }

// search button
    $("#searchTextBox").on("keyup", function (){
            let searchVal=$("#searchTextBox").val().toLowerCase()
            if(searchVal===""){
                createDynamicCardDesign(coinsarr)
            }else{
                let filteredCoins= coinsarr.filter(sing=>sing.symbol.indexOf(searchVal)>-1)
                createDynamicCardDesign(filteredCoins)
        }
    })
    
let coinsarr5=[]

//  toggle check-btns in the global scope + add up to 5
$("#Currencies").on("click", ".form-check-input", function (){ //form-check-input is the class of the toggle button 
    let checked_coin_id=$(this).closest('.contents').next().children().attr(`id`)// returns name of coin
    let id= $(this).attr("id")// original toggle-button id
    console.log("id:"+ id)
    if(($(this).hasClass("toggled_off"))&&(coinsarr5.length<5)){
        coinsarr5.push(checked_coin_id)
        console.log(coinsarr5)
        $(this).removeClass("toggled_off")
    }
    else{ // the arr is toggled on already === user wants to deselect
            if(!$(this).hasClass("toggled_off")){
                remove_charFromArr(coinsarr5, checked_coin_id)
                $(this).addClass("toggled_off")
            }
            else{ // namely, the arr is > than 5!
                coinsarr5.push(checked_coin_id)
                console.log(coinsarr5)
                triggerModal(id)
                $(this).removeClass("toggled_off")     
            }
        }
})

//remove from coinsarr5 deselected 
   function remove_charFromArr(coinsarr5, checked_coin_id){//add id of this toggle, put it in that toggle as well 
    for(let i=0; i<coinsarr5.length;i++){
            if(coinsarr5[i]===checked_coin_id){
                coinsarr5.splice(i, 1)
            }
    }
    console.log(coinsarr5)
   }
//  Display ToggleButtons in Modal
   function displayToggleBtnsinModal(id){ 
    let html=""
    for(let i=0; i<coinsarr5.length-1; i++){
        html+=`
      <div class="form-check form-switch">
        <input class="form-check-input" type="checkbox" role="switch" id="${id}B" data-ID="${coinsarr5[i]}" checked>
        <label class="form-check-label" for="${id}B"><span>${coinsarr5[i]}</span></label>
      </div>
        `
    }
    $(".modal-body").html(html)
}

// insert delelected-toggle-btns in Modal into a new arr // Enter the id

let arrofDeselectedinModal=[]
// toggle - btn in Modal  : toggle them
$(".modal-body").on("click", ".form-check-input", function (){ //form-check-input is the class of the toggle button 
    let fake_id=$(this).attr("data-id")
    if(!$(this).hasClass("toggled_off")) {// arr default is toggled on already === user wants to deselect
        $(this).addClass("toggled_off")
        arrofDeselectedinModal.push(fake_id)
        console.log(arrofDeselectedinModal)
    }
    else{ 
            if($(this).hasClass("toggled_off")){
                $(this).removeClass("toggled_off")
                remove_charFromArr(arrofDeselectedinModal, fake_id)
            }
        }
})

// save changes btn
$("#saveUpdates").on("click", function(){
    if(arrofDeselectedinModal.length===0){
        $("#CancelBtn").trigger("click")
    }else if(arrofDeselectedinModal.length>0){
            arrofDeselectedinModal.forEach((char)=>{
                remove_charFromArr(coinsarr5, char)//  הצליח 😛
                $("#"+"togg-"+char).prop("checked", false)// הצליח  😛
                $("#"+"togg-"+char).addClass("toggled_off") // הצליח😛
        })
        arrofDeselectedinModal=[]
        }
})

// "cancel" btn click 
   $(`#CancelBtn, #closeBtn`).on("click", function(){
    let char6= coinsarr5[coinsarr5.length-1]
    $('*[data-fakeID= "' +char6+ '" ]').prop('checked', false)  // attention! "Tilde" is not used here[for flunking the variable], rather a single apostrophe.
    $('*[data-fakeID= "'+char6+ '" ]').addClass("toggled_off")
   coinsarr5.pop()
   console.log(coinsarr5)
    })

// trigger Modal 
function triggerModal(id){
  $("#Modal_5_coins").trigger("click")
  displayToggleBtnsinModal(id)
}

// About MEEEEE
    function AboutPage(){
        let html=""
        html+=`
        <h2><strong>About</strong></h2>
<br><br>
        <div id="envelope">
            <div id="BlancDiv1"></div>
            <div id="BlancDiv2"></div>
            <div id="BlancDiv3"></div>
            <div id="BlancDiv4"></div>
            <div id="BlancDiv5"></div>
            <div id="BlancDiv6"></div>
            <div id="BlancDiv7"></div>
            
        </div>
        <div id="textDiv">
            <h3>Eliya Gerlitz</h3>
            <span>
                I like to learn and teach; &nbsp have been an English teacher for<strong> 11</strong> years.  &nbsp Autodidactic.<br>
                Very thorough, dedicated, persistent and patient. Creative and artistic.<br>
                I like to organize and clarify learning materials, especially graphically, through flow-charts<br>
                and other visual aids.<br>
            </span>
        </div>
         
        <img id="MePic" src="Assets/IMG_5058.JPG"/><br></br>

        <div id="BlancDiv9">
                This site allows users to get the exchange-rate for crypto-currencies.<br> 
                This is my second project as a Full-Stack student in John Bryce Academy.
        </div>
        `
        $("#About").html(html)
    } AboutPage()
})