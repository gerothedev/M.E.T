// Code to verify service worker

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered", res))
      .catch(err => console.log("service worker not registered", err))
  })
}

// Code for displaying navbar

var width_limit = 769;
var windowWidth = window.innerWidth;

if (window.innerWidth >= width_limit)
{

  document.querySelector('.main-nav').style.display = "flex";
  document.querySelector('.hamburgerwrap').style.display = "none";

}
else if (window.innerWidth < width_limit)
{

  document.querySelector('.main-nav').style.display = "none";
  document.querySelector('.hamburgerwrap').style.display = "block";

}

window.addEventListener('resize', function (e) {

  if (window.innerWidth >= width_limit)
  {

    document.querySelector('.main-nav').style.display = "flex";
    document.querySelector('.hamburgerwrap').style.display = "none";

  }
  else if (window.innerWidth < width_limit)
  {

    document.querySelector('.main-nav').style.display = "none";
    document.querySelector('.hamburgerwrap').style.display = "block";

  }

});

document.addEventListener('click', function(e){   

  if (window.innerWidth < width_limit)
  {
    if (document.querySelector('.main-nav').style.display == "flex")
    {
      if (!(document.querySelector('.main-nav').contains(e.target)))
      {
        document.querySelector(".main-nav").style.display = "none"
        document.querySelector(".hamburgerwrap").style.display = "block"
      }
    }
    else if (document.querySelector('.main-nav').style.display == "none")
    {
      if (document.querySelector('.hamburgerwrap').contains(e.target))
      {
        document.querySelector(".main-nav").style.display = "flex"
        document.querySelector(".hamburgerwrap").style.display = "none"
      }
    }
  }

});

// Code for table pagination

if (document.querySelector(".tboundary") && (!(document.querySelector(".statusgrid"))))
{
  var tablenav = document.querySelector(".pages");

  // Assign table to a variable
  var table = document.getElementById("tables");

  // Amount of rows per page
  var rowperpage = 20;

  // Total amount of rows in table
  var rowCount = table.rows.length;

  // Check table has head row returning boolean value
  var tableHead = table.rows[0].firstElementChild.tagName === "th";

  // Array to hold each row of table
  var showrow = document.querySelectorAll(".showrow")

  // Start counting rows from the second row if there is a header row
  var i,ii,j = (tableHead) ? 1 : 0;

  // Holds first row of table if first row is table head
  var th = (tableHead ? table.rows[0].outerHTML : "");

  // Determine page count
  var pageCount = Math.ceil(table.rows.length / rowperpage);


  if (pageCount > 1) 
  {

    tablenav.insertAdjacentHTML("afterbegin","<ul class='navpages'></ul>");
    sort(1);
      
  }

  function sort(page) 
  {
    var rows = th, s = ((rowperpage * page) - rowperpage);

    for (i = 0; i < showrow.length; i++)
    {
    
      showrow[i].style.display = "none";
    
    }

    for (i = s; i < (s + rowperpage) && i < showrow.length; i++)
    {
      showrow[i].style.display = "table-row";
    }

    document.querySelector(".navpages").innerHTML = pageButtons(pageCount, page);
  }

  function pageButtons(pageCount,current) 
  {

    var prevButton = (current == 1) ? "disabled" : "";
    var currbutton = (current == current) ? "disabled" : "";
    var nextButton = (current == pageCount) ? "disabled" : "";
    var buttons = "<li><button class='previous' value='Previous' onclick='sort("+(current - 1)+")' "+ prevButton +">Previous</button></li>";
    
    if (current % 3 == 1 )
    {
      buttons += "<li><button onclick='sort("+(current)+")' "+ currbutton +">"+ current +"</button></li>";
      
      if (!(current + 1 > pageCount)) 
      {
      buttons += "<li><button onclick='sort("+(current + 1)+")'>"+ (current + 1) +"</button></li>";
      }
      if (!(current + 2 > pageCount)) 
      {
      buttons += "<li><button onclick='sort("+(current + 2)+")'>"+ (current + 2) +"</button></li>";
      }
    }
    else if (current % 3 == 2 )
    {
      buttons += "<li><button onclick='sort("+(current - 1)+")'>"+ (current - 1) +"</button></li>";
      buttons += "<li><button onclick='sort("+(current)+")' "+ currbutton +">"+ current +"</button></li>";
      
      if (!(current + 2 > pageCount)) 
      {
      buttons += "<li><button onclick='sort("+(current + 1)+")'>"+ (current + 1) +"</button></li>";
      }
    }
    else if (current % 3 == 0 )
    {
      buttons += "<li><button onclick='sort("+(current - 2)+")'>"+ (current - 2) +"</button></li>";
      buttons += "<li><button onclick='sort("+(current - 1)+")'>"+ (current - 1) +"</button></li>";
      buttons += "<li><button onclick='sort("+(current)+")' "+ currbutton +">"+ current +"</button></li>";
    }

    buttons += "<li><button class='next' value='Next' onclick='sort("+(current + 1)+")' "+ nextButton +">Next</button></li>";
    return buttons;

  } 
}

// Code to match rooms to corresponding department

if (document.getElementById("dselect"))
{

  document.querySelector("#dselect").value = "Department"
  document.getElementById("rselect").disabled = true
  
  document.querySelector("#dselect").addEventListener('change', function(e) { 
  
    var depts = document.getElementById("dselect").getElementsByTagName("option");
    var rooms = document.getElementById("rselect").getElementsByTagName("option");
    var deptSelect = document.getElementById("dselect");
    var roomSelect = document.getElementById("rselect");
    roomSelect.value = "Room";

    for (let i = 0; i < depts.length; i++)
    {
      if (depts[i].innerHTML == deptSelect.value)
      {
        for (let j = 0; j < rooms.length; j++)
        {
          if (rooms[j].className != depts[i].className)
          {
            rooms[j].style.display = "none"
          }
          else
          {
            rooms[j].style.display = "block"
            roomSelect.disabled = false
          }
        }
      }
    }
  
  });
}

if (document.getElementById("edit-dselect"))
{

  document.querySelector("#edit-dselect").value = "Department"
  document.getElementById("edit-rselect").disabled = true
  document.getElementById("edit-rselect").insertAdjacentHTML("afterend", "<input type='hidden' name='edit-field' value='Room'>")

  document.querySelector("#edit-dselect").addEventListener('change', function(e) {  

    var depts = document.getElementById("edit-dselect").getElementsByTagName("option");
    var rooms = document.getElementById("edit-rselect").getElementsByTagName("option");
    var deptSelect = document.getElementById("edit-dselect");
    var roomSelect = document.getElementById("edit-rselect");
    roomSelect.value = "Room";
    
    for (let i = 0; i < depts.length; i++)
    {
      if (depts[i].innerHTML == deptSelect.value)
      {
        for (let j = 0; j < rooms.length; j++)
        {
          if (rooms[j].className != depts[i].className)
          {
            rooms[j].style.display = "none"
          }
          else
          {
            rooms[j].style.display = "block"
            roomSelect.disabled = false
            document.getElementById("edit-rselect").removeChild(document.getElementById("edit-rselect").lastElementChild)
          }
        }
      }
    }

  });

}

// Code to change input fields in search

if (document.querySelector("#fieldname"))
{
  document.querySelector("#search").style.display = "inline-block"
  document.querySelector("#statuses").style.display = "none"
  document.querySelector("#dselect").style.display = "none"
  document.querySelector("#rselect").style.display = "none"
  document.querySelector("#off-site").style.display = "none"
  document.querySelector("#sfn").style.display = "none"
  document.querySelector("#sln").style.display = "none"
  document.querySelector("#rfn").style.display = "none"
  document.querySelector("#rln").style.display = "none"
  document.querySelector("#action").style.display = "none"
  document.querySelector("#date").style.display = "none"

  document.querySelector("#search").disabled = false
  document.querySelector("#statuses").disabled = true
  document.querySelector("#dselect").disabled = true
  document.querySelector("#rselect").disabled = true
  document.querySelector("#rselect").disabled = true
  document.querySelector("#sfn").disabled = true
  document.querySelector("#sln").disabled = true
  document.querySelector("#rfn").disabled = true
  document.querySelector("#rln").disabled = true
  document.querySelector("#action").disabled = true
  document.querySelector("#date").disabled = true

  document.querySelector("#fieldname").addEventListener('change', function(e) { 

    var fieldname = document.querySelector("#fieldname");
 
    if (fieldname.value === "Equipment" || fieldname.value === "Model" || fieldname.value === "Serial" || fieldname.value === "EE")
    {
      document.querySelector("#search").style.display = "inline-block"
      document.querySelector("#statuses").style.display = "none"
      document.querySelector("#dselect").style.display = "none"
      document.querySelector("#rselect").style.display = "none"
      document.querySelector("#off-site").style.display = "none"
      document.querySelector("#sfn").style.display = "none"
      document.querySelector("#sln").style.display = "none"
      document.querySelector("#rfn").style.display = "none"
      document.querySelector("#rln").style.display = "none"
      document.querySelector("#action").style.display = "none"
      document.querySelector("#date").style.display = "none"

      document.querySelector("#search").disabled = false
      document.querySelector("#statuses").disabled = true
      document.querySelector("#dselect").disabled = true
      document.querySelector("#rselect").disabled = true
      document.querySelector("#off-site").disabled = true
      document.querySelector("#sfn").disabled = true
      document.querySelector("#sln").disabled = true
      document.querySelector("#rfn").disabled = true
      document.querySelector("#rln").disabled = true
      document.querySelector("#action").disabled = true
      document.querySelector("#date").disabled = true
    }
    else if (fieldname.value === "Status")
    {
      document.querySelector("#search").style.display = "none"
      document.querySelector("#statuses").style.display = "inline-block"
      document.querySelector("#dselect").style.display = "none"
      document.querySelector("#rselect").style.display = "none"
      document.querySelector("#off-site").style.display = "none"
      document.querySelector("#sfn").style.display = "none"
      document.querySelector("#sln").style.display = "none"
      document.querySelector("#rfn").style.display = "none"
      document.querySelector("#rln").style.display = "none"
      document.querySelector("#action").style.display = "none"
      document.querySelector("#date").style.display = "none"

      document.querySelector("#search").disabled = true
      document.querySelector("#statuses").disabled = false
      document.querySelector("#dselect").disabled = true
      document.querySelector("#rselect").disabled = true
      document.querySelector("#off-site").disabled = true
      document.querySelector("#sfn").disabled = true
      document.querySelector("#sln").disabled = true
      document.querySelector("#rfn").disabled = true
      document.querySelector("#rln").disabled = true
      document.querySelector("#action").disabled = true
      document.querySelector("#date").disabled = true
    }
    else if (fieldname.value === "Assigned Location" || fieldname.value === "Current Location")
    {
      document.querySelector("#search").style.display = "none"
      document.querySelector("#statuses").style.display = "none"
      document.querySelector("#dselect").style.display = "inline-block"
      document.querySelector("#rselect").style.display = "inline-block"
      document.querySelector("#off-site").style.display = "none"
      document.querySelector("#sfn").style.display = "none"
      document.querySelector("#sln").style.display = "none"
      document.querySelector("#rfn").style.display = "none"
      document.querySelector("#rln").style.display = "none"
      document.querySelector("#action").style.display = "none"
      document.querySelector("#date").style.display = "none"
      
      document.querySelector("#search").disabled = true
      document.querySelector("#statuses").disabled = true
      document.querySelector("#dselect").disabled = false
      document.querySelector("#rselect").disabled = true
      document.querySelector("#off-site").disabled = true
      document.querySelector("#sfn").disabled = true
      document.querySelector("#sln").disabled = true
      document.querySelector("#rfn").disabled = true
      document.querySelector("#rln").disabled = true
      document.querySelector("#action").disabled = true
      document.querySelector("#date").disabled = true

      document.querySelector("#dselect").value = "Department"
      document.querySelector("#rselect").value = "Room"
    }
    else if (fieldname.value === "Off-site Location")
    {
      document.querySelector("#search").style.display = "none"
      document.querySelector("#statuses").style.display = "none"
      document.querySelector("#dselect").style.display = "none"
      document.querySelector("#rselect").style.display = "none"
      document.querySelector("#off-site").style.display = "inline-block"
      document.querySelector("#sfn").style.display = "none"
      document.querySelector("#sln").style.display = "none"
      document.querySelector("#rfn").style.display = "none"
      document.querySelector("#rln").style.display = "none"
      document.querySelector("#action").style.display = "none"
      document.querySelector("#date").style.display = "none"
      
      document.querySelector("#search").disabled = true
      document.querySelector("#statuses").disabled = true
      document.querySelector("#dselect").disabled = true
      document.querySelector("#rselect").disabled = true
      document.querySelector("#off-site").disabled = false
      document.querySelector("#sfn").disabled = true
      document.querySelector("#sln").disabled = true
      document.querySelector("#rfn").disabled = true
      document.querySelector("#rln").disabled = true
      document.querySelector("#action").disabled = true
      document.querySelector("#date").disabled = true
    }
    else if (fieldname.value === "Scanned By")
    {
      document.querySelector("#search").style.display = "none"
      document.querySelector("#statuses").style.display = "none"
      document.querySelector("#dselect").style.display = "none"
      document.querySelector("#rselect").style.display = "none"
      document.querySelector("#off-site").style.display = "none"
      document.querySelector("#sfn").style.display = "inline-block"
      document.querySelector("#sln").style.display = "inline-block"
      document.querySelector("#rfn").style.display = "none"
      document.querySelector("#rln").style.display = "none"
      document.querySelector("#action").style.display = "none"
      document.querySelector("#date").style.display = "none"
      
      document.querySelector("#search").disabled = true
      document.querySelector("#statuses").disabled = true
      document.querySelector("#dselect").disabled = true
      document.querySelector("#rselect").disabled = true
      document.querySelector("#off-site").disabled = true
      document.querySelector("#sfn").disabled = false
      document.querySelector("#sln").disabled = false
      document.querySelector("#rfn").disabled = true
      document.querySelector("#rln").disabled = true
      document.querySelector("#action").disabled = true
      document.querySelector("#date").disabled = true
    }
    else if (fieldname.value === "Received By")
    {
      document.querySelector("#search").style.display = "none"
      document.querySelector("#statuses").style.display = "none"
      document.querySelector("#dselect").style.display = "none"
      document.querySelector("#rselect").style.display = "none"
      document.querySelector("#off-site").style.display = "none"
      document.querySelector("#sfn").style.display = "none"
      document.querySelector("#sln").style.display = "none"
      document.querySelector("#rfn").style.display = "inline-block"
      document.querySelector("#rln").style.display = "inline-block"
      document.querySelector("#action").style.display = "none"
      document.querySelector("#date").style.display = "none"
      
      document.querySelector("#search").disabled = true
      document.querySelector("#statuses").disabled = true
      document.querySelector("#dselect").disabled = true
      document.querySelector("#rselect").disabled = true
      document.querySelector("#off-site").disabled = true
      document.querySelector("#sfn").disabled = true
      document.querySelector("#sln").disabled = true
      document.querySelector("#rfn").disabled = false
      document.querySelector("#rln").disabled = false
      document.querySelector("#action").disabled = true
      document.querySelector("#date").disabled = true
    }
    else if (fieldname.value === "Action")
    {
      document.querySelector("#search").style.display = "none"
      document.querySelector("#statuses").style.display = "none"
      document.querySelector("#dselect").style.display = "none"
      document.querySelector("#rselect").style.display = "none"
      document.querySelector("#off-site").style.display = "none"
      document.querySelector("#sfn").style.display = "none"
      document.querySelector("#sln").style.display = "none"
      document.querySelector("#rfn").style.display = "none"
      document.querySelector("#rln").style.display = "none"
      document.querySelector("#action").style.display = "inline-block"
      document.querySelector("#date").style.display = "none"
      
      document.querySelector("#search").disabled = true
      document.querySelector("#statuses").disabled = true
      document.querySelector("#dselect").disabled = true
      document.querySelector("#rselect").disabled = true
      document.querySelector("#off-site").disabled = true
      document.querySelector("#sfn").disabled = true
      document.querySelector("#sln").disabled = true
      document.querySelector("#rfn").disabled = true
      document.querySelector("#rln").disabled = true
      document.querySelector("#action").disabled = false
      document.querySelector("#date").disabled = true
    }
    else if (fieldname.value === "Date of Action")
    {
      document.querySelector("#search").style.display = "none"
      document.querySelector("#statuses").style.display = "none"
      document.querySelector("#dselect").style.display = "none"
      document.querySelector("#rselect").style.display = "none"
      document.querySelector("#off-site").style.display = "none"
      document.querySelector("#sfn").style.display = "none"
      document.querySelector("#sln").style.display = "none"
      document.querySelector("#rfn").style.display = "none"
      document.querySelector("#rln").style.display = "none"
      document.querySelector("#action").style.display = "none"
      document.querySelector("#date").style.display = "inline-block"
      
      document.querySelector("#search").disabled = true
      document.querySelector("#statuses").disabled = true
      document.querySelector("#dselect").disabled = true
      document.querySelector("#rselect").disabled = true
      document.querySelector("#off-site").disabled = true
      document.querySelector("#sfn").disabled = true
      document.querySelector("#sln").disabled = true
      document.querySelector("#rfn").disabled = true
      document.querySelector("#rln").disabled = true
      document.querySelector("#action").disabled = true
      document.querySelector("#date").disabled = false
    }

  });
}

