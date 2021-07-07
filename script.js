let addBtn = document.querySelector('.add');
let body = document.querySelector('body');
let grid = document.querySelector('.grid');
let deleteBtn = document.querySelector('.delete')

let colors = ["pink", "green", "blue", "black"];

if(localStorage.getItem("allTickets") == undefined){
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);
    localStorage.setItem("allTickets", allTickets);
}

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

            //this uid function we have received from shortUniqueId() on including library. check the script tag in html
            let id = uid()         // this function generate unique ID which we have to give to a ticket. //
            
            let task = ev.currentTarget.innerText; // the task which we want to save in a ticket.

            //step 1: jobhi data hai localStorage use lekar aao
            let allTickets = JSON.parse(localStorage.getItem("allTickets"));

            //step 2: usko update karo
            let ticketObj = {
                color: ticketColor,
                taskValue: task
            }

            allTickets[id] = ticketObj;

            //step 3: wapis updated object ko localStorage me save kardo
            localStorage.setItem("allTickets", JSON.stringify(allTickets));


            let ticketDiv = document.createElement('div');
            ticketDiv.classList.add('ticket');
            ticketDiv.setAttribute('dataId', id);


            //saving task info and color in ticket
            //we are also saving dataId in both ticket-color and actual-task because when we change them we need to save in localStorage.
            ticketDiv.innerHTML = `<div class="ticket-color ${ticketColor}"  dataId="${id}" ></div>          
            <div class="ticket-id">
                #${id}
            </div>
            <div class="actual-task" dataId="${id}" contenteditable="true">
                ${task}
            </div>`;
            
            //when we will click a ticket if deleteMode is on then ticket must be deleted.
            ticketDiv.addEventListener('click', function(ev){
                
                if(deleteMode == true){

                    //for saving in local storage also we have to do again those 3 steps
                    //step 1: jobhi data hai localStorage use lekar aao
                    let allTickets = JSON.parse(localStorage.getItem("allTickets"));

                    //step 2: usko update karo
                    let thisTicketId = ev.currentTarget.getAttribute("dataId"); //here we get id by this dataId attribute.
                    
                    delete allTickets[thisTicketId];   //deleting this ticket using it's ID

                    //step 3: wapis updated object ko localStorage me save kardo
                    localStorage.setItem("allTickets", JSON.stringify(allTickets));

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

                //for saving in local storage also we have to do again those 3 steps
                //step 1: jobhi data hai localStorage use lekar aao
                let allTickets = JSON.parse(localStorage.getItem("allTickets"));

                //step 2: usko update karo
                let thisTicketId = ev.currentTarget.getAttribute("dataId"); //here we get id by this dataId attribute.
                
                allTickets[thisTicketId].color = newColor;

                //step 3: wapis updated object ko localStorage me save kardo
                localStorage.setItem("allTickets", JSON.stringify(allTickets));
            })

            let actualTaskDiv = ticketDiv.querySelector('.actual-task');

            actualTaskDiv.addEventListener('input', function(ev){        //input event will triggered when you type something
               let updatedTask = ev.currentTarget.innerText; //this will give updated task value which we have to save in localStorage.

               //step 1: jobhi data hai localStorage use lekar aao
               let allTickets = JSON.parse(localStorage.getItem("allTickets"));
                
               //step 2: usko update karo
               let thisTicketId = ev.currentTarget.getAttribute("dataId"); //here we get id by this dataId attribute.
               allTickets[thisTicketId].taskValue = updatedTask;

                // step 3: wapis updated object ko localStorage me save kardo
                localStorage.setItem("allTickets", JSON.stringify(allTickets));
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

