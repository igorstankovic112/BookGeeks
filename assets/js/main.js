let url = window.location.pathname;


// upis json fajla u local storage
window.onload = function(){
    ajaxCallback("books",function(result){
        toLocalStorage("books",result);
    });
    var everyBook = getFromLocalStorage("books");
    if(checkBookHtml() || checkIndexHtml())print(everyBook);
    if(checkShop()){
        printShop(getFromLocalStorage("cart"));
    }
};
$("#loaderbg").animate({
    'opacity': '0'
}, 1400, function(){
    setTimeout(function(){
        $("#loaderbg").css("visibility", "hidden").fadeOut();
    }, 300);
});
function checkShop(){
    if(url=="/shop.html" || url=="/BookGeeks/shop.html") return true;
}
function checkBookHtml(){
    if(url=="/books.html" || url=="/BookGeeks/books.html") return true;
};

function checkIndexHtml(){
    if(url=="/index.html" || url=="/BookGeeks/index.html" || url=="/BookGeeks/") return true;
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
        error: function(jqXHR, exception){
            // console.log(jqXHR);
            var msg = '';
            if (jqXHR.status === 0) {
            msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
            msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
            msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
            msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
            msg = 'Time out error.';
            } else if (exception === 'abort') {
            msg = 'Ajax request aborted.';
            } else {
            msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        }
    });
}

//pagination



var numOfBooks = 0;
var page = document.getElementById("row");
function print(data){
    //console.log(data);
    data = latestBooks(data);
    if(checkBookHtml()) data = hotBooks(data);
    data = allBooks(data);
    if(checkBookHtml()) data = authorFilter(data);
    if(checkBookHtml()) data = featuredBooks(data);
    if(checkBookHtml()) data = newBooks(data);
    if(checkBookHtml()) data = sortiranje(data);
    if(checkBookHtml()) data = freeShip(data);
    var picture = [];
    let brojac = 1;
    let html = `<div class="card-deck">`;
    data.forEach(book => {
        
        numOfBooks++;

        html +=`<div class="card" onclick="createModal(${book.id})">
                    <div class="px-0">
                    <button  data-toggle="modal" data-target="#modal" class="bookPics"><img src="${book.img.src}" class="img-fluid picsBut" alt="${book.img.alt}"></button>
                    </div>
                    <div class="card-body">
                        <div class="p-3">
                            <h4>${book.name}</h4>
                            <p class="free">First publish in: ${book.year}.</p>
                            <p class="price h3">${book.price.new}$ <s>${book.price.old}$</s></p>
                            <p class="free">${book.shipping}</p>
                            
                        </div>
                    </div>
                </div>`
        
        if(brojac ==3) {
            html += `</div><div class="card-deck">`;
            brojac = 1;
        }
        else brojac++;

        
        
}

);
    
    
    console.log(numOfBooks);
    html +=`</div>`
    
    page.innerHTML = html;
    
};



//shop cart
if(!getFromLocalStorage("cart")){
var cartNow = [];
cartNow.push({
    id: 0,
    name: "Name",
    img:{
        src:"assets/images/Blank.jpg"
    }
    ,
    price:{
        new:"Price in "
    },
    quantity: "Quantity"
  });

toLocalStorage("cart",cartNow);
}
console.log(getFromLocalStorage("cart"));
var emptyCart = document.getElementById("emptyCart")
function printShop(books){
    var removeButttons = [];
    let html = "";
    let shopBooks = [];
    shopBooks = books;
    let brojac = 1;
    shopBooks.forEach(book =>{

       
        if(brojac == 1){
            html += `<thead>
            <tr>
              <th scope="col">Book</th>
              <th scope="col">${book.name}</th>
              <th scope="col">${book.quantity}</th>
              <th scope="col">${book.price.new}</th>
            </tr>
          </thead>
          `;
          emptyCart.innerHTML = "<h2>Your shopping cart is empty!</h2>"
          brojac++;
        }
        else {
            let empty = document.getElementById("emptyCart")
            empty.classList.add("hidden")
        html += 
            `<tbody id="checkoutTable">
                <tr class="shopRow">
                <td class="shop-image">
                    <a href="#">
                        <img src="${book.img.src}" class="img-fluid shopPic" alt="article img">
                    </a>
                </td>
                <td class="shop">${book.name}</td>
                <td class="shop">1
                </td>

                <td class="shop">${book.price.new}$</td>
                <td class="shop"><a id="removeButton" data-id="${book.id}" class="btn btn-primary">Remove</a></td>
                <div >
                    
                </div>
                </td>
                </tr>
            </tbody>
         `
         
         removeButttons += document.getElementById("removeButton");}
    })
    /*html += `<tbody id="checkoutTable">

    <tr class="shopRow">
    <td class="shop">
        
    </td>
    <td class="shop"></td>
    <td class="shop">
    </td>

    <td class="shop">$</td>
    <td class="shop"><a id="removeButton" class="btn btn-primary">Remove All</a></td>
    <div >
        
    </div>
    </td>
    </tr>
</tbody>`*/

console.log(removeButttons)



document.getElementById("table").innerHTML = html;
}

