let addBtn = document.querySelector('.add');
let body = document.querySelector('body');
let grid = document.querySelector('.grid');
let deleteBtn = document.querySelector('.delete')

let colors = ["pink", "green", "blue", "black"];

//to add filters functionality we have to add eventlistners on all the children of filters
//to extract their color class so that we can pass that color to loadTickets() function which will load the tickets with the same color.
let allFilters = document.querySelectorAll('.filter');         

for(let i = 0; i < allFilters.length; i++){
    allFilters[i].addEventListener('click', function(ev){

        //if we are clicking the second time on filter then it must remove filter-selected class and call the loadTickets() with no color.
        //if currentFilter does contain filter-selected class then we must remove it and call the loadTickets function
        //so that it can show all Tickets on UI again.
        if(ev.currentTarget.classList.contains('filter-selected')){
            ev.currentTarget.classList.remove('filter-selected');
            loadTickets();
            return;
        }

        //if we are not clicking second time on same filter means we are clicking other filter then 
        //we must remove filter-selected class from previously filter color.
        for(let j = 0; j < allFilters.length; j++){
            allFilters[j].classList.remove('filter-selected');
        }

        //after removing that class from every filter color, we will give the filter-selected class to current selected element.
        ev.currentTarget.classList.add('filter-selected');

        let filterColor = ev.currentTarget.querySelector('div').classList[0];

        //we call loadTickets() function passing the current filter color which will show the tickets with same color on UI.
        loadTickets(filterColor);
    })
}

//if we have first time started this app in browser then allTickets object is not created.
//so we have to create it if it is undefined.
if(localStorage.getItem("allTickets") == undefined){
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);
    localStorage.setItem("allTickets", allTickets);
}

//this loadTickets() function will be called every time when the app starts 
//so that the tickets which are stored in allTickets object will be shown ON UI or DOM.
loadTickets(); 

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


            let ticketDiv = document.createElement('div');  //creating ticket div on pressing the enter
            ticketDiv.classList.add('ticket');              //setting the class ticket for styling
            ticketDiv.setAttribute('dataId', id);           //giving unique id we have generated


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
            
            //we are adding event listeners for created ticket now
            // on clicking color of the created tickets, event triggered to change color of tickets
            let ticketColorDiv = ticketDiv.querySelector('.ticket-color');  //this will select the ticketcolordiv

            //on editing the task, the localStorageData in which we have stored taskValue shall also get updated 
            let actualTaskDiv = ticketDiv.querySelector('.actual-task');    //this will select the ticket's actualTask area

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


//loadTickets function to show the tickes on DOM when we refresh the webpage or reopen it.
function loadTickets(color){

    //it will select all tickets on UI 
    //but first time on starting the UI when it is called it will not find any ticket on UI and list become empty
    let ticketsOnUi = document.querySelectorAll(".ticket");   

    //we are removing tickets so that we can apply filter
    //but it will also run when the loadTickets() when no color is passed on deselecting filter.
    //so it will remove all the tickets which are shown on UI and then it will create all tickets depending on color passed again 
    //and then it will show them On UI
    for(let i = 0; i < ticketsOnUi.length; i++){ 
        ticketsOnUi[i].remove();   //removing every ticket on UI first time which will appear 
    }

    //Step 1 first fetch allTickets object.
    let allTickets = JSON.parse(localStorage.getItem("allTickets"));

    //Step 2 create UI for each ticket object

    //we are loopin on allTickets object and get each and every ticket object one by one.
    for(key in allTickets){

        let currentTicketId = key;   //get the ticket id
        let singleTicketObj = allTickets[key]; //get the object

        //condition checking if color is passed then it will display only those tickets with same color 
        //and if not passed then it will show all tickets which are stored in allTickets object.
        if(color && color != singleTicketObj.color){               
            continue;
        }

        let ticketDiv = document.createElement('div');
        ticketDiv.classList.add('ticket');
        ticketDiv.setAttribute('dataId', currentTicketId);   //for deleting this ticket we have set dataId as attribute

        //creating UI 
        //we are also saving dataId in both ticket-color and actual-task because when we change them we need to save in localStorage.
        ticketDiv.innerHTML = `<div class="ticket-color ${singleTicketObj.color}"  dataId="${currentTicketId}" ></div>          
        <div class="ticket-id">
            #${currentTicketId}
        </div>
        <div class="actual-task" dataId="${currentTicketId}" contenteditable="true">
            ${singleTicketObj.taskValue}
        </div>`;

        //attaching required eventListeners to each ticket object
        //we are adding event listeners for created ticket now
        // on clicking color of the created tickets, event triggered to change color of tickets
        let ticketColorDiv = ticketDiv.querySelector('.ticket-color');  //this will select the ticketcolordiv

        //on editing the task, the localStorageData in which we have stored taskValue shall also get updated 
        let actualTaskDiv = ticketDiv.querySelector('.actual-task');    //this will select the ticket's actualTask area

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

        //adding the eventListener for deleting the ticket.
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

        //add tickets in the grid section of DOM
        grid.append(ticketDiv);
    }

}