// Code to toggle visibility of checkboxes for deleting users and items from inventory

if (document.querySelector(".delbutton"))
{

  var deletebutton = document.querySelector(".delbutton");
  var confirmdel = document.querySelector("#confirmdel");

  if (document.querySelector(".adduser"))
  {
    var deleteinventory = document.getElementsByClassName("deleteuser")
  }
  else if (document.querySelector(".additem"))
  {
    var deleteinventory = document.getElementsByClassName("deleteinventory")
  }

  if (document.querySelector(".navpages"))
  {
    var togglenav = document.querySelector(".pages").firstElementChild.children
  }

  document.querySelector(".delbutton").addEventListener('click', function(e){ 

    deletebutton.style.display = "none";
    confirmdel.style.display = "inline-block";
    
    for (let i = 0; i < deleteinventory.length; i++)
    {
      if (deleteinventory[i].className == "deleteuser")
      {
        deleteinventory[i].style.display = "inline-block";
      }
      else if (deleteinventory[i].className == "deleteinventory")
      {
        deleteinventory[i].style.display = "inline-block";
      }
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = true;
        }
      }
    }

  });

  document.querySelector("#closedel").addEventListener('click', function(e){ 

    deletebutton.style.display = "inline-block";
    confirmdel.style.display = "none";

    for (let i = 0; i < deleteinventory.length; i++)
    {
      if (deleteinventory[i].className == "deleteuser")
      {
        deleteinventory[i].style.display = "none";
        deleteinventory[i].checked= false;
      }
      else if (deleteinventory[i].className == "deleteinventory")
      {
        deleteinventory[i].style.display = "none";
        deleteinventory[i].checked= false;
      }
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = false;
        }
      }
    }

  });

}

// Code for sending items to replace page

if (document.querySelector(".replacebutton"))
{
  var replacebutton = document.querySelector(".replacebutton");
  var confirmreplace = document.querySelector("#confirmreplace");
  var replaceinventory = document.getElementsByClassName("replaceinventory")

  if (document.querySelector(".navpages"))
  {
    var togglenav = document.querySelector(".pages").firstElementChild.children
  }

  document.querySelector(".replacebutton").addEventListener('click', function(e){ 

    replacebutton.style.display = "none";
    confirmreplace.style.display = "inline-block";
    
    for (let i = 0; i < replaceinventory.length; i++)
    {
      replaceinventory[i].style.display = "inline-block";
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = true;
        }
      }
    }

  });

  document.querySelector("#closereplace").addEventListener('click', function(e){ 

    replacebutton.style.display = "inline-block";
    confirmreplace.style.display = "none";

    for (let i = 0; i < replaceinventory.length; i++)
    {
      replaceinventory[i].style.display = "none";
      replaceinventory[i].checked= false;
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = false;
        }
      }
    }

  });
}

// Code for sending to replaced items page 

if (document.querySelector(".replacedbutton"))
{

  var replacedbutton = document.querySelector(".replacedbutton");
  var confirmreplaced = document.querySelector("#confirmreplaced");
  var replacedinventory = document.getElementsByClassName("replacedinventory")

  if (document.querySelector(".navpages"))
  {
    var togglenav = document.querySelector(".pages").firstElementChild.children
  }

  document.querySelector(".replacedbutton").addEventListener('click', function(e){ 

    replacedbutton.style.display = "none";
    confirmreplaced.style.display = "inline-block";

    for (let i = 0; i < replacedinventory.length; i++)
    {
      replacedinventory[i].style.display = "inline-block";
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = true;
        }
      }
    }

  });

  document.querySelector("#closereplaced").addEventListener('click', function(e){ 

    replacedbutton.style.display = "inline-block";
    confirmreplaced.style.display = "none";

    for (let i = 0; i < replacedinventory.length; i++)
    {
      replacedinventory[i].style.display = "none";
      replacedinventory[i].checked= false;
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = false;
        }
      }
    }

  });

}

// Code for marking items as missing 

if (document.querySelector(".missingbutton"))
{

  var missingbutton = document.querySelector(".missingbutton");
  var confirmmissing = document.querySelector("#confirmmissing");
  var missinginventory = document.getElementsByClassName("missinginventory")

  if (document.querySelector(".navpages"))
  {
    var togglenav = document.querySelector(".pages").firstElementChild.children
  }

  missingbutton.addEventListener('click', function(e){ 

    missingbutton.style.display = "none";
    confirmmissing.style.display = "inline-block";
    
    for (let i = 0; i < missinginventory.length; i++)
    { 
      missinginventory[i].style.display = "inline-block";
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = true;
        }
      }
    }

  });

  document.querySelector("#closemissing").addEventListener('click', function(e){ 

    missingbutton.style.display = "inline-block";
    confirmmissing.style.display = "none";

    for (let i = 0; i < missinginventory.length; i++)
    {
      missinginventory[i].style.display = "none";
      missinginventory[i].checked = false;
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = false;
        }
      }
    }

  });

}

// Code to prevent marking items as missing without selection for inventory

if (document.querySelector("#confirmmissing"))
{
  var missinginv = document.getElementsByName("missinginv")

  if (document.querySelector(".additem"))
  {
    var hiddenstatus = document.getElementsByName("hiddenstatus")
    var emptyselection = document.querySelectorAll(".emptyselection");
  }
  else 
  {
    var emptyselection = document.querySelectorAll(".emptyselection");
  }

  document.querySelector("#confirmmissing").addEventListener("click", function(e) {

    if (document.querySelector(".additem"))
    {
      for (let i = 0; i < missinginv.length; i++)
      {
        if (missinginv[i].checked == true)
        { 
          for (let j = i; j < missinginv.length; j++)
          {
            if (hiddenstatus[j].value == "MISSING" && missinginv[j].checked == true)
            {
              document.querySelector("#completemissing").type = "button";
              break;
            }
            else if (j == missinginv.length - 1)
            {
              document.querySelector("#completemissing").type = "submit";
            }
          }
          break;
        }
      }
  
      for (let i = 0; i < missinginv.length; i++)
      {
        if (missinginv[i].checked == true)
        {
          break;
        }
        else if (i == missinginv.length - 1)
        {
          document.querySelector("#completemissing").type = "button";
        }
      }
    }
    else 
    {
      for (let i = 0; i < missinginv.length; i++)
      {
        if (missinginv[i].checked == true)
        { 
          document.querySelector("#completemissing").type = "submit";
          break;
        }
        else if (i == missinginv.length - 1)
        {
          document.querySelector("#completemissing").type = "button";
        }
      }
    }
  });

  document.querySelector("#completemissing").addEventListener("click", function(e) {

    if (document.querySelector(".additem"))
    {
      for (let i = 0; i < missinginv.length; i++)
      {
          if (missinginv[i].checked == true && document.querySelector("#completemissing").type == "button")
          {
            document.querySelector(".already-missing").style.display = "block";
            break;
          }
          else if (i == missinginv.length - 1 && document.querySelector("#completemissing").type == "button")
          {
            for (let i = 0; i < emptyselection.length; i++)
            {
              emptyselection[i].style.display = "block";
            }
          }
        }
    }
    else 
    {
      if (document.querySelector("#completemissing").type == "button")
      {
        for (let i = 0; i < emptyselection.length; i++)
        {
          emptyselection[i].style.display = "block";
        }
      }
    }

  });

  document.addEventListener("mouseover", function(e) {
        
    if (!(document.querySelector("#completemissing").contains(e.target)))
    {
      if (document.querySelector(".additem"))
      {
        for (let i = 0; i < emptyselection.length; i++)
        {
          emptyselection[i].style.display = "none";
        }
        document.querySelector(".already-missing").style.display = "none";
      }
      else
      {

        for (let i = 0; i < emptyselection.length; i++)
        {
          for (let i = 0; i < emptyselection.length; i++)
          {
            emptyselection[i].style.display = "none";
          }
        }
      }
    }

  });


}

// Code for editing multiple items and selecting items to edit

if (document.querySelector(".editbutton"))
{
 
  var editbutton = document.querySelector(".editbutton");
  var confirmedit = document.querySelector("#confirmedit");
  var editinventory = document.querySelectorAll(".editinventory");
  
  for (let i = 0; i < editinventory.length; i++)
  {
    editinventory[i].style.display = "none"; 
  }

  if (document.querySelector(".navpages"))
  {
    var togglenav = document.querySelector(".pages").firstElementChild.children
  }

  editbutton.addEventListener('click', function(e){ 

    editbutton.style.display = "none";
    confirmedit.style.display = "inline-block";
    document.querySelector("#hidden-edit-item").value = null
    document.querySelector("#editInfoModalLabel").textContent = "Edit Items"
    
    for (let i = 0; i < editinventory.length; i++)
    {
      editinventory[i].style.display = "inline-block";
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = true;
        }
      }
    }

  });

  document.querySelector("#closeedit").addEventListener('click', function(e){ 

    editbutton.style.display = "inline-block";
    confirmedit.style.display = "none";
    document.querySelector("#hidden-edit-item").value = ""

    for (let i = 0; i < editinventory.length; i++)
    {

      editinventory[i].style.display = "none";
      editinventory[i].checked = false;

    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = false;
        }
      }
    }

  });

}

// Code to prevent editing items without selection from inventory

if (document.querySelector("#confirmedit"))
{
  var editinv = document.getElementsByName("editinv")
  var emptyselection = document.querySelector(".emptyselection");
  
  document.querySelector("#confirmedit").addEventListener("click", function(e) {

    for (let i = 0; i < editinventory.length; i++)
    {
      if (editinventory[i].checked == true)
      {
        if (document.querySelector("#admin-edit-li").style.display == "block")
        {
    
          editequip = document.querySelector("#edit-equipment").value;
          editmodel = document.querySelector("#edit-model").value;
          editserial = document.querySelector("#edit-serial").value;
          editee = document.querySelector("#edit-ee").value;
          editdepti = document.querySelector("#edit-dinput").value;
          editroomi = document.querySelector("#edit-rinput").value;
          editrepl = document.querySelector("#edit-replace-date").value;
          editinvi = [editequip, editmodel, editserial, editee, editdepti, editroomi, editrepl];
    
          for (let j = 0; j < editinvi.length; j++)
          {
            if (editinvi[j] != "")
            {
              document.querySelector("#completeedit").type = "submit";
              break;
            }
            else if (j == editinvi.length - 1)
            {
              document.querySelector("#completeedit").type = "button";
            }
          
          }
          break;
        }
        else if (document.querySelector("#admin-edit-ls").style.display == "block")
        {
    
          editequip = document.querySelector("#edit-equipment").value;
          editmodel = document.querySelector("#edit-model").value;
          editserial = document.querySelector("#edit-serial").value;
          editee = document.querySelector("#edit-ee").value;
          editdepts = document.querySelector("#edit-dselect").value;
          editrooms = document.querySelector("#edit-rselect").value;
          editrepl = document.querySelector("#edit-replace-date").value;
          editinvs = [editequip, editmodel, editserial, editee, editdepts, editrooms, editrepl];
    
          for (let j = 0; j < editinvs.length; j++)
          {
            if (editinvs[j] != ""  || editinvs[4] != "Department" || editinvs[5] != "Room")
            {
              document.querySelector("#completeedit").type = "submit";
              break
            }
            else if (j == editinvi.length - 1)
            {
              if (editinvs[j] === "" && editinvs[4] === "Department" && editinvs[5] === "Room")
              {
                document.querySelector("#completeedit").type = "button";
              }
            }
          }
        }
      }
      else if (i == editinventory.length - 1)
      {
        document.querySelector("#completeedit").type = "button";
      }
    }

  });

}

