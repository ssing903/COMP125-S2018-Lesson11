// core module - IIFE
(function() {
  // App variables
  let XHR;
  let hash;
  let addressBook;
  let Contacts;


  function insertHTML(sourceURL, destTag) {
    let target = document.getElementsByTagName(destTag)[0];
    XHR = new XMLHttpRequest();
    XHR.addEventListener("readystatechange", function(){
      if(this.status === 200) {
        if(this.readyState === 4)  {
          target.innerHTML = this.responseText;
          setActiveNavLink();
		  if(document.title == "Contact")
		  {
			  loadJSON();
		  }
        }
      }
    });
    XHR.open("GET", sourceURL);
    XHR.send();
  }

  

  function loadJSON() {
    XHR = new XMLHttpRequest();
    XHR.addEventListener("readystatechange", function(){
      if(this.status === 200) {
        if(this.readyState === 4)  {
          addressBook = JSON.parse(this.responseText);
		  console.log("Data finish loading");
		  createContacts();
		  displayData();
        }
      }
    });
    XHR.open("GET", "/data.json");
    XHR.send();

  }

	function createContacts()
	{
		addressBook.Contacts.forEach(contact => {
        let newContact = new objects.Contact(
          contact.id,contact.name, contact.number, contact.email);
			Contacts.push(newContact);
		});
	}
	
  function displayData()
  {
     let tbody = document.querySelector("tbody");
	 tbody.innerHTML  = "";
     //let counter = 0;
       Contacts.forEach(contact => {
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.setAttribute("scope", "row");
        th.textContent = contact.id;
        tr.appendChild(th);
		
		// loop through each property of contact object
		// then add property to the column
		for(const property in contact)
		{
			if(contact.hasOwnProperty(property)){
				//console.log(property);
				if(property!="id"){
				  let td = document.createElement("td");
				  td.textContent = contact[property];
				  tr.appendChild(td);
				}
			}
		}
		 
		let editTd = document.createElement("td");
		let editButton = document.createElement("button");
		editButton.setAttribute("class","btn btn-danger btn-sm");
		editButton.setAttribute("data-id",contact.id);	
		editButton.innerHTML = "<i class='fa fa-edit fa-lg'></i> Edit";
		editTd.appendChild(editButton);
		tr.appendChild(editTd);
		editButton.addEventListener("click",(event)=>{
			console.log(`Click Editin : ${event.currentTarget.getAttribute("data-id")}`);
		});
		
		let deleteTd = document.createElement("td");
		let deleteButton = document.createElement("button");
		deleteButton.setAttribute("class","btn btn-primary btn-sm");
		deleteButton.setAttribute("data-id",contact.id);
		deleteButton.innerHTML = "<i class='fa fa-trash fa-lg'></i> Delte";
		deleteTd.appendChild(deleteButton);
		tr.appendChild(deleteTd);
	    deleteButton.addEventListener("click",(event)=>{
			let id = event.currentTarget.getAttribute("data-id");
			//console.log(`Deleting : ${id}`);
			
		/*	Contacts.forEach(contact=>{
				if(contact.id == id)
				{
					Contacts.splice(Contacts.indexOf(contact),1);
				}
      });*/
      

     let contactToDelete =  Contacts.find(function(contact){
          return contact.id = id;
      });

      Contacts.splice(Contacts.indexOf(contactToDelete),1);
			
			console.log(Contacts);
			displayData();
		});
		tbody.appendChild(tr);
        //counter++;
      });
  }


  /**
   * This function is used for Intialization
   */
  function Start() {
    console.log(
      `%c App Initializing...`,
      "font-weight: bold; font-size: 20px;"
    );

    Contacts = [];

    Main();
  }

  /**
   * This function is the where the main functionality for our
   * web app is happening
   */
  function Main() {
    console.log(`%c App Started...`, "font-weight: bold; font-size: 20px;");
    
    insertHTML("/Views/partials/header.html", "header");

    setPageContent("/Views/content/home.html");

    insertHTML("/Views/partials/footer.html", "footer");
    
  }

  function setPageContent(url) {
    insertHTML(url, "main");
  }

  function Route() {
    // sanitize the url - remove the #
    hash = location.hash.slice(1);

    document.title = hash;

    // change the URL of my page
    history.pushState("", document.title, "/" + hash.toLowerCase() + "/");

    setPageContent("/Views/content/" + hash.toLowerCase() + ".html")
  }

  function setActiveNavLink() {
    // clears the "active" class from each of the list items in the navigation
    document.querySelectorAll("li.nav-item").forEach(function(listItem){
      listItem.setAttribute("class", "nav-item");
    });

    // add the "active" class to the class attribute of the appropriate list item
    document.getElementById(document.title).classList.add("active");


  }

  window.addEventListener("load", Start);

  window.addEventListener("hashchange", Route);
})();