function removeFromCart(id){
    let row = getFromLocalStorage("cart");
    for(let i = 0; i < row.length; i++){
        if(row[i].id == id){
            row.splice(i, 1);
            localStorage.setItem("cart", JSON.stringify(row));
            printShop(books);
        }
    }
}

//modal
function createModal(id){
    let modalbooks = getFromLocalStorage("books");
    let html = "";
    console.log(id);
    var currentBook = [];
    for(book of modalbooks){
        if(book.id == id){
            html = `<div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div class="modal-content" id="modals">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalCenterTitle">Buy a Book</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="card card-modal">
                                    <div class="px-0 modalPic">
                                        <button data-toggle="modal" data-target="#modal" class="bookPics"><img src="${book.img.src}" class="img-fluid modalPic" alt="${book.img.alt}"></button>
                                    </div>
                                    <div class="card-body modal-bod">
                                        <div class="p-3">
                                            <h4>${book.name}</h4>
                                            <p><p class="bold">Description:</p> ${book.description}</p>
                                            <p class="price h3">${book.price.new}$ <s>${book.price.old}$</s></p>
                                            <p><p class="bold">Stock:</p> ${book.stock}</p>
                                            <p class="free">${book.shipping}</p>
                                            <a id="buyButton" class="btn btn-primary">Add to Cart</a>
                                            </br>
                                            <span id="dodato" class="p-3 hidden">Added to the cart!</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>`
        currentBook = book;
        console.log(currentBook);
        }
    }
    document.getElementById("modal").innerHTML = html;
    var buyButton = document.getElementById("buyButton");
    var bought = document.getElementById("dodato");
    buyButton.addEventListener("click",function(){
        bought.classList.remove("hidden")
        $(bought).fadeIn(500, function(){
            setTimeout(()=>{$('#dodato').fadeOut(500)},2000);
        });
        cart(currentBook);
        
        console.log(JSON.parse(localStorage.getItem("cart")))
    })
}
function cart(books){
    let booksrow = [];
    booksrow = books;
    
    cartNow = JSON.parse(localStorage.getItem("cart"));
    //console.log(getFromLocalStorage("cart"));
    
    cartNow.push(booksrow);
    toLocalStorage("cart",cartNow);
    
    //console.log(JSON.parse(localStorage.getItem("cart")));
}

//filter for index.html
function latestBooks(books){
    let latest = [];
    latest = books.filter(book => book.latest == 1);
    if(checkIndexHtml()){
        console.log(latest);
        return latest;
    }
    else return books;
}
//filter for book.html
function allBooks(books){
    let latest = [];
    latest = books;
    if(checkBookHtml()){
        return latest;
    }
    else return books;
};

//checkboxes and ddl
let form = document.getElementById("form");
let categoryList = ["All books","Hot","Featured","New"]
let authorList = ["Choose author","J.R.R. Tolkien","George R.R. Martin"]
let sortByList = ["SORT BY", "Lowest Price", "Highest Price","Year Published"];