// Code for sending items to archive page 

if (document.querySelector(".archivebutton") || document.querySelector(".unarchivebutton"))
{

  if (document.querySelector(".archivebutton"))
  {
    var archivebutton = document.querySelector(".archivebutton");
    var confirmarchive = document.querySelector("#confirmarchive");
    var archiveinventory = document.getElementsByClassName("archiveinventory")
    var closearchive = document.querySelector("#closearchive")
  }
  else if (document.querySelector(".unarchivebutton"))
  {
    var archivebutton = document.querySelector(".unarchivebutton");
    var confirmarchive = document.querySelector("#confirmunarchive");
    var archiveinventory = document.getElementsByClassName("unarchiveinventory")
    var closearchive = document.querySelector("#closeunarchive")
  }

  if (document.querySelector(".navpages"))
  {
    var togglenav = document.querySelector(".pages").firstElementChild.children
  }

  archivebutton.addEventListener('click', function(e){ 

    archivebutton.style.display = "none";
    confirmarchive.style.display = "inline-block";
    
    for (let i = 0; i < archiveinventory.length; i++)
    {
      if (archiveinventory[i].className == "archiveinventory")
      {
        archiveinventory[i].style.display = "inline-block";
      }
      else if (archiveinventory[i].className == "unarchiveinventory")
      {
        archiveinventory[i].style.display = "inline-block";
      }
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = true;
        }
      }
    }

  });

  closearchive.addEventListener('click', function(e){ 

    archivebutton.style.display = "inline-block";
    confirmarchive.style.display = "none";

    for (let i = 0; i < archiveinventory.length; i++)
    {
      if (archiveinventory[i].className == "archiveinventory")
      {
        archiveinventory[i].style.display = "none";
        archiveinventory[i].checked = false;
      }
      else if (archiveinventory[i].className == "unarchiveinventory")
      {
        archiveinventory[i].style.display = "none";
        archiveinventory[i].checked = false;
      }
    }

    if (document.querySelector(".navpages"))
    {
      for (let i = 0; i < togglenav.length; i++)
      {
        if (togglenav[i].firstElementChild.nodeName == "BUTTON")
        {
          togglenav[i].firstElementChild.disabled = false;
        }
      }
    }

  });

}

// Code to prevent sending items to archive without selection

if (document.querySelector("#confirmarchive") || document.querySelector("#confirmunarchive"))
{
  if (document.querySelector("#confirmarchive"))
  {
    var archiveinv = document.getElementsByName("archiveinv")
    var emptyselection = document.querySelectorAll(".emptyselection");
    var confirmarchive = document.querySelector("#confirmarchive");
    var completearchive = document.querySelector("#completearchive");
  }
  else if (document.querySelector("#confirmunarchive"))
  {
    var archiveinv = document.getElementsByName("unarchiveinv")
    var emptyselection = document.querySelectorAll(".emptyselection");
    var confirmarchive = document.querySelector("#confirmunarchive");
    var completearchive = document.querySelector("#completeunarchive");
  }

  confirmarchive.addEventListener("click", function(e) {

    for (let i = 0; i < archiveinv.length; i++)
    {
      if (archiveinv[i].checked == true)
      { 
        completearchive.type = "submit";
        break;
      }
      else if (i == archiveinv.length - 1)
      {
        completearchive.type = "button";
      }
    }

  });

  completearchive.addEventListener("click", function(e) {

    if (completearchive.type == "button")
    {
      for (let i = 0; i < emptyselection.length; i++)
      {
        emptyselection[i].style.display = "block";
      }
    }
  });

  document.addEventListener("mouseover", function(e) {
        
    if (!(completearchive.contains(e.target)))
    {
      for (let i = 0; i < emptyselection.length; i++)
      {
        emptyselection[i].style.display = "none";
      }

    }

  });

}

// Code to toggle visibility of action buttons on pages that have an action button

if (document.querySelector(".action-menu-wrapper"))
{
  if (document.querySelector(".additem") || document.querySelector(".userview") || document.querySelector(".replaceitem")  || document.querySelector(".replaceditem") || document.querySelector(".missingitem") 
  || document.querySelector(".adduser") || document.querySelector(".inventory-archive") || document.querySelector(".offsiteitem") || document.querySelector(".uploaditem")) 
  {

    var actionMenuButton = document.querySelector(".action-menu-button")
    var actionMenu = document.querySelector(".action-menu")

    actionMenuButton.addEventListener("click", function() {

      if (actionMenuButton.className == "btn btn-primary action-menu-button")
      {
        actionMenuButton.removeAttribute("class")
        actionMenuButton.classList.add("btn", "btn-secondary", "action-menu-button")
        actionMenu.style.display = "flex"
      }
      else if (actionMenuButton.className == "btn btn-secondary action-menu-button")
      {
        actionMenuButton.removeAttribute("class")
        actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
        actionMenu.style.display = "none"
      }

    })

    if (document.querySelector(".additem")) 
    {
      document.querySelector(".addbutton").addEventListener("click", function() {
      
        actionMenuButton.removeAttribute("class")
        actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
        actionMenu.style.display = "none"

      })

      if (document.querySelector(".replacebutton"))
      {
        document.querySelector(".replacebutton").addEventListener("click", function() {
        
          actionMenuButton.removeAttribute("class")
          actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
          actionMenuButton.style.display = "none"
          actionMenu.style.display = "none"
          document.querySelector("#confirmreplace").style.display = "block"

        })
      }

      if (document.querySelector(".editbutton"))
      {
        document.querySelector(".editbutton").addEventListener("click", function() {
        
          actionMenuButton.removeAttribute("class")
          actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
          actionMenuButton.style.display = "none"
          actionMenu.style.display = "none"
          document.querySelector("#confirmedit").style.display = "block"

        })
      }
    }

    if (document.querySelector(".additem") || document.querySelector(".offsiteitem") || document.querySelector(".replaceitem")) 
    {
      if (document.querySelector(".missingbutton"))
      {
        document.querySelector(".missingbutton").addEventListener("click", function() {
        
          actionMenuButton.removeAttribute("class")
          actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
          actionMenuButton.style.display = "none"
          actionMenu.style.display = "none"
          document.querySelector("#confirmmissing").style.display = "block"

        })
      }
    }

    if (document.querySelector(".additem") || document.querySelector(".adduser")) 
    {
      if (document.querySelector(".delbutton"))
      {
        document.querySelector(".delbutton").addEventListener("click", function() {
        
          actionMenuButton.removeAttribute("class")
          actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
          actionMenuButton.style.display = "none"
          actionMenu.style.display = "none"
          document.querySelector("#confirmdel").style.display = "block"

        })
      }
    }

    if (document.querySelector(".replaceitem") || document.querySelector(".missingitem")) 
    {
      if (document.querySelector(".replacedbutton"))
      {
        document.querySelector(".replacedbutton").addEventListener("click", function() {
        
          actionMenuButton.removeAttribute("class")
          actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
          actionMenuButton.style.display = "none"
          actionMenu.style.display = "none"
          document.querySelector("#confirmreplaced").style.display = "block"

        })
      }
    }

    if (document.querySelector(".additem") || document.querySelector(".replaceditem")) 
    {
      if (document.querySelector(".archivebutton"))
      {
        document.querySelector(".archivebutton").addEventListener("click", function() {
        
          actionMenuButton.removeAttribute("class")
          actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
          actionMenuButton.style.display = "none"
          actionMenu.style.display = "none"
          document.querySelector("#confirmarchive").style.display = "block"

        })
      }
    }

    if (document.querySelector(".inventory-archive")) 
    {
      if (document.querySelector(".unarchivebutton"))
      {
        document.querySelector(".unarchivebutton").addEventListener("click", function() {
      
          actionMenuButton.removeAttribute("class")
          actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
          actionMenuButton.style.display = "none"
          actionMenu.style.display = "none"
          document.querySelector("#confirmunarchive").style.display = "block"
  
        })
      }
    }

    document.addEventListener("click", function(e) {
    
      if (document.querySelector("#closereplace") || document.querySelector("#closemissing") || document.querySelector("#closedel") || document.querySelector("#closearchive") 
      || document.querySelector("#closeunarchive") || document.querySelector("#closeedit"))
      {
        if (document.querySelector(".additem"))
        {
          if (document.querySelector("#closereplace").contains(e.target) || document.querySelector("#closemissing").contains(e.target) || document.querySelector("#closedel").contains(e.target) 
          || document.querySelector("#closeedit").contains(e.target) || document.querySelector("#closearchive").contains(e.target))
          {
            actionMenuButton.style.display = "block"
          }
        }
        else if (document.querySelector(".adduser"))
        {
          if (document.querySelector("#closedel").contains(e.target))
          {
            actionMenuButton.style.display = "block"
          }
        }
        else if (document.querySelector(".offsiteitem") || document.querySelector(".replaceitem"))
        {
          if (document.querySelector("#closemissing").contains(e.target))
          {
            actionMenuButton.style.display = "block"
          }
        }
        else if (document.querySelector(".replaceditem"))
        {
          if (document.querySelector("#closearchive").contains(e.target))
          {
            actionMenuButton.style.display = "block"
          }
        }
        else if (document.querySelector(".inventory-archive"))
        {
          if (document.querySelector("#closeunarchive").contains(e.target))
          {
            actionMenuButton.style.display = "block"
          }
        }
      }
      else if (document.querySelector("#closereplaced"))
      {
        if (document.querySelector("#closereplaced").contains(e.target))
        {
          actionMenuButton.style.display = "block"
        }
      }

      if (actionMenuButton.className == "btn btn-secondary action-menu-button")
      {
        if (!(document.querySelector(".action-menu-button").contains(e.target)))
        {
          actionMenuButton.removeAttribute("class")
          actionMenuButton.classList.add("btn", "btn-primary", "action-menu-button")
          actionMenu.style.display = "none"
        }
      }

    })
  }
}

// Code for input formatting adding item to inventory

