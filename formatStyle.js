let tools = document.querySelectorAll(".format-tools button");

for(let i = 0; i < tools.length; i++){
    tools[i].addEventListener("click", function(ev){
        if(ev.currentTarget.classList.contains("bold")){
            document.execCommand("bold", false, null);
        }
        else if(ev.currentTarget.classList.contains("italic")){
            document.execCommand("italic", false, null);
        }
        else if(ev.currentTarget.classList.contains("underline")){
            document.execCommand("underline", false, null);
        }
        else{
           document.execCommand("strikeThrough", false, null);
        }
    })
}