function ddl(list, id){
    let html = "";

    html = `<select id="${id}" class="ddl">`;

    for (let i = 0; i < list.length; i++){
        html += 
        `
            <option value="${i}">${list[i]}</option>
        `;
    }

    html += `</select>`;

    return html;
}
function cb(value,id){
    let html ="";
    html += `<label for="${id}" id="label">${value}</label>
            <input type="checkbox" name="cb1" id="${id}" class="${id}" value="1">`
    return html;
}
if(checkBookHtml()) form.innerHTML += ddl(categoryList, "category");
if(checkBookHtml()) form.innerHTML += ddl(authorList, "author");
if(checkBookHtml()) form.innerHTML += ddl(sortByList, "sort");
if(checkBookHtml()) form.innerHTML += cb("Free-shipping", "cb1");
if(checkBookHtml()) form.innerHTML += cb("In stock", "cb2");


//sorting
if(checkBookHtml()){
    let sortSelected = document.getElementById("sort");
    var sortValue = sortSelected.value;
    sortSelected.addEventListener("change",function(){
        sortValue = sortSelected.value;
        console.log(sortValue);
        print(getFromLocalStorage("books"));
    })
}
function sortiranje(books){
    let sorted = [];
    let sortedValue = sortValue;
    switch(sortedValue){
        default:    sorted = books;
                    return books;
        case "1":   sorted = books.sort(function(a, b){
                        let cena1 = a.price.new;
                        let cena2 = b.price.new;
                        return cena1 - cena2;
                    });
                    return sorted;
        case "2":   sorted = books.sort(function(a, b){
                        let cena1 = a.price.new;
                        let cena2 = b.price.new;
                        return cena2 - cena1;
                    });
                    return sorted;
        case "3":   sorted = books.sort(function(a, b){
                        let year1 = new Date(a.year);
                        let year2 = new Date(b.year);
                        return new Date(a.year) - new Date(b.year);
                    });
                    return sorted;
    }
}
//free shipping filter
if(checkBookHtml()){
   let checkBox1 = document.getElementById("cb1");
   var valueCb1 = checkBox1.value;
   checkBox1.addEventListener("change",function(){
        valueCb1 = checkBox1.value;
        print(getFromLocalStorage("books"));
    })
}
function freeShip(books){
    let shiping = [];
    shiping = books.filter(book => book.shipping == "Free shipping");
    let checkBox1 = document.getElementById("cb1");
    if(checkBox1.checked){
        return shiping;
    }
    else return books;
}



//category filter
if(checkBookHtml()){
    let selectedCategory = document.getElementById("category");
    var valueOfselectedCategory = selectedCategory.value;
    console.log(valueOfselectedCategory);

    selectedCategory.addEventListener("change", function(){
    valueOfselectedCategory = selectedCategory.value;
    console.log(valueOfselectedCategory);
    print(getFromLocalStorage("books"));
    })
};    
function hotBooks(books){
    let hot = [];
    hot = books.filter(book => book.hot == 1);
    if (valueOfselectedCategory == 1){
        
        console.log(hot);
        return hot;
    }
    else return books;
    
}
function featuredBooks(books){
    let featured = [];
    featured = books.filter(book => book.featured == 1);
    if (valueOfselectedCategory == 2){
        
        console.log(featured);
        return featured;
    }
    else return books;
    
}
function newBooks(books){
    let newBooks = [];
    newBooks = books.filter(book => book.new == 1);
    if (valueOfselectedCategory == 3){
        
        console.log(newBooks);
        return newBooks;
    }
    else return books;
    
}
//author filter
if(checkBookHtml()){
    let selectedAuthor = document.getElementById("author");
    var valueOfselectedAuthor = selectedAuthor.value;
    var textAuthor = selectedAuthor.options[selectedAuthor.selectedIndex].text
    console.log(textAuthor);
    console.log(valueOfselectedAuthor);

    selectedAuthor.addEventListener("change", function(){
    valueOfselectedAuthor = selectedAuthor.value;
    textAuthor = selectedAuthor.options[selectedAuthor.selectedIndex].text
    console.log(valueOfselectedAuthor);
    console.log(textAuthor);
    print(getFromLocalStorage("books"));
    })
}; 
function authorFilter(books){
    let authors = [];
    authors = books.filter(author => author.author == textAuthor);
    console.log(authors);
    if (valueOfselectedAuthor == 0){
        authors = books;
    }
    return authors;
}