if (document.querySelector(".additem")) 
{

  document.querySelector("#admin-li").style.display = "block"
  var addequip = document.querySelector("#equipment");
  var addmodel = document.querySelector("#model");
  var addserial = document.querySelector("#serial");
  var addee = document.querySelector("#ee");
  var adddepti = document.querySelector("#dinput");
  var addroomi = document.querySelector("#rinput");
  var adddepts = document.querySelector("#dselect");
  var addrooms = document.querySelector("#rselect");
  var adddate = document.querySelector("#date_added");
  var addrepl = document.querySelector("#replace_date");
  var addinvi = [addequip, addmodel, addserial, addee, adddepti, addroomi, adddate, addrepl];
  var addinvs = [addequip, addmodel, addserial, addee, adddepts, addrooms, adddate, addrepl];

  var editequip = document.querySelector("#edit-equipment");
  var editmodel = document.querySelector("#edit-model");
  var editserial = document.querySelector("#edit-serial");
  var editee = document.querySelector("#edit-ee");
  var editdepti = document.querySelector("#edit-dinput");
  var editroomi = document.querySelector("#edit-rinput");
  var editdepts = document.querySelector("#edit-dselect");
  var editrooms = document.querySelector("#edit-rselect");
  var editrepl = document.querySelector("#edit-replace-date");
  var editinvi = [editequip, editmodel, editserial, editdepti, editroomi, editrepl];
  var editinvs = [editequip, editmodel, editserial, editdepts, editrooms, editrepl];
  var emptywarning = document.querySelectorAll(".emptywarning");
  var emptyselection = document.querySelectorAll(".emptyselection");

  document.querySelector(".addbutton").addEventListener('click', function(e){ 

    if (document.querySelector("#admin-li").style.display == "block")
    {

      addequip = document.querySelector("#equipment").value;
      addmodel = document.querySelector("#model").value;
      addserial = document.querySelector("#serial").value;
      addee = document.querySelector("#ee").value;
      adddepti = document.querySelector("#dinput").value;
      addroomi = document.querySelector("#rinput").value;
      adddate = document.querySelector("#date_added").value;
      addrepl = document.querySelector("#replace_date").value;
      addinvi = [addequip, addmodel, addserial, addee, adddepti, addroomi, adddate, addrepl];

      for (let i = 0; i < addinvi.length; i++)
      {
        if (addinvi[i] === "")
        {
          document.querySelector("#confirminv").type = "button";
          break;
        }
        else if (i == addinvi.length - 1)
        {
          document.querySelector("#confirminv").type = "submit";
        }
      
      }
    }
    else if (document.querySelector("#admin-ls").style.display == "block")
    {

      addequip = document.querySelector("#equipment").value;
      addmodel = document.querySelector("#model").value;
      addserial = document.querySelector("#serial").value;
      addee = document.querySelector("#ee").value;
      adddepts = document.querySelector("#dselect").value;
      addrooms = document.querySelector("#rselect").value;
      adddate = document.querySelector("#date_added").value;
      addrepl = document.querySelector("#replace_date").value;
      addinvs = [addequip, addmodel, addserial, addee, adddepts, addrooms, adddate, addrepl];

      for (let i = 0; i < addinvs.length; i++)
      {
        if (addinvs[i] === "" || addinvs[4] === "Department" || addinvs[5] === "Room")
        {
          document.querySelector("#confirminv").type = "button";
          break;
        }
        else if (i == addinvi.length - 1)
        {
          document.querySelector("#confirminv").type = "submit";
        }
      }
    }
    else 
    {
      document.querySelector("#confirminv").type = "button";
    }
  
  }); 

  document.querySelector("#addInvModal").addEventListener('input', function(e){ 

    if (document.querySelector("#admin-li").style.display == "block")
    {
      addequip = document.querySelector("#equipment").value;
      addmodel = document.querySelector("#model").value;
      addserial = document.querySelector("#serial").value;
      addee = document.querySelector("#ee").value;
      adddepti = document.querySelector("#dinput").value;
      addroomi = document.querySelector("#rinput").value;
      adddate = document.querySelector("#date_added").value;
      addrepl = document.querySelector("#replace_date").value;
      addinvi = [addequip, addmodel, addserial, addee, adddepti, addroomi, adddate, addrepl];

      for (let i = 0; i < addinvi.length; i++)
      {
        if (addinvi[i] === "")
        {
          document.querySelector("#confirminv").type = "button";
          break;
        }
        else if (addinvi[addinvi.length - 1])
        {
          document.querySelector("#confirminv").type = "submit";
        }
      
      }

    }
    else
    {
      addequip = document.querySelector("#equipment").value;
      addmodel = document.querySelector("#model").value;
      addserial = document.querySelector("#serial").value;
      addee = document.querySelector("#ee").value;
      adddepts = document.querySelector("#dselect").value;
      addrooms = document.querySelector("#rselect").value;
      adddate = document.querySelector("#date_added").value;
      addrepl = document.querySelector("#replace_date").value;
      addinvs = [addequip, addmodel, addserial, addee, adddepts, addrooms, adddate, addrepl];

      for (let i = 0; i < addinvs.length; i++)
      {
        if (addinvs[i] === "" || addinvs[4] === "Department" || addinvs[5] === "Room")
        {
          document.querySelector("#confirminv").type = "button";
          break;
        }
        else if (i == addinvi.length - 1)
        {
          document.querySelector("#confirminv").type = "submit";
        }
      }
    }

  });

  document.querySelector("#input-button").addEventListener('click', function(e){ 

    document.querySelector("#admin-li").style.display = "block";
    document.querySelector("#admin-ls").style.display = "none";
    addequip = document.querySelector("#equipment").value;
    addmodel = document.querySelector("#model").value;
    addserial = document.querySelector("#serial").value;
    addee = document.querySelector("#ee").value;
    adddepts = document.querySelector("#dselect").value = "Department";
    addrooms = document.querySelector("#rselect").value = "Room";
    adddate = document.querySelector("#date_added").value;
    addrepl = document.querySelector("#replace_date").value;
    addinvi = [addequip, addmodel, addserial, addee, adddepti, addroomi, adddate, addrepl];

    for (let i = 0; i < addinvi.length; i++)
    {
      if (addinvi[i] === "")
      {
        document.querySelector("#confirminv").type = "button";
        break;
      }
      else if (i == addinvi.length - 1)
      {
        document.querySelector("#confirminv").type = "submit";
      }
    }

  });

  document.querySelector("#select-button").addEventListener('click', function(e){ 

    document.querySelector("#admin-li").style.display = "none";
    document.querySelector("#admin-ls").style.display = "block";
    addequip = document.querySelector("#equipment").value;
    addmodel = document.querySelector("#model").value;
    addserial = document.querySelector("#serial").value;
    addee = document.querySelector("#ee").value;
    adddepti = document.querySelector("#dinput").value = "";
    addroomi = document.querySelector("#rinput").value = "";
    adddate = document.querySelector("#date_added").value;
    addrepl = document.querySelector("#replace_date").value;
    addinvs = [addequip, addmodel, addserial, addee, adddepts, addrooms, adddate, addrepl];

    for (let i = 0; i < addinvs.length; i++)
    {
      if (addinvs[i] === "" || addinvs[4] === "Department" || addinvs[5] === "Room")
      {
        document.querySelector("#confirminv").type = "button";
        break;
      }
      else if (i == addinvs.length - 1)
      {
        document.querySelector("#confirminv").type = "submit";
      }
    
    }

  });

  document.querySelector("#cancelconfirminv").addEventListener('click', function(e){ 

    document.querySelector("#equipment").value = "";
    document.querySelector("#model").value = "";
    document.querySelector("#serial").value = "";
    document.querySelector("#ee").value = "";
    document.querySelector("#dinput").value = "";
    document.querySelector("#rinput").value = "";
    document.querySelector("#dselect").value = "Department";
    document.querySelector("#rselect").value = "Room"; 
    document.querySelector("#rselect").disabled = true;
    document.querySelector("#replace_date").value = "";

  });

  document.querySelector("#confirminv").addEventListener("click", function(e){

    if (document.querySelector("#confirminv").type == "button")
    {
      document.querySelector(".modal-footer").querySelector(".emptywarning").style.display = "inline-block";
    }

  });

  document.addEventListener('mouseover', function(e){ 

    if (!(document.querySelector("#confirminv").contains(e.target)))
    {
      document.querySelector(".modal-footer").querySelector(".emptywarning").style.display = "none";
    }

  });

  // Code for input formatting for editing item in inventory

  document.querySelector("#edit-item").addEventListener('click', function(e){ 

    document.querySelector("#editInfoModalLabel").textContent = "Edit Item"

    for (let i = 0; i < editinventory.length; i++)
    {

      editinventory[i].style.display = "none";
      editinventory[i].checked = false;

    }

    if (document.querySelector("#admin-edit-li").style.display == "block")
    {

      editequip = document.querySelector("#edit-equipment").value;
      editmodel = document.querySelector("#edit-model").value;
      editserial = document.querySelector("#edit-serial").value;
      editee = document.querySelector("#edit-ee").value;
      editdepti = document.querySelector("#edit-dinput").value;
      editroomi = document.querySelector("#edit-rinput").value;
      editrepl = document.querySelector("#edit-replace-date").value;
      editinvi = [editequip, editmodel, editserial, editee, editdepti, editroomi, editrepl];

      for (let i = 0; i < editinvi.length; i++)
      {
        if (editinvi[i] != "")
        {
          document.querySelector("#completeedit").type = "submit";
          break;
        }
        else if (i == editinvi.length - 1)
        {
          document.querySelector("#completeedit").type = "button";
        }
      
      }
    }
    else if (document.querySelector("#admin-edit-ls").style.display == "block")
    {

      editequip = document.querySelector("#edit-equipment").value;
      editmodel = document.querySelector("#edit-model").value;
      editserial = document.querySelector("#edit-serial").value;
      editee = document.querySelector("#edit-ee").value;
      editdepts = document.querySelector("#edit-dselect").value;
      editrooms = document.querySelector("#edit-rselect").value;
      editrepl = document.querySelector("#edit-replace-date").value;
      editinvs = [editequip, editmodel, editserial, editee, editdepts, editrooms, editrepl];

      for (let i = 0; i < editinvs.length; i++)
      {
        if (editinvs[i] != ""  || editinvs[4] != "Department" || editinvs[5] != "Room")
        {
          document.querySelector("#completeedit").type = "submit";
          break
        }
        else if (i == editinvi.length - 1)
        {
          if (editinvs[i] === "" && editinvs[4] === "Department" && editinvs[5] === "Room")
          {
            document.querySelector("#completeedit").type = "button";
          }
        }
      }
    }
    else 
    {
      document.querySelector("#completeedit").type = "button";
    }
  
  }); 
  
  document.querySelector("#edit-info-modal").addEventListener('input', function(e){ 

    if (document.querySelector("#admin-edit-li").style.display == "block")
    {
      editequip = document.querySelector("#edit-equipment").value;
      editmodel = document.querySelector("#edit-model").value;
      editserial = document.querySelector("#edit-serial").value;
      editee = document.querySelector("#edit-ee").value;
      editdepti = document.querySelector("#edit-dinput").value;
      editroomi = document.querySelector("#edit-rinput").value;
      editrepl = document.querySelector("#edit-replace-date").value;
      editinvi = [editequip, editmodel, editserial, editee, editdepti, editroomi, editrepl];

      for (let i = 0; i < editinvi.length; i++)
      {
        if (editinvi[i] != "")
        {
          if (editinventory[0].style.display == "inline-block")
          {
            for (let j = 0; j < editinventory.length; j++)
            {
              if (editinventory[j].checked == true)
              {
                document.querySelector("#completeedit").type = "submit";
                break;
              }
              else if (j == editinventory.length - 1)
              {
                document.querySelector("#completeedit").type = "button";
              }
            }
          }
          else if (editinventory[0].style.display == "none")
          {
            document.querySelector("#completeedit").type = "submit";
            break;
          }
        }
        else if (i == editinvi[editinvi.length - 1])
        {

         document.querySelector("#completeedit").type = "button";
    
        }
      
      }

    }
    else if (document.querySelector("#admin-edit-ls").style.display == "block")
    {
      editequip = document.querySelector("#edit-equipment").value;
      editmodel = document.querySelector("#edit-model").value;
      editserial = document.querySelector("#edit-serial").value;
      editee = document.querySelector("#edit-ee").value;
      editdepts = document.querySelector("#edit-dselect").value;
      editrooms = document.querySelector("#edit-rselect").value;
      editrepl = document.querySelector("#edit-replace-date").value;
      editinvs = [editequip, editmodel, editserial, editee, editdepts, editrooms, editrepl];

      for (let i = 0; i < editinvs.length; i++)
      {
        if (editinvs[4] != "Department" && editinvs[5] != "Room")
        {
          document.querySelector("#completeedit").type = "submit";
          break
        }
        else if (i != 4 && i != 5)
        {
          if (editinvs[i] != "")
          {
            if (editinventory[0].style.display == "inline-block")
            {
              for (let j = 0; j < editinventory.length; j++)
              {
                if (editinventory[j].checked == true)
                {
                  document.querySelector("#completeedit").type = "submit";
                  break;
                }
                else if (j == editinventory.length - 1)
                {
                  document.querySelector("#completeedit").type = "button";
                }
              }
            }
            else if (editinventory[0].style.display == "none")
            {
              document.querySelector("#completeedit").type = "submit";
              break;
            }
          }
        }
        else if (i == editinvi.length - 1)
        {
          if (editinvs[i] === "" && editinvs[4] === "Department" && editinvs[5] === "Room")
          {
            document.querySelector("#completeedit").type = "button";
          }
        }
      }
    }

  });

  document.querySelector("#edit-input-button").addEventListener('click', function(e){ 

    document.querySelector("#admin-edit-li").style.display = "block";
    document.querySelector("#admin-edit-ls").style.display = "none";
    editequip = document.querySelector("#edit-equipment").value;
    editmodel = document.querySelector("#edit-model").value;
    editserial = document.querySelector("#edit-serial").value;
    editee = document.querySelector("#edit-ee").value;
    editdepti = document.querySelector("#edit-dinput").value = "";
    editroomi = document.querySelector("#edit-rinput").value = "";
    editrepl = document.querySelector("#edit-replace-date").value;
    editinvi = [editequip, editmodel, editserial, editee, editdepti, editroomi, editrepl];

    for (let i = 0; i < editinvi.length; i++)
    {
      if (editinvi[i] != "")
      {
        if (editinventory[0].style.display == "inline-block")
        {
          for (let j = 0; j < editinventory.length; j++)
          {
            if (editinventory[j].checked == true)
            {
              document.querySelector("#completeedit").type = "submit";
            }
            else if (j == editinventory.length - 1)
            {
              document.querySelector("#completeedit").type = "button";
            }
          }
        }
        else if (editinventory[0].style.display == "none")
        {
          document.querySelector("#completeedit").type = "submit";
          break;
        }
      }
      else if (i == editinvi.length - 1)
      {

        document.querySelector("#completeedit").type = "button";
        
      }
    }

  });

  document.querySelector("#edit-select-button").addEventListener('click', function(e){ 

    document.querySelector("#admin-edit-li").style.display = "none";
    document.querySelector("#admin-edit-ls").style.display = "block";
    editequip = document.querySelector("#edit-equipment").value;
    editmodel = document.querySelector("#edit-model").value;
    editserial = document.querySelector("#edit-serial").value;
    editee = document.querySelector("#edit-ee").value;
    editdepts = document.querySelector("#edit-dselect").value = "Department";
    editrooms = document.querySelector("#edit-rselect").value = "Room";
    editrepl = document.querySelector("#edit-replace-date").value;
    editinvs = [editequip, editmodel, editserial, editee, editdepts, editrooms, editrepl];

    for (let i = 0; i < editinvs.length; i++)
    {
      if (editinvs[4] != "Department" && editinvs[5] != "Room")
      {
        document.querySelector("#completeedit").type = "submit";
        break
      }
      else if (i != 4 && i != 5)
      {
        if (editinvs[i] != "")
        {
          if (editinventory[0].style.display == "inline-block")
          {
            for (let j = 0; j < editinventory.length; j++)
            {
              if (editinventory[j].checked == true)
              {
                document.querySelector("#completeedit").type = "submit";
              }
              else if (j == editinventory.length - 1)
              {
                document.querySelector("#completeedit").type = "button";
              }
            }
          }
          else if (editinventory[0].style.display == "none")
          {
            document.querySelector("#completeedit").type = "submit";
            break;
          }
        }
      }
      else if (i == editinvi.length - 1)
      {
        if (editinvs[i] === "" && editinvs[4] === "Department" && editinvs[5] === "Room")
        {
          document.querySelector("#completeedit").type = "button";
        }
      }
    }
  });

  document.querySelector("#closeedit").addEventListener('click', function(e){ 

    document.querySelector("#edit-equipment").value = "";
    document.querySelector("#edit-model").value = "";
    document.querySelector("#edit-serial").value = "";
    document.querySelector("#edit-ee").value = "";
    document.querySelector("#edit-dinput").value = "";
    document.querySelector("#edit-rinput").value = "";
    document.querySelector("#edit-dselect").value = "Department";
    document.querySelector("#edit-rselect").value = "Room"; 
    document.querySelector("#edit-replace-date").value = "";
    document.querySelector("#edit-rselect").disabled = true;

  });

  document.querySelector("#completeedit").addEventListener("click", function(e){

    if (document.querySelector("#completeedit").type == "button")
    {
      if (editinventory[0].style.display == "inline-block")
      {
        for (let i = 0; i < editinventory.length; i++)
        {
          if (editinventory[i].checked == true)
          {
            for (let j = 0; j < emptywarning.length; j++)
            {
              emptywarning[j].style.display = "inline-block";
            }
            break;
          }
          else if (i == editinventory.length - 1)
          {
            for (let j = 0; j < emptyselection.length; j++)
            {
              emptyselection[j].style.display = "inline-block";
            }

            if (document.querySelector("#admin-edit-li").style.display == "block")
            {
        
              editequip = document.querySelector("#edit-equipment").value;
              editmodel = document.querySelector("#edit-model").value;
              editserial = document.querySelector("#edit-serial").value;
              editee = document.querySelector("#edit-ee").value;
              editdepti = document.querySelector("#edit-dinput").value;
              editroomi = document.querySelector("#edit-rinput").value;
              editrepl = document.querySelector("#edit-replace-date").value;
              editinvi = [editequip, editmodel, editserial, editee, editdepti, editroomi, editrepl];
        
              for (let j = 0; j < editinvi.length; j++)
              {
                if (editinvi[j] != "")
                {
                  break;
                }
                else if (j == editinvi.length - 1)
                {
                  for (let j = 0; j < emptywarning.length; j++)
                  {
                    emptywarning[j].style.display = "inline-block";
                  }
                  break
                }
              
              }
              break;
            }
            else if (document.querySelector("#admin-edit-ls").style.display == "block")
            {
        
              editequip = document.querySelector("#edit-equipment").value;
              editmodel = document.querySelector("#edit-model").value;
              editserial = document.querySelector("#edit-serial").value;
              editee = document.querySelector("#edit-ee").value;
              editdepts = document.querySelector("#edit-dselect").value;
              editrooms = document.querySelector("#edit-rselect").value;
              editrepl = document.querySelector("#edit-replace-date").value;
              editinvs = [editequip, editmodel, editserial, editee, editdepts, editrooms, editrepl];
        
              for (let j = 0; j < editinvs.length; j++)
              {
                if (editinvs[j] != ""  || editinvs[4] != "Department" || editinvs[5] != "Room")
                {
                  break
                }
                else if (j == editinvi.length - 1)
                {
                  if (editinvs[j] === "" && editinvs[4] === "Department" && editinvs[5] === "Room")
                  {
                    for (let j = 0; j < emptywarning.length; j++)
                    {
                      emptywarning[j].style.display = "inline-block";
                    }
                    break
                  }
                }
              }
            }
          }
        }
      }
      else if (editinventory[0].style.display == "none")
      {
        for (let i = 0; i < emptywarning.length; i++)
        {
          emptywarning[i].style.display = "inline-block";
        }
      }
    }

  });

  document.addEventListener('mouseover', function(e){ 

    if (!(document.querySelector("#completeedit").contains(e.target)))
    {
      for (let i = 0; i < emptywarning.length; i++)
      {
        emptywarning[i].style.display = "none";
      }

      for (let i = 0; i < emptyselection.length; i++)
      {
        emptyselection[i].style.display = "none";
      }
    }

  });

  // Code to prevent sending to replace page without selection for inventory

  if (document.querySelector("#confirmreplace"))
  {
    var replaceinv = document.getElementsByName("replaceinv")
    var hiddenaction = document.getElementsByName("hiddenaction")

    document.querySelector("#confirmreplace").addEventListener("click", function(e) {

      for (let i = 0; i < replaceinv.length; i++)
      {
        if (replaceinv[i].checked == true)
        { 
          for (let j = i; j < replaceinv.length; j++)
          {
            if (hiddenaction[j].value == "CHECKED OUT" && replaceinv[j].checked == true)
            {
              document.querySelector("#completereplace").type = "button";
              break;
            }
            else if (j == replaceinv.length - 1)
            {
              document.querySelector("#completereplace").type = "submit";
            }
          }
          break;
        }
      }

      for (let i = 0; i < replaceinv.length; i++)
      {
        if (replaceinv[i].checked == true)
        {
          break;
        }
        else if (i == replaceinv.length - 1)
        {
          document.querySelector("#completereplace").type = "button";
        }
      }

    });

    document.querySelector("#completereplace").addEventListener("click", function(e) {

      for (let i = 0; i < replaceinv.length; i++)
      {
        if (replaceinv[i].checked == true && document.querySelector("#completereplace").type == "button")
        {
          document.querySelector(".notcheckedin").style.display = "block";
          break;
        }
        else if (i == replaceinv.length - 1 && document.querySelector("#completereplace").type == "button")
        {
          document.querySelector(".emptyselection").style.display = "block";
        }
      }

    });

    document.addEventListener("mouseover", function(e) {
          
      if (!(document.querySelector("#completereplace").contains(e.target)))
      {
        document.querySelector(".notcheckedin").style.display = "none";
        document.querySelector(".emptyselection").style.display = "none";
      }

    });


  }

  // Code to prevent confirming deletion without selection from inventory

  if (document.getElementsByName("delinv") && document.querySelector("#confirmdel"))
  {
    var delinv = document.getElementsByName("delinv")
    var emptyselection = document.querySelectorAll(".emptyselection");

    document.querySelector("#confirmdel").addEventListener("click", function(e) {

      for (let i = 0; i < delinv.length; i++)
      {
        if (delinv[i].checked == false)
        {
          document.querySelector("#completedel").type = "button";
        }
        else if (delinv[i].checked == true)
        {
          document.querySelector("#completedel").type = "submit";
          break;
        }
      }

      document.querySelector("#completedel").addEventListener("click", function(e) {

        if (document.querySelector("#completedel").type == "button")
        {
          for (let i = 0; i < emptyselection.length; i++)
          {
            emptyselection[i].style.display = "inline-block";
          }
        }
          
      });

      document.addEventListener("mouseover", function(e) {

        if (!(document.querySelector("#completedel").contains(e.target)))
        {
          for (let i = 0; i < emptyselection.length; i++)
          {
            emptyselection[i].style.display = "none";
          }
        }

      });
    });
  }
}

