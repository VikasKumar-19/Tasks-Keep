let addBtn = document.querySelector('.add');
let body = document.querySelector('body');
let grid = document.querySelector('.grid');
let deleteBtn = document.querySelector('.delete')

let colors = ["pink", "green", "blue", "black"];

let deleteMode = false;       //default deleteMode value

//turn on the delete mode if deleteBtn got clicked first time and if second time then turn off the deleteMode
deleteBtn.addEventListener('click', function(ev){
    if(deleteBtn.classList.contains('delete-selected')){
        deleteBtn.classList.remove('delete-selected');
        deleteMode = false;
    }
    else{
        deleteBtn.classList.add('delete-selected');
        deleteMode = true;
    }
})



addBtn.addEventListener('click',function(){

    //if deleteBtn is selected and delete mode is on the turn off the deleteMode and deselect the deleteBtn
    deleteMode = false;
    deleteBtn.classList.remove('delete-selected');
    
    //if modal already exist then we will return else we create a modal
    let preModal = document.querySelector('.modal');

    if(preModal != null){
        return;
    }

    // creating a modal when on clicking the '+' button then it appears on the sceen by which we can create new tasks note or ticket
    let div = document.createElement('div');  // <div></div>

    div.classList.add("modal");  //giving class modal to this div <div class="modal"></div>

    // Now we add its inner components by setting it's innerHTML now complete modal will appear on the screen on clicking the button
    div.innerHTML = `   <div class="task-section">
                            <div class="task-inner-container" contenteditable="true"></div>
                        </div>
                        <div class="filters-section">
                            <div class="filters-inner-container">
                                <div class="filter-color pink"></div>
                                <div class="filter-color green"></div>
                                <div class="filter-color blue"></div>
                                <div class="filter-color black selected"></div>
                            </div>
                        </div>`

    let ticketColor = 'black';        //default selected task/ticket color

    //In this div querySelectorAll will find and give all the elements which have class filter-color.
    let allFilterColor = div.querySelectorAll('.filter-color'); 

    for(let i = 0; i < allFilterColor.length; i++){

        allFilterColor[i].addEventListener('click', function(ev){

           for(let j = 0; j < allFilterColor.length; j++){
               allFilterColor[j].classList.remove('selected');
           }

           ev.currentTarget.classList.add('selected');
           ticketColor = ev.currentTarget.classList[1];   //saving ticketcolor of the task/ticket which is yet to be created
        })
    }

    let taskInnerContainer = div.querySelector('.task-inner-container');    //selecting task-inner-container

    taskInnerContainer.addEventListener('keydown', function(ev){
        if(ev.key == 'Enter'){                  //On pressing enter ticket will be created

            let ticketDiv = document.createElement('div');
            ticketDiv.classList.add('ticket');

            //this uid function we have received from shortUniqueId() on including library. check the script tag in html
            let id = uid()         // this function generate unique ID which we have to give to a ticket. //

            //saving task info and color in ticket
            ticketDiv.innerHTML = `<div class="ticket-color ${ticketColor}"></div>          
            <div class="ticket-id">
                #${id}
            </div>
            <div class="actual-task">
                ${taskInnerContainer.innerText}
            </div>`;
            
            //when we will click a ticket if deleteMode is on then ticket must be deleted.
            ticketDiv.addEventListener('click', function(ev){
                if(deleteMode == true){
                    ev.currentTarget.remove();
                }
            })

            // on clicking color of the created tickets, event triggered to change color of tickets
            let ticketColorDiv = ticketDiv.querySelector('.ticket-color');

            ticketColorDiv.addEventListener('click', function(ev){
                let idx = -1;
                let currColor = ev.currentTarget.classList[1];
                for(let i = 0; i < colors.length; i++){
                    if(currColor == colors[i]){
                        idx = i;
                    }
                }
                idx++;
                idx = idx % 4;
                let newColor = colors[idx];
                ev.currentTarget.classList.remove(currColor)
                ev.currentTarget.classList.add(newColor);
            })

            div.remove();
            grid.append(ticketDiv);

        }
        
        //the modal will be close and ticket will not be created 
        else if(ev.key == 'Escape'){
            div.remove();
        }
    })

    body.append(div); //this will append this element in body
})