//form
if(checkIndexHtml()){
let regexName = /^[A-ZČĆŠĐŽ][a-zčćšđž]{2,15}(\s[A-ZČĆŠĐŽ][a-zčćšđž]{2,15})?(\s[A-ZČĆŠĐŽ][a-zčćšđž]{2,20})\s*$/;
let textName = document.getElementById('name');
fieldName = document.getElementById('nameErorr');
textName.addEventListener('blur', checkName);
function checkName() {
    let name = textName.value;
    name.replace(/\s\s+/g, ' ');
    if (!regexName.test(name)) {
        fieldName = document.getElementById('nameErorr');
        if (name == "" || !name.trim()) {
            fieldName.innerHTML = "You didn't fill out your name!";
        }
        else {
            fieldName.innerHTML = "You've entered name in the wrong format! (example: Michael Scott)";
        }
        fieldName.classList.remove('hide');
        return false;
    }
    if (regexName.test(name)) {
        let fieldName = document.getElementById('nameErorr');
        fieldName.classList.add('hide');
        return true;
    }
}

let regexMail = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/;

let textEmail = document.getElementById('email');
textEmail.addEventListener('blur', checkEmail);
function checkEmail() {
    let email = textEmail.value;
    if (!regexMail.test(email)) {
        let fieldEmail = document.getElementById('mailErorr');
        if (email == "" || !email.trim())
            fieldEmail.innerHTML = "You didn't fill out your email!";
        else
            fieldEmail.innerHTML = "Email is in wrong format! (example: michael@gmail.com)";

        fieldEmail.classList.remove('hide');
        return false;
    }
    if (regexMail.test(email)) {
        let fieldEmail = document.getElementById('mailErorr');
        fieldEmail.classList.add('hide');
        return true;
    }
}

let forma = document.getElementById("form-submit");
forma.addEventListener("click", function(){
    let text = document.getElementById("message").value;
    let ime = checkName();
    let mail = checkEmail();
    let r1 = document.getElementById("firstRadio");
    let r2 = document.getElementById("secondRadio");
    let cb1 = document.getElementById("cb1");
    console.log(cb1);
    let cb2 = document.getElementById("cb2");
    let cb3 = document.getElementById("cb3");
    let cb4 = document.getElementById("cb4");
    
    if(r1.checked || r2.checked){
        document.getElementById("radioError").classList.add("hide");
    }
    else{
        document.getElementById("radioError").classList.remove("hide");
    }
    if (text == "") {
        document.getElementById("textError").classList.remove("hide");
        document.getElementById("sentForm").classList.add("hide");
    }
    if (text != "") {
        document.getElementById("textError").classList.add("hide");

    }
    if(cb1.checked || cb2.checked || cb3.checked || cb4.checked){
        document.getElementById("tbError").classList.add("hide");
    }
    else{
        document.getElementById("tbError").classList.remove("hide");
    }
    if (text != "" && checkEmail() && checkName() && (r1.checked || r2.checked) && (cb1.checked || cb2.checked || cb3.checked || cb4.checked)) {
        document.getElementById("sentForm").classList.remove("hide");
        document.getElementById("contact").reset();
    }
    else {
        document.getElementById("sentForm").classList.add("hide");
    }
});

let portfolio = document.getElementsByClassName("portfolio");
console.log(portfolio)
for (let i = 0; i < portfolio.length; i++) {
    portfolio[i].addEventListener("mouseover", () => {
        portfolio[i].classList.add("effect");
    });
}
for (let i = 0; i < portfolio.length; i++) {
    portfolio[i].addEventListener("mouseout", () => {
        portfolio[i].classList.remove("effect");
    });
}
};