// Code to prevent sending to replaced item page without selection

if (document.querySelector(".replaceitem") || document.querySelector(".missingitem")) 
{
  if (document.getElementsByName("replacedinv") && document.querySelector("#confirmreplaced"))
  {
    var replacedinv = document.getElementsByName("replacedinv")

    document.querySelector("#confirmreplaced").addEventListener("click", function(e) {

      for (let i = 0; i < replacedinv.length; i++)
      {
        if (replacedinv[i].checked == false)
        {
          document.querySelector("#completereplaced").type = "button";
        }
        else if (replacedinv[i].checked == true)
        {
          document.querySelector("#completereplaced").type = "submit";
          break;
        }
      }

      document.querySelector("#completereplaced").addEventListener("click", function(e) {

        if (document.querySelector("#completereplaced").type == "button")
        {
          document.querySelector(".emptyselection").style.display = "inline-block";
        }
        else if (document.querySelector("#completereplaced").type = "submit")
        {
          document.querySelector(".emptyselection").style.display = "none";
        }
          
      });

      document.addEventListener("mouseover", function(e) {

        if (!(document.querySelector("#completereplaced").contains(e.target)))
        {
          document.querySelector(".emptyselection").style.display = "none";
        }

      });

    });
  }
}

// Code for input formatting for scan

