let url = window.location.pathname;
// upis json fajla u local storage

window.onload = function(){
    ajaxCallback("books",function(result){
        toLocalStorage("books",result);
    });
    print(getFromLocalStorage("books"));
};
function toLocalStorage(name, data){
    localStorage.setItem(name, JSON.stringify(data));
};
function getFromLocalStorage(name){
    let item = localStorage.getItem(name);
    if(item){
        parsedItem = JSON.parse(item);
        if(parsedItem.length > 0){
            return parsedItem;
        }
    }
    return false;
};
function ajaxCallback(file, result){
    $.ajax({
        url: "assets/data/" + file + ".json",
        method: "GET",
        dataType:"json",
        success: result,
        error:function(er){
            console.log(er);
        }
    });
}

var page = document.getElementById("row");
function print(data){
    let brojac = 1;
    let cb1 = document.getElementById("featured");
    let html = `<div class="card-deck">`;
    console.log(data);
    data = allBooks(data);
    data = latestBooks(data);
    data = featuredBooks(data);
    data = hotBooks(data);
    
    data.forEach(book => {

        html +=`<div class="card">
                    <div class="px-0">
                    <img src="${book.img.src}" class="img-fluid" alt="${book.img.alt}">
                    </div>
                    <div class="card-body">
                        <div class="p-3">
                            <h4>${book.name}</h4>
                            <p class="price h3">${book.price.new}$ <s>${book.price.old}$</s></p>
                            <p class="free">${book.shipping}</p>
                            <a id="buyButton" class="btn btn-primary">Add to Cart</a>
                        </div>
                    </div>
                </div>`
        
        if(brojac ==3) {
            html += `</div><div class="card-deck">`;
            brojac = 1;
        }
        else brojac++;
        
    });
    html +=`</div>`
    page.innerHTML += html;
};


function latestBooks(books){
    let latest = [];
    latest = books.filter(book => book.latest == 1);
    if(url=="/index.html"){
        return latest;
    }
    else return books;
}

function allBooks(books){
    let latest = [];
    latest = books;
    if(url=="/books.html"){
        return latest;
    }
    else return books;
}

function featuredBooks(books){
    let featured = [];
    $('.featured:checked').each(function(e){
        featured.push(parseInt($(this).val()));
    });
    if(url=="/books.html" && featured.length > 0) {
        return books.filter(book => book.featured == 1);
    }
    else return books;
    
}
function hotBooks(books){
    let hot = [];
    let cb = document.getElementById("hot");
    hot = books.filter(book => book.hot == 1);
    if(url=="/books.html" && cb.checked) {
        return hot
    }
    else return books;
}

$("#loaderbg").animate({
    'opacity': '0'
}, 1400, function(){
    setTimeout(function(){
        $("#loaderbg").css("visibility", "hidden").fadeOut();
    }, 300);
});
