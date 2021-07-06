let addBtn = document.querySelector('.add');
let body = document.querySelector('body');


addBtn.addEventListener('click',function(){

    // creating a modal when on clicking the '+' button then it appears on the sceen by which we can create new tasks note or ticket
    let div = document.createElement('div');

    div.classList.add("modal");  //giving class modal to this div
    body.append(div); //this will append this element in body

    
})