if (document.querySelector("#reader"))
{
  var scanrfn = document.querySelector("#rfn")
  var scanrln = document.querySelector("#rln")
  var scanstatuses = document.querySelector("#statuses")
  var scandepti = document.querySelector("#dinput")
  var scanroomi = document.querySelector("#rinput")
  var scandepts = document.querySelector("#dselect")
  var scanrooms = document.querySelector("#rselect")
  var scanoslinput = document.querySelector("#oslinput")
  var scanoslselect = document.querySelector("#oslselect")
  var scanpoc = document.querySelector("#point_of_contact")
  var scanpn = document.querySelector("#phone_number")
  var scanfirstname = document.querySelector("#first_name")
  var scanlastname = document.querySelector("#last_name")
  var scanarray_onsitei = [scanstatuses, scandepti, scanroomi];
  var scanarray_onsites = [scanstatuses, scandepts, scanrooms];
  var scanarray_offsitei = [scanstatuses, scanoslinput, scanpoc, scanpn, scanfirstname, scanlastname];
  var scanarray_offsites = [scanstatuses, scanoslselect, scanpoc, scanpn, scanfirstname, scanlastname];
  var fieldcat = document.getElementsByClassName("fieldcat");
  document.querySelector("#admin-ls").style.display = "none"
  document.querySelector("#admin-osls").style.display = "none"

  fieldcat[2].style.display = "none"
  fieldcat[3].style.display = "none"
  fieldcat[4].style.display = "none"
  fieldcat[5].style.display = "none"
  fieldcat[6].style.display = "none"

  // Change viewable form fields depending on status selection

  document.querySelector("#changestatus").addEventListener('change', function(e) {

    scanstatuses = scanstatuses
    scanrfn = scanrfn
    scanrln = scanrln

    if (scanstatuses.value == "In Use" || scanstatuses.value == "Storage" || scanstatuses.value == "Replace" || scanstatuses.value == "Replaced")
    {
      document.querySelector("#check-in").style.display = "block";
      document.querySelector("#check-out").style.display = "none";
    }
    else if (scanstatuses.value == "Loaned" || scanstatuses.value == "Off-site" || scanstatuses.value == "Out for Repair")
    {
      document.querySelector("#check-in").style.display = "none";
      document.querySelector("#check-out").style.display = "block";
    }
    
    if (scanstatuses.value == "Off-site")
    {
      fieldcat[0].style.display = "none"
      fieldcat[1].style.display = "none"
      fieldcat[2].style.display = "block"
      fieldcat[3].style.display = "block"
      fieldcat[4].style.display = "block"
      fieldcat[5].style.display = "block"
      fieldcat[6].style.display = "block"
      document.querySelector("#admin-rn").style.display = "none";
      document.querySelector("#recipientSelect").value = "No"
      scanrfn.value = ""
      scanrln.value = ""
      scandepti.value = ""
      scanroomi.value = ""
      scandepts.value = "Department"
      scanrooms.value = "Room"
    }
    else if (scanstatuses.value != "Off-site")
    {
      fieldcat[0].style.display = "block"
      fieldcat[1].style.display = "block"
      fieldcat[2].style.display = "none"
      fieldcat[3].style.display = "none"
      fieldcat[4].style.display = "none"
      fieldcat[5].style.display = "none"
      fieldcat[6].style.display = "none"
      scanoslinput.value = ""
      scanoslselect.value = "Off-site Location"
      scanpoc.value = ""
      scanpn.value = ""
      scanfirstname.value = ""
      scanlastname.value = ""
    }


  });

  // Code to change visibility of recipients fields with status is not equal to off-site
  
  document.querySelector("#recipientSelect").addEventListener('change', function(e) {
  
    scanrfn = scanrfn
    scanrln = scanrln

    if (fieldcat[0].style.display = "block")
    {
      if (document.querySelector("#recipientSelect").value == "Yes")
      {
        document.querySelector("#admin-rn").style.display = "block";
      }
      else if (document.querySelector("#recipientSelect").value == "No")
      {
        document.querySelector("#admin-rn").style.display = "none";
        scanrfn.value = ""
        scanrln.value = ""
      }
    }

  });

  // Code to change between inputs and selection for certain fields 

  // Code to toggle visibility of location input 
  document.querySelector("#input-button").addEventListener('click', function(e) {

    if (document.querySelector("#admin-li").style.display == "none")
    {
      document.querySelector("#admin-li").style.display = "block"
      document.querySelector("#admin-ls").style.display = "none"
      document.querySelector("#check-in").type = "button";
      document.querySelector("#check-out").type = "button";
      scandepts.value = "Department"
      scanrooms.value = "Room"
    }

  });

  // Code to toggle visibility of location select 
  document.querySelector("#select-button").addEventListener('click', function(e) {

    if (document.querySelector("#admin-ls").style.display == "none")
    {
      document.querySelector("#admin-ls").style.display = "block"
      document.querySelector("#admin-li").style.display = "none"
      document.querySelector("#check-in").type = "button";
      document.querySelector("#check-out").type = "button";
      scandepti.value = ""
      scanroomi.value = ""
    }
    
  });

  // Code to toggle visibility of off-site location input
  document.querySelector("#osl-input-button").addEventListener('click', function(e) {

    if (document.querySelector("#admin-osli").style.display == "none")
    {
      document.querySelector("#admin-osli").style.display = "block"
      document.querySelector("#admin-osls").style.display = "none"
      document.querySelector("#check-in").type = "button";
      document.querySelector("#check-out").type = "button";
      scanoslselect.value = "Off-site Location"
    }

  });

  // Code to toggle visibility of off-site location select
  document.querySelector("#osl-select-button").addEventListener('click', function(e) {

    if (document.querySelector("#admin-osls").style.display == "none")
    {
      document.querySelector("#admin-osls").style.display = "block"
      document.querySelector("#admin-osli").style.display = "none"
      document.querySelector("#check-in").type = "button";
      document.querySelector("#check-out").type = "button";      
      scanoslinput.value = ""
    }
    
  });

  // Code for specifically formatting input for off and on site statuses 

  document.querySelector("#changestatus").addEventListener('input', function(e) {

    scanrfn = scanrfn
    scanrln = scanrln
    scanstatuses = scanstatuses
    scandepti =  scandepti
    scanroomi = scanroomi
    scanarray_onsitei = [scanstatuses, scandepti, scanroomi];
    scandepts =  scandepts
    scanrooms = scanrooms
    scanarray_onsites = [scanstatuses, scandepts, scanrooms];
    scanoslinput = scanoslinput
    scanarray_offsitei = [scanstatuses, scanoslinput, scanpoc, scanpn, scanfirstname, scanlastname];
    scanoslselect = scanoslselect
    scanpoc = scanpoc
    scanpn = scanpn
    scanfirstname = scanfirstname
    scanlastname = scanlastname
    scanarray_offsites = [scanstatuses, scanoslselect, scanpoc, scanpn, scanfirstname, scanlastname];

    // In use, storage, replace and replaced
    if (scanstatuses.value == "In Use" || scanstatuses.value == "Storage" || scanstatuses.value == "Replace" || scanstatuses.value == "Replaced")
    {
      document.querySelector("#check-in").style.display = "block";
      document.querySelector("#check-out").style.display = "none";
      document.querySelector("#check-out").type = "button";

      // Recipient yes
      if (document.querySelector("#recipientSelect").value == "Yes")
      {
 
        if (scanarray_onsitei[0].value != "Status" & scanarray_onsitei[1].value != "" & scanarray_onsitei[2].value != "" & scanrfn.value != "" & scanrln.value != "") 
        {
          document.querySelector("#check-in").type = "submit";
        }
        else if (scanarray_onsitei[0].value != "Status" & scanarray_onsites[1].value != "Department" & scanarray_onsitei[2].value != "Room" & scanrfn.value != "" & scanrln.value != "")
        {
          document.querySelector("#check-in").type = "submit";
        }
        else
        {
          document.querySelector("#check-in").type = "button";
        }

      }

      // Recipient no
      else if (document.querySelector("#recipientSelect").value == "No")
      {
        if (scanarray_onsitei[0].value != "Status" & scanarray_onsitei[1].value != "" & scanarray_onsitei[2].value != "") 
        {
          document.querySelector("#check-in").type = "submit";
        }
        else
        {
          document.querySelector("#check-in").type = "button";
        }
      }

    }

    // Loaned and out for repair
    else if (scanstatuses.value == "Loaned" || scanstatuses.value == "Out for Repair")
    {
      document.querySelector("#check-in").style.display = "none";
      document.querySelector("#check-out").style.display = "block";
      document.querySelector("#check-in").type = "button";

      // Recipient yes
      if (document.querySelector("#recipientSelect").value == "Yes")
      {
        if (scanarray_onsitei[0].value != "Status" && scanarray_onsitei[1].value != "" && scanarray_onsitei[2].value != "" && scanrfn.value != "" && scanrln.value != "") 
        {
          document.querySelector("#check-out").type = "submit";
        }
        else
        {
          document.querySelector("#check-out").type = "button";
        }
      }

      // Recipient no
      else if (document.querySelector("#recipientSelect").value == "No")
      {
        if (scanarray_onsitei[0].value != "Status" && scanarray_onsitei[1].value != "" && scanarray_onsitei[2].value != "") 
        {
          document.querySelector("#check-out").type = "submit";
        }
        else
        {
          document.querySelector("#check-out").type = "button";
        }
      }
    }

    // Off-site
    else if (scanstatuses.value == "Off-site")
    {
      document.querySelector("#check-in").style.display = "none";
      document.querySelector("#check-out").style.display = "block";
      document.querySelector("#check-in").type = "button";

      if (scanstatuses.value != "Status" && scanoslinput.value != "" && scanpoc.value != "" && scanpn.value != "" && scanfirstname.value != "" && scanlastname.value != "")
      {
        document.querySelector("#check-out").type = "submit";
      }
      else 
      {
        document.querySelector("#check-out").type = "button";
      }
      
    }

  });

  // Code for specifically formatting selections for off and on site statuses

  document.querySelector("#changestatus").addEventListener('change', function(e) {
    
    scanrfn = scanrfn
    scanrln = scanrln
    scanstatuses = scanstatuses
    scandepti =  scandepti
    scanroomi = scanroomi
    scanarray_onsitei = [scanstatuses, scandepti, scanroomi];
    scandepts =  scandepts
    scanrooms = scanrooms
    scanarray_onsites = [scanstatuses, scandepts, scanrooms];
    scanoslinput = scanoslinput
    scanarray_offsitei = [scanstatuses, scanoslinput, scanpoc, scanpn, scanfirstname, scanlastname];
    scanoslselect = scanoslselect
    scanpoc = scanpoc
    scanpn = scanpn
    scanfirstname = scanfirstname
    scanlastname = scanlastname
    scanarray_offsites = [scanstatuses, scanoslselect, scanpoc, scanpn, scanfirstname, scanlastname];

    // In use, storage, replace and replaced
    if (scanstatuses.value == "In Use" || scanstatuses.value == "Storage" || scanstatuses.value == "Replace" || scanstatuses.value == "Replaced")
    {
      document.querySelector("#check-in").style.display = "block";
      document.querySelector("#check-out").style.display = "none";
      document.querySelector("#check-out").type = "button";

      // Recipient yes
      if (document.querySelector("#recipientSelect").value == "Yes")
      {
        if (scanarray_onsitei[1].value == "" && scanarray_onsitei[2].value == "")
        {
          if (scanarray_onsites[0].value != "Status" & scanarray_onsites[1].value != "Department" & scanarray_onsites[2].value != "Room" & scanrfn.value != "" & scanrln.value != "") 
          {
            document.querySelector("#check-in").type = "submit";
          }
          else
          {
            document.querySelector("#check-in").type = "button";
          }
        }
      }

      // Recipient no
      else if (document.querySelector("#recipientSelect").value == "No")
      {
        if (scanarray_onsitei[1].value == "" && scanarray_onsitei[2].value == "")
        {
          if (scanarray_onsites[0].value != "Status" & scanarray_onsites[1].value != "Department" & scanarray_onsites[2].value != "Room") 
          {
            document.querySelector("#check-in").type = "submit";
          }
          else
          {
            document.querySelector("#check-in").type = "button";
          }
        }
      }

    }

    // Loaned and out for repair
    else if (scanstatuses.value == "Loaned" || scanstatuses.value == "Out for Repair")
    {
      document.querySelector("#check-in").style.display = "none";
      document.querySelector("#check-out").style.display = "block";
      document.querySelector("#check-in").type = "button";

      // Recipient yes
      if (document.querySelector("#recipientSelect").value == "Yes")
      {
        if (scanarray_onsitei[1].value == "" && scanarray_onsitei[2].value == "")
        {
          if (scanarray_onsites[0].value != "Status" && scanarray_onsites[1].value != "Department" && scanarray_onsites[2].value != "Room" && scanrfn.value != "" && scanrln.value != "") 
          {
            document.querySelector("#check-out").type = "submit";
          }
          else
          {
            document.querySelector("#check-out").type = "button";
          }
        }
      }

      // Recipient no
      else if (document.querySelector("#recipientSelect").value == "No")
      {
        if (scanarray_onsitei[1].value == "" || scanarray_onsitei[2].value == "")
        {
          if (scanarray_onsites[0].value != "Status" && scanarray_onsites[1].value != "Department" && scanarray_onsites[2].value != "Room") 
          {
            document.querySelector("#check-out").type = "submit";
          }
          else
          {
            document.querySelector("#check-out").type = "button";
          }
        }
      }
    }

    // Off-site
    else if (scanstatuses.value == "Off-site")
    {
      document.querySelector("#check-in").style.display = "none";
      document.querySelector("#check-out").style.display = "block";
      document.querySelector("#check-in").type = "button";

      if (scanarray_offsitei[1].value == "")
      {
        if (scanstatuses.value != "Status" && scanoslselect.value != "Off-site Location" && scanpoc.value != "" && scanpn.value != "" && scanfirstname.value != "" && scanlastname.value != "")
        {
          document.querySelector("#check-out").type = "submit";
        }
        else 
        {
          document.querySelector("#check-out").type = "button";
        }
      }
      
    }

  });

  // Removes all data upon cancelation.
  document.querySelector("#cancel-change-status").addEventListener('click', function(e){ 

    scanrfn.value = ""
    scanrln.value = ""
    scanstatuses.value = "Status"
    scandepti.value = ""
    scanroomi.value = ""
    scandepts.value = "Department"
    scanrooms.value = "Room"
    scanrooms.disabled = true
    scanoslinput = ""
    scanoslselect = "Off-site Location"
    scanpoc = ""
    scanpn = ""
    scanfirstname = ""
    scanlastname = ""
    document.querySelector("#scanned-qr-codes").innerHTML = ""

    fieldcat[0].style.display = "block"
    fieldcat[1].style.display = "block"
    fieldcat[2].style.display = "none"
    fieldcat[3].style.display = "none"
    fieldcat[4].style.display = "none"
    fieldcat[5].style.display = "none"
    fieldcat[6].style.display = "none"
    scanoslinput.value = ""
    scanoslselect.value = "Off-site Location"
    scanpoc.value = ""
    scanpn.value = ""
    scanfirstname.value = ""
    scanlastname.value = ""

  });

  // Removes all data if user switches between scan or bulk scan

  document.querySelector("#startscan").addEventListener("click", function() {
    
    scanrfn.value = ""
    scanrln.value = ""
    scanstatuses.value = "Status"
    scandepti.value = ""
    scanroomi.value = ""
    scandepts.value = "Department"
    scanrooms.value = "Room"
    scanrooms.disabled = true
    scanoslinput = ""
    scanoslselect = "Off-site Location"
    scanpoc = ""
    scanpn = ""
    scanfirstname = ""
    scanlastname = ""
    document.querySelector("#scanned-qr-codes").innerHTML = ""

  })

  document.querySelector("#start-bulk-scan").addEventListener("click", function() {

    scanrfn.value = ""
    scanrln.value = ""
    scanstatuses.value = "Status"
    scandepti.value = ""
    scanroomi.value = ""
    scandepts.value = "Department"
    scanrooms.value = "Room"
    scanrooms.disabled = true
    scanoslinput = ""
    scanoslselect = "Off-site Location"
    scanpoc = ""
    scanpn = ""
    scanfirstname = ""
    scanlastname = ""
    document.querySelector("#scanned-qr-codes").innerHTML = ""

  })

  document.querySelector("#stopscan").addEventListener("click", function() {

    scanrfn.value = ""
    scanrln.value = ""
    scanstatuses.value = "Status"
    scandepti.value = ""
    scanroomi.value = ""
    scandepts.value = "Department"
    scanrooms.value = "Room"
    scanrooms.disabled = true
    scanoslinput = ""
    scanoslselect = "Off-site Location"
    scanpoc = ""
    scanpn = ""
    scanfirstname = ""
    scanlastname = ""
    document.querySelector("#scanned-qr-codes").innerHTML = ""

  })

  document.querySelector("#check-in").addEventListener("click", function(e){

    if (document.querySelector("#check-in").type == "button")
    {
      document.querySelector(".modal-footer").querySelector(".emptywarning").style.display = "inline-block";
    }

  });

  document.querySelector("#check-out").addEventListener("click", function(e){

    if (document.querySelector("#check-out").type == "button")
    {
      document.querySelector(".modal-footer").querySelector(".emptywarning").style.display = "inline-block";
    }

  });

  document.addEventListener('mouseover', function(e){ 

    if (!(document.querySelector("#check-in").contains(e.target) || (document.querySelector("#check-out").contains(e.target))))
    {
      document.querySelector(".modal-footer").querySelector(".emptywarning").style.display = "none";
    }

  });

  document.getElementById('phone_number').addEventListener('focusout', function(e) {
    e.target.value = formatPhoneNumber(e.target.value);
  });

  function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

}

// Code for input formatting for users

if (document.querySelector(".adduser"))
{
  if (document.querySelector("#user_role"))
  {
    var userRole = document.querySelector("#user_role").value;
  }

  var first_name = document.querySelector("#first_name").value;
  var last_name = document.querySelector("#last_name").value;
  var email = document.querySelector("#email").value;
  var password= document.querySelector("#password").value;
  var confirmation = document.querySelector("#confirmation").value;
  var adduser = [first_name, last_name, email, password, confirmation];

  document.querySelector(".addbutton").addEventListener('click', function(e){ 

    document.querySelector("#confirmuser").type = "button";
  
  }); 

  document.querySelector("#add-user-modal").addEventListener('input', function(e){ 

    if (document.querySelector("#user_role"))
    {
      userRole = document.querySelector("#user_role").value;
    }
      
    first_name = document.querySelector("#first_name").value;
    last_name = document.querySelector("#last_name").value;
    email = document.querySelector("#email").value;
    password= document.querySelector("#password").value;
    confirmation = document.querySelector("#confirmation").value;
    adduser = [first_name, last_name, email, password, confirmation];

    if (password != confirmation)
    {
      document.querySelector("#nomatch").style.display = "inline-block";
    }
    else 
    {
      document.querySelector("#nomatch").style.display = "none";
    }

    for (let i = 0; i < adduser.length; i++)
    {
      if (adduser[i] === "")
      {
        document.querySelector("#confirmuser").type = "button";
        break;
      }
      else if (adduser[adduser.length - 1])
      {
        if (document.querySelector("#nomatch").style.display != "inline-block")
        {
          if (document.querySelector("#user_role"))
          {
            if (userRole != "User Role")
            {
              document.querySelector("#confirmuser").type = "submit";
            }
          }
          else 
          {
            document.querySelector("#confirmuser").type = "submit";
          }
        }
        else if (document.querySelector("#nomatch").style.display == "inline-block")
        {
          document.querySelector("#confirmuser").type = "button";
        }
      }
    }

  });

  if (document.querySelector("#user_role"))
  {
    document.querySelector("#user_role").addEventListener('change', function(e){ 

      userRole = document.querySelector("#user_role").value;
  
      if (userRole != "User Role")
      {
          if (password != confirmation)
        {
          document.querySelector("#nomatch").style.display = "inline-block";
        }
        else 
        {
          document.querySelector("#nomatch").style.display = "none";
        }
  
        for (let i = 0; i < adduser.length; i++)
        {
          if (adduser[i] === "")
          {
            document.querySelector("#confirmuser").type = "button";
            break;
          }
          else if (adduser[adduser.length - 1])
          {
            if (document.querySelector("#nomatch").style.display != "inline-block")
            {
              document.querySelector("#confirmuser").type = "submit";
            }
            else if (document.querySelector("#nomatch").style.display == "inline-block")
            {
              document.querySelector("#confirmuser").type = "button";
            }
          }
        }
      }
      else if (userRole == "User Role")
      {
        document.querySelector("#confirmuser").type = "button";
      }
    
    });
  }

  document.querySelector("#cancelconfirmuser").addEventListener('click', function(e){ 

    document.querySelector("#first_name").value = "";
    document.querySelector("#last_name").value = "";
    document.querySelector("#email").value = "";
    document.querySelector("#password").value = "";
    document.querySelector("#confirmation").value = "";
    document.querySelector("#nomatch").style.display = "none";

  });

  document.querySelector("#confirmuser").addEventListener("click", function(e){

    if (document.querySelector("#confirmuser").type == "button")
    {
      for (let i = 0; i < adduser.length; i++)
      {
        if (adduser[i] === "")
        {
          document.querySelector(".modal-footer").querySelector(".emptywarning").style.display = "inline-block";
          break;
        }
        else if (adduser[adduser.length - 1])
        {
          document.querySelector(".modal-footer").querySelector(".emptywarning").style.display = "none";
        }
      }
    }

  });

  document.addEventListener('mouseover', function(e){ 

    if (!(document.querySelector("#confirmuser").contains(e.target)))
    {
      document.querySelector(".modal-footer").querySelector(".emptywarning").style.display = "none";
    }

  });

  // Code to prevent confirming deletion without selection for users

  if (document.getElementsByName("deluser") && document.querySelector("#confirmdel"))
  {
    var deluser = document.getElementsByName("deluser")

    document.querySelector("#confirmdel").addEventListener("click", function(e) {

      for (let i = 0; i < deluser.length; i++)
      {
        if (deluser[i].checked == false)
        {
          document.querySelector("#completedel").type = "button";
        }
        else if (deluser[i].checked == true)
        {
          document.querySelector("#completedel").type = "submit";
          break;
        }
      }

      document.querySelector("#completedel").addEventListener("click", function(e) {

        if (document.querySelector("#completedel").type == "button")
        {
          document.querySelector(".emptyselection").style.display = "inline-block";
        }
          
      });

      document.addEventListener("mouseover", function(e) {

        if (!(document.querySelector("#completedel").contains(e.target)))
        {
          document.querySelector(".emptyselection").style.display = "none";
        }

      });
    });
  }
}

// Code to switch between inventory categories

if (document.querySelector(".additem") || document.querySelector(".replaceitem") || document.querySelector(".offsiteitem") || document.querySelector(".missingitem") || document.querySelector(".userview") 
|| document.querySelector(".inventory-archive"))
{

  var openselect = document.getElementById("open-inv-select")

  openselect.addEventListener("click", function() {

    if (document.getElementById("invcatselect").style.display == "none")
    {
      document.getElementById("invcatselect").style.display = "block"
    }
    else if (document.getElementById("invcatselect").style.display == "block")
    {
      document.getElementById("invcatselect").style.display = "none"
    }
    });

    document.addEventListener("click", function(e) {

    if (!(openselect.contains(e.target) || document.getElementById("invcatselect").contains(e.target)))
    {
      document.getElementById("invcatselect").style.display = "none"
    }

    });
}

// Code to switch between item options

if (document.querySelector(".inventory-archive"))
{

  var showInfoOrHistory = document.getElementsByName("show-info-or-history")
  var itemOptionSelect = document.getElementsByClassName("item-option-select")
  var itemOptionButton = document.getElementsByClassName("item-option-button")

  for (let i = 0; i < showInfoOrHistory.length; i++)
  {
    showInfoOrHistory[i].addEventListener("click", function() {

      if (itemOptionSelect[i].style.display == "none")
      {
        itemOptionSelect[i].style.display = "flex"
      }
      else if (itemOptionSelect[i].style.display == "flex")
      {
        itemOptionSelect[i].style.display = "none"
      }

      for (let j = 0; j < showInfoOrHistory.length; j++)
      {
        if (itemOptionSelect[j] != itemOptionSelect[i])
        {
          itemOptionSelect[j].style.display = "none"
        }
      }

    })
  }

  for (let i = 0, j = 0; i < itemOptionButton.length; i++)
  {
    itemOptionButton[i].addEventListener("click", function() {

      if (i != 0)
      {
        if (i == 1)
        {
          j = 1;
        }
        else if (i % 2 == 0)
        {
          j = i / 2;
        }
        else if (i % 2 == 1)
        {
          j = Math.round(i / 2);
        }
      }

      itemOptionSelect[i - j].style.display = "none";

    })
  }

}

// Code to show chosen file for upload inventory and prevent uploading without file selection

if (document.querySelector(".uploaditem"))
{
  var uploadFile = document.getElementById('upload-file');
  var chosenFile = document.getElementById('chosen-file');
  var completeupload = document.getElementById('completeupload');

  uploadFile.addEventListener('change', function() {
    
    if (!(this.files[0]))
    {
      chosenFile.textContent = "No file chosen"
      completeupload.type = "button"
    }
    else
    {
      chosenFile.textContent = this.files[0].name
      completeupload.type = "submit"
    }
  })

  completeupload.addEventListener('click', function() {

    if (completeupload.type == "button")
    {
      document.querySelector(".emptywarning").style.display = "block"
    }

  })

  document.addEventListener("mouseover", function(e) {

    if (!(completeupload.contains(e.target)))
    {
      document.querySelector(".emptywarning").style.display = "none"
    }

  })
}

// Code to populate filter selection

if (document.querySelector(".tboundary"))
{
  if (document.querySelector(".additem") || document.querySelector(".replaceitem") || document.querySelector(".replaceditem") || document.querySelector(".offsiteitem") || document.querySelector(".missingitem")  
  || document.querySelector(".userview") || document.querySelector(".inventory-archive"))
  {
    if (document.querySelector(".offsiteitem"))
    {

      var filterdefault = ["Equipment", "Model", "Serial", "EE", "Off-site Location", "Scanned By", "Received By", "Action", "Point of Contact", "Phone Number", "Patient Name", "Added By"];

    }
    else if (document.querySelector(".missingitem"))
    {
      var filterdefault = ["Equipment", "Model", "Serial", "EE", "Assigned Location", "Location", "Department", "Room", "Current Location", "Location", "Department", "Room", "Off-site Location", 
      "Scanned By", "Received By", "Action", "Point of Contact", "Phone Number", "Patient Name", "Added By"];
    }
    else if (document.querySelector(".additem") || document.querySelector(".userview"))
    {
      var filterdefault = ["Equipment", "Model", "Serial", "EE", "Assigned Location", "Location", "Department", "Room", "Current Location", "Location", "Department", "Room", "Off-site Location", "Status", 
      "Scanned By", "Received By", "Action", "Added By"];
    }
    else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem") )
    {
      var filterdefault = ["Equipment", "Model", "Serial", "EE", "Assigned Location", "Location", "Department", "Room", "Current Location", "Location", "Department", "Room", 
      "Scanned By", "Received By", "Action", "Added By"];
    }
    else if (document.querySelector(".inventory-archive"))
    {
      var filterdefault = ["Equipment", "Model", "Serial", "EE", "Assigned Location", "Location", "Department", "Room", "Added By"];
    }

    var filterbutton = document.getElementsByClassName("filterbutton");
    var filterButtonDate = document.getElementsByClassName("filterButtonDate");
    var filterselect = document.getElementsByName("filter");
    var filterDateSelect = document.getElementsByName("filterdate");
    var date_label = document.getElementsByClassName("date-label");
    var filterDateDefault = ["", "", "", "", "", ""];
    var filterDateDefaultArchive = ["", "", "", ""];

    var filterStoreTemp = filterselect;

    // Code to remove all filter option duplicates

    for (let i = 0; i < filterselect.length; i++)
    {
      for (let k = 0; k < filterselect[i].children.length; k++)
      {
        for (let l = k + 1; l < filterselect[i].children.length; l++)
        {
          if (filterselect[i].children[k].value == filterStoreTemp[i].children[l].value)
          {
            filterStoreTemp[i].removeChild(filterStoreTemp[i].children[l])
            l = 0;
            k = 0
            filterselect[i] = filterStoreTemp[i]
            break;
          }
        }
      }
    }

    // Code to show filters if filter is not set to default and show clear filter button

    for (let i = 0; i < filterselect.length; i++)
    {
      if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".userview"))
      {
        if (i == 4)
        {
          if (filterselect[5].value == "Location" && filterselect[6].value == "Department" && filterselect[7].value == "Room")
          {
            filterselect[4].value = "Assigned Location"
            filterselect[4].style.display = "none"
          }
          else 
          {
            filterselect[i].style.display = "block";
            document.getElementById("clear-filters").style.display = "block"
          }
        }
        else if (i == 8)
        {
          if (filterselect[9].value == "Location" && filterselect[10].value == "Department" && filterselect[11].value == "Room" && filterselect[12].value == "Off-site Location")
          {
            filterselect[8].value = "Current Location"
            filterselect[8].style.display = "none"
          }
          else 
          {
            filterselect[i].style.display = "block";
            document.getElementById("clear-filters").style.display = "block"
          }
        }
        else if (filterselect[i].value != filterdefault[i])
        {
          filterselect[i].style.display = "block";
          document.getElementById("clear-filters").style.display = "block"
        }
      }
      else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem"))
      {
        if (i == 4)
        {
          if (filterselect[5].value == "Location" && filterselect[6].value == "Department" && filterselect[7].value == "Room")
          {
            filterselect[4].value = "Assigned Location"
            filterselect[4].style.display = "none"
          }
          else 
          {
            filterselect[i].style.display = "block";
            document.getElementById("clear-filters").style.display = "block"
          }
        }
        else if (i == 8)
        {
          if (filterselect[9].value == "Location" && filterselect[10].value == "Department" && filterselect[11].value == "Room")
          {
            filterselect[8].value = "Current Location"
            filterselect[8].style.display = "none"
          }
          else 
          {
            filterselect[i].style.display = "block";
            document.getElementById("clear-filters").style.display = "block"
          }
        }
        else if (filterselect[i].value != filterdefault[i])
        {
          filterselect[i].style.display = "block";
          document.getElementById("clear-filters").style.display = "block"
        }
      }
      else if (document.querySelector(".inventory-archive"))
      {
        if (i == 4)
        {
          if (filterselect[5].value == "Location" && filterselect[6].value == "Department" && filterselect[7].value == "Room")
          {
            filterselect[4].value = "Assigned Location"
            filterselect[4].style.display = "none"
          }
          else 
          {
            filterselect[i].style.display = "block";
            document.getElementById("clear-filters").style.display = "block"
          }
        }
        else if (filterselect[i].value != filterdefault[i])
        {
          filterselect[i].style.display = "block";
          document.getElementById("clear-filters").style.display = "block"
        }
      }
      else 
      {   
        if (filterselect[i].value != filterdefault[i])
        {
          filterselect[i].style.display = "block";
          document.getElementById("clear-filters").style.display = "block"
        }
      }
    }

    // Code to show date filters if filter is not set to default and show clear filter button

    for (let i = 0; i < filterDateSelect.length; i++)
    {
      if (filterDateSelect[i].value != filterDateDefault[i])
      {
        filterDateSelect[i].style.display = "block"
        date_label[i].style.display = "block"
        document.getElementById("clear-filters").style.display = "block"
      }
    }

    // Code for user to show/hide filters in assigned location depending on search by filter

    if (!(document.querySelector(".offsiteitem")))
    {
      document.querySelector("#filtersbal").addEventListener("change", function() {

        if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".userview") || document.querySelector(".replaceitem") || document.querySelector(".replaceditem")
        || document.querySelector(".inventory-archive"))
        {
          if (document.querySelector("#filtersbal").value == "Assigned Location")
          {
            document.querySelector("#filteral").style.display = "none"
            document.querySelector("#filterad").style.display = "none"
            document.querySelector("#filterar").style.display = "none"
            document.querySelector("#filteral").value = "Location"
            document.querySelector("#filterad").value = "Department"
            document.querySelector("#filterar").value = "Room"
          }
          else if (document.querySelector("#filtersbal").value == "Location")
          {
            document.querySelector("#filteral").style.display = "block"
            document.querySelector("#filterad").style.display = "none"
            document.querySelector("#filterar").style.display = "none"
            document.querySelector("#filterad").value = "Department"
            document.querySelector("#filterar").value = "Room"
          }
          else if (document.querySelector("#filtersbal").value == "Department")
          {
            document.querySelector("#filteral").style.display = "none"
            document.querySelector("#filterad").style.display = "block"
            document.querySelector("#filterar").style.display = "none"
            document.querySelector("#filteral").value = "Location"
            document.querySelector("#filterar").value = "Room"
          }
          else if (document.querySelector("#filtersbal").value == "Room")
          {
            document.querySelector("#filteral").style.display = "none"
            document.querySelector("#filterad").style.display = "none"
            document.querySelector("#filterar").style.display = "block"
            document.querySelector("#filteral").value = "Location"
            document.querySelector("#filterad").value = "Department"
          }
        } 

      })

      // Code for user to show/hide filters in current location depending on search by filter

      if (!(document.querySelector(".inventory-archive")))
      {
        document.querySelector("#filtersbcl").addEventListener("change", function() {
          
          if ((!(document.querySelector(".offsiteitem"))) || (!(document.querySelector(".inventory-archive"))))
          {
            if (document.querySelector("#filtersbcl").value == "Current Location")
            {
              document.querySelector("#filtercl").style.display = "none"
              document.querySelector("#filtercd").style.display = "none"
              document.querySelector("#filtercr").style.display = "none"
              document.querySelector("#filtercl").value = "Location"
              document.querySelector("#filtercd").value = "Department"
              document.querySelector("#filtercr").value = "Room"
              
              if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".userview"))
              {
                document.querySelector("#filterosl").style.display = "none"
                document.querySelector("#filterosl").value = "Off-site Location"
              }
            }
            else if (document.querySelector("#filtersbcl").value == "Location")
            {
              document.querySelector("#filtercl").style.display = "block"
              document.querySelector("#filtercd").style.display = "none"
              document.querySelector("#filtercr").style.display = "none"
              document.querySelector("#filtercd").value = "Department"
              document.querySelector("#filtercr").value = "Room"
              
              if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".userview"))
              {
                document.querySelector("#filterosl").style.display = "none"
                document.querySelector("#filterosl").value = "Off-site Location"
              }
            }
            else if (document.querySelector("#filtersbcl").value == "Department")
            {
              document.querySelector("#filtercl").style.display = "none"
              document.querySelector("#filtercd").style.display = "block"
              document.querySelector("#filtercr").style.display = "none"
              document.querySelector("#filtercl").value = "Location"
              document.querySelector("#filtercr").value = "Room"
              
              if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".userview"))
              {
                document.querySelector("#filterosl").style.display = "none"
                document.querySelector("#filterosl").value = "Off-site Location"
              }
            }
            else if (document.querySelector("#filtersbcl").value == "Room")
            {
              document.querySelector("#filtercl").style.display = "none"
              document.querySelector("#filtercd").style.display = "none"
              document.querySelector("#filtercr").style.display = "block"
              document.querySelector("#filtercl").value = "Location"
              document.querySelector("#filtercd").value = "Department"

              if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".userview"))
              {
                document.querySelector("#filterosl").style.display = "none"
                document.querySelector("#filterosl").value = "Off-site Location"
              }
            }
            if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".userview"))
            {
              if (document.querySelector("#filtersbcl").value == "Off-site Location")
              {
                document.querySelector("#filtercl").style.display = "none"
                document.querySelector("#filtercd").style.display = "none"
                document.querySelector("#filtercr").style.display = "none"
                document.querySelector("#filterosl").style.display = "block"
                document.querySelector("#filtercl").value = "Location"
                document.querySelector("#filtercd").value = "Department"
                document.querySelector("#filtercr").value = "Room"
              }
            }
          } 

        })
      }
    }

    // Code to allow user show/hide filters
    
    for (let i = 0; i < filterbutton.length; i++)
    {
      filterbutton[i].addEventListener("click", function() {

        if (!(document.querySelector(".offsiteitem")))
        {
          if (i == 4)
          {
            if (filterselect[4].style.display == "none")
            {
              filterselect[4].style.display = "block"
              
              if (document.querySelector("#filtersbal").value == "Assigned Location")
              {
                document.querySelector("#filteral").style.display = "none"
                document.querySelector("#filterad").style.display = "none"
                document.querySelector("#filterar").style.display = "none"
              }
              if (document.querySelector("#filtersbal").value == "Location")
              {
                document.querySelector("#filteral").style.display = "block"
                document.querySelector("#filterad").style.display = "none"
                document.querySelector("#filterar").style.display = "none"
              }
              else if (document.querySelector("#filtersbal").value == "Department")
              {
                document.querySelector("#filteral").style.display = "none"
                document.querySelector("#filterad").style.display = "block"
                document.querySelector("#filterar").style.display = "none"
              }
              else if (document.querySelector("#filtersbal").value == "Room")
              {
                document.querySelector("#filteral").style.display = "none"
                document.querySelector("#filterad").style.display = "none"
                document.querySelector("#filterar").style.display = "block"
              }
            }
            else if (filterselect[4].style.display == "block")
            {
              filterselect[4].style.display = "none"
              filterselect[5].style.display = "none"
              filterselect[6].style.display = "none"
              filterselect[7].style.display = "none"
            }
          }
          else if ((!(document.querySelector(".inventory-archive"))) && i == 5)
          {
            if (filterselect[8].style.display == "none")
            {

              filterselect[8].style.display = "block"

              if (document.querySelector("#filtersbcl").value == "Current Location")
              {
                document.querySelector("#filtercl").style.display = "none"
                document.querySelector("#filtercd").style.display = "none"
                document.querySelector("#filtercr").style.display = "none"
                
                if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".userview"))
                {
                  document.querySelector("#filterosl").style.display = "none"
                }
              }
              else if (document.querySelector("#filtersbcl").value == "Location")
              {
                document.querySelector("#filtercl").style.display = "block"
                document.querySelector("#filtercd").style.display = "none"
                document.querySelector("#filtercr").style.display = "none"

                if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".userview"))
                {
                  document.querySelector("#filterosl").style.display = "none"
                }
              }
              else if (document.querySelector("#filtersbcl").value == "Department")
              {
                document.querySelector("#filtercl").style.display = "none"
                document.querySelector("#filtercd").style.display = "block"
                document.querySelector("#filtercr").style.display = "none"

                if (document.querySelector(".additem") || document.querySelector(".missingitem"))
                {
                  document.querySelector("#filterosl").style.display = "none"
                }
              }
              else if (document.querySelector("#filtersbcl").value == "Room")
              {
                document.querySelector("#filtercl").style.display = "none"
                document.querySelector("#filtercd").style.display = "none"
                document.querySelector("#filtercr").style.display = "block"

                if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".userview"))
                {
                  document.querySelector("#filterosl").style.display = "none"
                }
              }
              else if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".userview"))
              {
                document.querySelector("#filtercl").style.display = "none"
                document.querySelector("#filtercd").style.display = "none"
                document.querySelector("#filtercr").style.display = "none"
                document.querySelector("#filterosl").style.display = "block"
              }
            }
            else if (filterselect[8].style.display == "block")
            {
              filterselect[8].style.display = "none"
              filterselect[9].style.display = "none"
              filterselect[10].style.display = "none"
              filterselect[11].style.display = "none"
              
              if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".userview"))
              {
                filterselect[12].style.display = "none"
              }
            }
          }
          else if (((!(document.querySelector(".replaceitem"))) && (!(document.querySelector(".replaceditem")))) && (!(document.querySelector(".inventory-archive"))))
          {
            if (i > 5)
            {
              if (filterselect[i + 7].style.display == "none")
              {
                filterselect[i + 7].style.display = "block"
              }
              else if (filterselect[i + 7].style.display == "block")
              {
                filterselect[i + 7].style.display = "none"
              }
            }
            else 
            {
              if (filterselect[i].style.display == "none")
              {
                filterselect[i].style.display = "block"
              }
              else if (filterselect[i].style.display == "block")
              {
                filterselect[i].style.display = "none"
              }
            }
          }
          else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem"))
          {
            if (i > 5)
            {
              if (filterselect[i + 6].style.display == "none")
              {
                filterselect[i + 6].style.display = "block"
              }
              else if (filterselect[i + 6].style.display == "block")
              {
                filterselect[i + 6].style.display = "none"
              }
            }
            else 
            {
              if (filterselect[i].style.display == "none")
              {
                filterselect[i].style.display = "block"
              }
              else if (filterselect[i].style.display == "block")
              {
                filterselect[i].style.display = "none"
              }
            }
          }
          else if (document.querySelector(".inventory-archive"))
          {
            if (i > 4)
            {
              if (filterselect[i + 3].style.display == "none")
              {
                filterselect[i + 3].style.display = "block"
              }
              else if (filterselect[i + 3].style.display == "block")
              {
                filterselect[i + 3].style.display = "none"
              }
            }
            else 
            {
              if (filterselect[i].style.display == "none")
              {
                filterselect[i].style.display = "block"
              }
              else if (filterselect[i].style.display == "block")
              {
                filterselect[i].style.display = "none"
              }
            }
          }
          else 
          {
            if (filterselect[i].style.display == "none")
            {
              filterselect[i].style.display = "block"
            }
            else if (filterselect[i].style.display == "block")
            {
              filterselect[i].style.display = "none"
            }
          }
        }
        else if (document.querySelector(".offsiteitem"))
        {
          
          if (filterselect[i].style.display == "none")
          {
            filterselect[i].style.display = "block"
          }
          else if (filterselect[i].style.display == "block")
          {
            filterselect[i].style.display = "none"
          }
          
        }
      });
    }

    // Code to allow user show/hide filters for date inputs

    for (let i = 0, j = 0, k = 0; i < filterButtonDate.length; i++)
    {
      filterButtonDate[i].addEventListener("click", function() {

        if (i == 0)
        {
          j = 0
          k = 1
        }
        if (i == 1)
        {
          j = 1
          k = 2
        }
        if (i == 2)
        {
          j = 2
          k = 3
        }

        if (filterDateSelect[i + j].style.display == "none")
        {
          filterDateSelect[i + j].style.display = "block";
          filterDateSelect[i + k].style.display = "block";
          date_label[i + j].style.display = "block";
          date_label[i + k].style.display = "block";
        }
        else if (filterDateSelect[i + j].style.display == "block")
        {
          filterDateSelect[i + j].style.display = "none";
          filterDateSelect[i + k].style.display = "none";
          date_label[i + j].style.display = "none";
          date_label[i + k].style.display = "none";
        }

      });
    }

    // Code to allow users to clear all filters

    if (document.getElementById("clear-filters"))
    {
      document.getElementById("clear-filters").addEventListener("click", function() {

        for (let i = 0; i < filterselect.length; i++)
        {
          if (filterselect[i] != filterdefault[i])
          {
            filterselect[i].value = filterdefault[i]
          }
        }

        if (!(document.querySelector(".inventory-archive")))
        {
          for (let i = 0; i < filterDateSelect.length; i++)
          {
            if (filterDateSelect[i] != filterDateDefault[i])
            {
              filterDateSelect[i].value = filterDateDefault[i]
            }
          }
        }
        else
        {
          for (let i = 0; i < filterDateSelect.length; i++)
          {
            if (filterDateSelect[i] != filterDateDefaultArchive[i])
            {
              filterDateSelect[i].value = filterDateDefaultArchive[i]
            }
          }
        }

        document.getElementById("filterform").submit();

      });
    }

    // Code to submit filter selections

    for (let i = 0; i < filterselect.length; i++)
    {
      filterselect[i].addEventListener("change", function() {
      
        if (!(document.querySelector(".inventory-archive")))
        {
          var startDateDoa = document.getElementById("filter-start-doa").value;
          var endDateDoa = document.getElementById("filter-end-doa").value;
        }

        var startDateDa = document.getElementById("filter-start-da").value;
        var endDateDa = document.getElementById("filter-end-da").value;
        var startDateRd = document.getElementById("filter-start-rd").value;
        var endDateRd = document.getElementById("filter-end-rd").value;
      
        if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".userview") || document.querySelector(".replaceitem") || document.querySelector(".replaceditem")
        || document.querySelector(".offsiteitem"))
        {
          if (((startDateDoa == "" || endDateDoa == "") && (startDateDa == "" || endDateDa == "") && (startDateRd == "" || endDateRd == "")) 
          || ((startDateDoa != "" && endDateDoa != "") || (startDateDa != "" && endDateDa != "") || (startDateRd != "" && endDateRd != "")))
          {
            if ((startDateDoa == "" && endDateDoa != "") || (startDateDa == "" && endDateDa != "") || (startDateRd == "" && endDateRd != ""))
            {
              document.getElementById("filterform").submit();
            }
            if ((startDateDoa != "" && endDateDoa == "") || (startDateDa != "" && endDateDa == "") || (startDateRd != "" && endDateRd == ""))
            {
              document.getElementById("filterform").submit();
            }
            else if ((endDateDoa < startDateDoa) || (endDateDa < startDateDa) || (endDateRd < startDateRd))
            {
              alert("Start date must be a date before or the same as end date.")
            }
            else 
            {
              if (i == 4 || i == 8)
              {
                if (filterselect[i].value == "Assigned Location" || filterselect[i].value == "Current Location")
                {
                  document.getElementById("filterform").submit();
                }
              }
              else 
              {
                document.getElementById("filterform").submit();
              }
            }
          }
        }
        else if (document.querySelector(".inventory-archive"))
        {
          if (((startDateDa == "" || endDateDa == "") && (startDateRd == "" || endDateRd == "")) || ((startDateDa != "" && endDateDa != "") || (startDateRd != "" && endDateRd != "")))
          {
            if ((startDateDa == "" && endDateDa != "") || (startDateRd == "" && endDateRd != ""))
            {
              document.getElementById("filterform").submit();
            }
            if ((startDateDa != "" && endDateDa == "") || (startDateRd != "" && endDateRd == ""))
            {
              document.getElementById("filterform").submit();
            }
            else if ((endDateDa < startDateDa) || (endDateRd < startDateRd))
            {
              alert("Start date must be a date before or the same as end date.")
            }
            else 
            {
              if (i == 4)
              {
                if (filterselect[i].value == "Assigned Location")
                {
                  document.getElementById("filterform").submit();
                }
              }
              else 
              {
                document.getElementById("filterform").submit();
              }
            }
          }
        }
      });
    }

    // Code to submit filters if date input

    for (let i = 0; i < filterDateSelect.length; i++)
    {
      filterDateSelect[i].addEventListener("change", function() {
      
        if (!(document.querySelector(".inventory-archive")))
        {
          var startDateDoa = document.getElementById("filter-start-doa").value;
          var endDateDoa = document.getElementById("filter-end-doa").value;
        }

        var startDateDa = document.getElementById("filter-start-da").value;
        var endDateDa = document.getElementById("filter-end-da").value;
        var startDateRd = document.getElementById("filter-start-rd").value;
        var endDateRd = document.getElementById("filter-end-rd").value;
      
        if (!(document.querySelector(".inventory-archive")))
        {
          if ((startDateDoa != "" && endDateDoa != "") || (startDateDa != "" && endDateDa != "") || (startDateRd != "" && endDateRd != ""))
          {
            if (i == 0 || i == 2 || i == 4)
            {
              if (filterDateSelect[i + 1].value != "")
              {
                if ((filterDateSelect[i + 1].value < filterDateSelect[i].value))
                {
                  alert("Start date must be a date before or the same as end date.")
                }
                else
                {
                  if (filterDateSelect[i].value != "")
                  {
                    document.getElementById("filterform").submit();
                  }
                }
              } 
            }   
            else if (i == 1 || i == 3 || i == 5)
            {
              if (filterDateSelect[i].value != "")
              {
                if ((filterDateSelect[i].value < filterDateSelect[i - 1].value))
                {
                  alert("Start date must be a date before or the same as end date.")
                }
                else
                { 
                  if (filterDateSelect[i - 1].value != "")
                  {
                    document.getElementById("filterform").submit();
                  }
                }
              } 
            }
          }
        }
        else 
        {
          if ((startDateDa != "" && endDateDa != "") || (startDateRd != "" && endDateRd != ""))
          {
            if (i == 0 || i == 2 || i == 4)
            {
              if (filterDateSelect[i + 1].value != "")
              {
                if ((filterDateSelect[i + 1].value < filterDateSelect[i].value))
                {
                  alert("Start date must be a date before or the same as end date.")
                }
                else
                {
                  if (filterDateSelect[i].value != "")
                  {
                    document.getElementById("filterform").submit();
                  }
                }
              } 
            }   
            else if (i == 1 || i == 3)
            {
              if (filterDateSelect[i].value != "")
              {
                if ((filterDateSelect[i].value < filterDateSelect[i - 1].value))
                {
                  alert("Start date must be a date before or the same as end date.")
                }
                else
                { 
                  if (filterDateSelect[i - 1].value != "")
                  {
                    document.getElementById("filterform").submit();
                  }
                }
              } 
            }
          }
        }
      });
    }

  }
}