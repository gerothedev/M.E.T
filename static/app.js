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

// Code for display inventory tools text

if (document.querySelector("#inventory-tools-wrapper"))
{
  var textWidthLimit = 876;
  var toolsTooltip = document.querySelectorAll(".tools-tooltip")
  var tooltipArrow = document.querySelectorAll(".tooltip-arrow")
  var inventoryTools = document.querySelectorAll(".inventory-tools")

  for (let i = 0; i < inventoryTools.length; i++)
  {
    toolsTooltip[i].style.display = "none"
    tooltipArrow[i].style.display = "none"
  }

  if (window.innerWidth > textWidthLimit)
  {
    if (document.querySelector(".additem"))
    {
      document.getElementById("download-all-qr").querySelector("span").textContent = "Download QR Codes";
    }
  
    document.getElementById("show-filter").querySelector("span").textContent = "Filter";
    document.getElementById("hide-filter").querySelector("span").textContent = "Hide Filter";
    document.getElementById("clear-filter").querySelector("span").textContent = "Clear Filter";
    document.getElementById("refresh-page").querySelector("span").textContent = "Refresh Page";
  }
  else
  {
    if (document.querySelector(".additem"))
    {
      document.getElementById("download-all-qr").querySelector("span").textContent = "";
    }
  
    document.getElementById("show-filter").querySelector("span").textContent = "";
    document.getElementById("hide-filter").querySelector("span").textContent = "";
    document.getElementById("clear-filter").querySelector("span").textContent = "";
    document.getElementById("refresh-page").querySelector("span").textContent = "";
  }

  document.querySelector("#inventory-tools-wrapper").addEventListener("mouseover", function(e) {

    if (window.innerWidth <= textWidthLimit)
    {
      for (let i = 0; i < inventoryTools.length; i++)
      {
        if (inventoryTools[i].contains(e.target))
        {
          toolsTooltip[i].style.display = "block"
          tooltipArrow[i].style.display = "block"
        }
        else if (!(inventoryTools[i].contains(e.target)))
        {
          toolsTooltip[i].style.display = "none"
          tooltipArrow[i].style.display = "none"
        }
      }
    }

  })

  document.addEventListener("mouseover", function(e) {

    if (!(document.querySelector("#inventory-tools-wrapper").contains(e.target)))
    {
      for (let i = 0; i < inventoryTools.length; i++)
      {
        toolsTooltip[i].style.display = "none"
        tooltipArrow[i].style.display = "none"
      }
    }

  })


  window.addEventListener('resize', function (e) {

    if (window.innerWidth > textWidthLimit)
    {
      if (document.querySelector(".additem"))
      {
        document.getElementById("download-all-qr").querySelector("span").textContent = "Download QR Codes";
      }
    
      document.getElementById("show-filter").querySelector("span").textContent = "Filter";
      document.getElementById("hide-filter").querySelector("span").textContent = "Hide Filter";
      document.getElementById("clear-filter").querySelector("span").textContent = "Clear Filter";
      document.getElementById("refresh-page").querySelector("span").textContent = "Refresh Page";
    }
    else
    {
      if (document.querySelector(".additem"))
      {
        document.getElementById("download-all-qr").querySelector("span").textContent = "";
      }
    
      document.getElementById("show-filter").querySelector("span").textContent = "";
      document.getElementById("hide-filter").querySelector("span").textContent = "";
      document.getElementById("clear-filter").querySelector("span").textContent = "";
      document.getElementById("refresh-page").querySelector("span").textContent = "";
    }
  
  });
  

}

// Code for fetch requests in Admin inventory 

if (document.querySelector(".additem")) 
{
  var showinfo = document.getElementsByName("showinfo");
  var showhistory = document.getElementsByName("showhistory");
  var img = document.querySelector("#additional-info-qr");
  var showmodal = document.querySelector("#showmodal");
  var moreInfoModal = new bootstrap.Modal(document.getElementById("moreinfo"));
  var showHistoryModal = new bootstrap.Modal(document.getElementById("show-history-modal"));
  var editInfoModal = new bootstrap.Modal(document.getElementById("edit-info-modal"));
  var addInvModal = new bootstrap.Modal(document.getElementById("addInvModal"));
  var editItem = document.getElementById("edit-item");
  var addbutton = document.querySelector(".addbutton");
  var searchFilter = document.getElementById("sf");
  var timeout
  
  getInventoryTable()
  showItemOptions() 

  // Code for search feature

  if (document.querySelector("#insert-inventory-table"))
  {
    searchTool() 
  }
    
  document.querySelector(".additem").addEventListener('click', function(e){
    
    if (document.querySelector(".addbutton").contains(e.target))
    {
      addInvModal.show();
    }

  });

  editItem.addEventListener("click", function() {

      moreInfoModal.hide();
      editInfoModal.show();
      
  });

}

else if (document.querySelector(".user-inventory")) 
{
  var searchFilter = document.getElementById("sf");

  getInventoryTable()
  
  if (document.querySelector("#insert-inventory-table"))
  {
    searchTool() 
  }
}

// Code for fetch requests in off-site items 

else if (document.querySelector(".offsiteitem")) 
{

  if (!(document.querySelector(".user-view")))
  {
    var showinfo = document.getElementsByName("showinfo");
    var showhistory = document.getElementsByName("showhistory");
    var showHistoryModal = new bootstrap.Modal(document.getElementById("show-history-modal"));
    var img = document.querySelector("#additional-info-qr");
    var showmodal = document.querySelector("#showmodal");
    var moreInfoModal = new bootstrap.Modal(document.getElementById("moreinfo"));
  }
  
  getInventoryTable()
  
  if (!(document.querySelector(".user-view")))
  {
    showItemOptions() 
  }
  
  if (document.querySelector("#insert-inventory-table"))
  {
    searchTool() 
  }

}

else if (document.querySelector(".replaceitem")) 
{
  if (!(document.querySelector(".user-view")))
  {
    var showinfo = document.getElementsByName("showinfo");
    var showhistory = document.getElementsByName("showhistory");
    var showHistoryModal = new bootstrap.Modal(document.getElementById("show-history-modal"));
    var img = document.querySelector("#additional-info-qr");
    var showmodal = document.querySelector("#showmodal");
    var moreInfoModal = new bootstrap.Modal(document.getElementById("moreinfo"));
  }
  
  getInventoryTable()

  if (!(document.querySelector(".user-view")))
  {
    showItemOptions() 
  }

  if (document.querySelector("#insert-inventory-table"))
  {
    searchTool() 
  }
}

else if (document.querySelector(".replaceditem")) 
{
  if (!(document.querySelector(".user-view")))
  {
    var showinfo = document.getElementsByName("showinfo");
    var showhistory = document.getElementsByName("showhistory");
    var showHistoryModal = new bootstrap.Modal(document.getElementById("show-history-modal"));
    var img = document.querySelector("#additional-info-qr");
    var showmodal = document.querySelector("#showmodal");
    var moreInfoModal = new bootstrap.Modal(document.getElementById("moreinfo"));
  }
  
  getInventoryTable()

  if (!(document.querySelector(".user-view")))
  {
    showItemOptions() 
  }

  if (document.querySelector("#insert-inventory-table"))
  {
    searchTool() 
  }
}

else if (document.querySelector(".missingitem")) 
{
  if (!(document.querySelector(".user-view")))
  {
    var showinfo = document.getElementsByName("showinfo");
    var showhistory = document.getElementsByName("showhistory");
    var showHistoryModal = new bootstrap.Modal(document.getElementById("show-history-modal"));
    var img = document.querySelector("#additional-info-qr");
    var showmodal = document.querySelector("#showmodal");
    var moreInfoModal = new bootstrap.Modal(document.getElementById("moreinfo"));
  }
  
  getInventoryTable()

  if (!(document.querySelector(".user-view")))
  {
    showItemOptions() 
  }

  if (document.querySelector("#insert-inventory-table"))
  {
    searchTool() 
  }
}

else if (document.querySelector(".inventory-archive")) 
{

  if (!(document.querySelector(".user-view")))
  {
    var showinfo = document.getElementsByName("showinfo");
    var showhistory = document.getElementsByName("showhistory");
    var showHistoryModal = new bootstrap.Modal(document.getElementById("show-history-modal"));
    var img = document.querySelector("#additional-info-qr");
    var showmodal = document.querySelector("#showmodal");
    var moreInfoModal = new bootstrap.Modal(document.getElementById("moreinfo"));
  }
  
  getInventoryTable()

  if (!(document.querySelector(".user-view")))
  {
    showItemOptions() 
  }

  if (document.querySelector("#insert-inventory-table"))
  {
    searchTool() 
  }
}

else if (document.querySelector(".uploaditem"))
{
  getInventoryTable()
}

else if (document.querySelector(".adduser"))
{
  actionButtonToggle()
}

if (document.querySelector('.uploaditem'))
{

  var uploadModal = new bootstrap.Modal(document.getElementById("upload-inventory-modal"));

  document.querySelector('.uploadbutton ').addEventListener("click", function() {

    uploadModal.show()

  })

  document.getElementById('completeupload').addEventListener("click", function() {

    if (document.getElementById('completeupload').type == "submit")
    {

      document.querySelector("#close-upload-x").disabled = true;
      document.querySelector("#upload-file-button").disabled = true;
      document.querySelector("#close-upload").disabled = true;
      var fileInput = document.getElementById('upload-file');
      var data = new FormData();
      data.append("file", fileInput.files[0]);
      
      fetch("upload_inventory_table", {
        "method": "POST",
        "body": data,
      }).then((response) => {
          return response.text();
      }).then((text) => {
        let div = document.createElement("div")
        div.innerHTML = text
        
        if (!(div.querySelector(".apology")))
        {

          document.getElementById("insert-inventory-table").removeChild(document.getElementById("insert-inventory-table").querySelector("#inventory-table"))
          
          if (document.querySelector("#insert-inventory-table"))
          {
            document.getElementById("insert-inventory-table").prepend(div.querySelector("#inventory-table"))
          }
          
          if (document.querySelector(".pages").firstChild)
          {
            document.querySelector(".pages").removeChild(document.querySelector(".pages").firstChild)
          }
          
          tablePagination()
          uploadModal.hide()

          var duplicateFound = document.querySelector(".duplicate-found");

          if (duplicateFound)
          {
              duplicateFound.addEventListener("animationend", function() {
                  duplicateFound.style.display = "none"
              });
          }

          document.getElementById('chosen-file').textContent = "No file chosen";
          document.querySelector("#close-upload-x").disabled = false;
          document.querySelector("#upload-file-button").disabled = false;
          document.querySelector("#close-upload").disabled = false;
          document.querySelector("#completeupload").disabled = false;
          document.querySelector("#completeupload").type = "button";
          document.querySelector(".loading-alert").style.display = "none";
          document.querySelector(".confirm-default-text").style.display = "block";
          fileInput.value = "";


        }
        else if (div.querySelector(".apology"))
        {

          uploadModal.dispose()
          document.querySelector("#main-style").classList.add("main-center-style")
          document.getElementById("main-style").replaceChildren(div.querySelector(".apology"))


        }

      });
    }
  });
}

if (document.querySelector("#refresh-page"))
{
  document.querySelector("#refresh-page").addEventListener("click", function() {
    
    document.querySelector("#search").disabled = true;
    loadingTable()
    disableActionButton()
    submitFilter()

  })
}


// Code for table pagination

function tablePagination()
{
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

      var pageNavButtons = document.getElementsByClassName("page-button")

      for (let i = 0; i < pageNavButtons.length; i++)
      {
        pageNavButtons[i].addEventListener("click", function() {
    
          sort(parseInt(pageNavButtons[i].value))
    
        })
      }
    }

    function pageButtons(pageCount,current) 
    {

      var prevButton = (current == 1) ? "disabled" : "";
      var currbutton = (current == current) ? "disabled" : "";
      var nextButton = (current == pageCount) ? "disabled" : "";
      var buttons = "<li><button class='page-button' value="+(current - 1)+" "+ prevButton +">Previous</button></li>";
      
      if (current % 3 == 1 )
      {
        buttons += "<li><button class='page-button' value="+(current)+" "+ currbutton +">"+ current +"</button></li>";
        
        if (!(current + 1 > pageCount)) 
        {
        buttons += "<li><button class='page-button' value="+(current + 1)+">"+ (current + 1) +"</button></li>";
        }
        if (!(current + 2 > pageCount)) 
        {
        buttons += "<li><button class='page-button' value="+(current + 2)+">"+ (current + 2) +"</button></li>";
        }
      }
      else if (current % 3 == 2 )
      {
        buttons += "<li><button class='page-button' value="+(current - 1)+">"+ (current - 1) +"</button></li>";
        buttons += "<li><button class='page-button' value="+(current)+" "+ currbutton +">"+ current +"</button></li>";
        
        if (current != pageCount) 
        {
        buttons += "<li><button class='page-button' value="+(current + 1)+">"+ (current + 1) +"</button></li>";
        }
      }
      else if (current % 3 == 0 )
      {
        buttons += "<li><button class='page-button' value="+(current - 2)+">"+ (current - 2) +"</button></li>";
        buttons += "<li><button class='page-button' value="+(current - 1)+">"+ (current - 1) +"</button></li>";
        buttons += "<li><button class='page-button' value="+(current)+" "+ currbutton +">"+ current +"</button></li>";
      }

      buttons += "<li><button class='page-button' value="+(current + 1)+" "+ nextButton +">Next</button></li>";
      return buttons;
      
    } 
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

// Code to toggle visibility of checkboxes for deleting users and items from inventory

if (document.querySelector(".additem") || document.querySelector(".adduser"))
{
  if (document.querySelector("#insert-action-menu"))
  {

    if (document.querySelector(".adduser"))
    {
      var deleteinventory = document.getElementsByClassName("deleteuser")
    }
    else if (document.querySelector(".additem"))
    {
      var deleteinventory = document.getElementsByClassName("deleteinventory")
    }

    document.querySelector("#insert-action-menu").addEventListener('click', function(e){ 

      if (document.querySelector(".delbutton"))
      {
        if (document.querySelector(".delbutton").contains(e.target))
        {
          document.querySelector(".delbutton").style.display = "none";
          document.querySelector("#confirmdel").style.display = "inline-block";
          
          for (let i = 0; i < deleteinventory.length; i++)
          {
            deleteinventory[i].style.display = "inline-block";
          }
        }
      }

    });

    if (document.querySelector("#moreinfo"))
    {
      document.querySelector("#moreinfo").addEventListener("click", function(e) {
        
        if (document.querySelector("#delete-item").contains(e.target))
        {
          for (let i = 0; i < deleteinventory.length; i++)
          { 
            deleteinventory[i].style.display = "none";
            deleteinventory[i].checked = false;
          }

          document.querySelector("#confirmdel").style.display = "none";
          document.querySelector(".action-menu-button").style.display = "block";
          document.querySelector("#completedel").type = "sumbit"
          document.querySelector("#completedel").value = "delete-single-item" ;
        }

      });
    }

    document.querySelector("#closedel").addEventListener('click', function(e){ 

      document.querySelector(".delbutton").style.display = "inline-block";
      document.querySelector("#confirmdel").style.display = "none";

      for (let i = 0; i < deleteinventory.length; i++)
      {
        deleteinventory[i].style.display = "none";
        deleteinventory[i].checked= false;
      }

    });

    // Code to prevent confirming deletion without selection from inventory

    if (document.querySelector(".additem"))
    {
      document.querySelector("#insert-action-menu").addEventListener('click', function(e) { 
        
        if (document.querySelector("#confirmdel"))
        {
          if (document.querySelector("#confirmdel").contains(e.target))
          {

            document.querySelector("#completedel").value = "delete" ;
            var delinv = document.getElementsByName("delinv")

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
          }
        }

      });

      if (document.querySelector("#delete-items-modal"))
      {
        document.querySelector("#delete-items-modal").addEventListener('click', function(e) { 

          if (document.querySelector("#completedel").contains(e.target))
          {
            var emptyselection = document.querySelectorAll(".emptyselection");

            if (document.querySelector("#completedel").type == "button")
            {
              for (let i = 0; i < emptyselection.length; i++)
              {
                emptyselection[i].style.display = "block";
              }
            }
          }

        });
      }

      document.addEventListener("mouseover", function(e) {

        if (!(document.querySelector("#completedel").contains(e.target)))
        {
          for (let i = 0; i < emptyselection.length; i++)
          {
            emptyselection[i].style.display = "none";
          }
        }

      });
    }

    // Code to prevent confirming deletion without selection for users

    if (document.querySelector(".adduser"))
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
            document.querySelector(".emptyselection").style.display = "block";
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
}

// Code for sending items to replace page

if (document.querySelector(".additem"))
{
  if (document.querySelector("#insert-action-menu"))
  {
    var replaceinventory = document.getElementsByClassName("replaceinventory")

    if (document.querySelector(".navpages"))
    {
      var togglenav = document.querySelector(".pages").firstElementChild.children
    }

    document.querySelector("#insert-action-menu").addEventListener("click", function(e) {
    
      if (document.querySelector(".replacebutton"))
      {
        if (document.querySelector(".replacebutton").contains(e.target))
        {
          document.querySelector(".replacebutton").style.display = "none";
          document.querySelector("#confirmreplace").style.display = "inline-block";
          
          for (let i = 0; i < replaceinventory.length; i++)
          {
            replaceinventory[i].style.display = "inline-block";
          }

        }
      }

    });

    document.querySelector("#moreinfo").addEventListener("click", function(e) {
      
      if (document.querySelector("#single-item-replace").contains(e.target))
      {
        for (let i = 0; i < replaceinventory.length; i++)
        { 
          replaceinventory[i].style.display = "none";
          replaceinventory[i].checked = false;
        }

        document.querySelector("#confirmreplace").style.display = "none";
        document.querySelector(".action-menu-button").style.display = "block";
        document.querySelector("#completereplace").type = "sumbit"
        document.querySelector("#completereplace").value = "replace-single-item" ;
      }

    });

    document.querySelector("#closereplace").addEventListener('click', function(e){ 

      document.querySelector(".replacebutton").style.display = "inline-block";
      document.querySelector("#confirmreplace").style.display = "none";

      for (let i = 0; i < replaceinventory.length; i++)
      {
        replaceinventory[i].style.display = "none";
        replaceinventory[i].checked= false;
      }

    });

    // Code to prevent sending to replace page without selection for inventory

    var replaceinv = document.getElementsByName("replaceinv")
    var hiddenaction = document.getElementsByName("hiddenaction")
    var emptyselection = document.querySelectorAll(".emptyselection");

    if (document.querySelector(".additem"))
    {
      var hiddenstatus = document.getElementsByName("hiddenstatus")
    }

    document.querySelector("#insert-action-menu").addEventListener("click", function(e) {

      if (document.querySelector("#confirmreplace"))
      {
        if (document.querySelector("#confirmreplace").contains(e.target))
        {
          document.querySelector("#completereplace").value = "replace" ;

          if (document.querySelector(".additem"))
          {
            for (let i = 0; i < replaceinv.length; i++)
            {
              if (replaceinv[i].checked == true)
              { 
                for (let j = i; j < replaceinv.length; j++)
                {
                  if ((hiddenaction[j].value == "CHECKED OUT" && replaceinv[j].checked == true) || (hiddenstatus[j].value == "REPLACE" && replaceinv[j].checked == true) || 
                  (hiddenstatus[j].value == "REPLACED" && replaceinv[j].checked == true))
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

        }
      }
    });

    document.querySelector("#replace-items-modal").addEventListener("click", function(e) {

      if (document.querySelector("#completereplace").contains(e.target))
      {
        for (let i = 0; i < replaceinv.length; i++)
        {

          if (replaceinv[i].checked == true && (hiddenstatus[i].value == "REPLACE" || hiddenstatus[i].value == "REPLACED") && document.querySelector("#completereplace").type == "button")
          {
            document.querySelector(".already-replace").style.display = "block";

            for (let j = 0; j < replaceinv.length; j++)
            {
              if (hiddenaction[j].value == "CHECKED OUT" && replaceinv[j].checked == true)
              {
                document.querySelector(".notcheckedin").style.display = "block";
                break;
              }
            }

            break;
          }

          if (replaceinv[i].checked == true && document.querySelector("#completereplace").type == "button")
          {
            document.querySelector(".notcheckedin").style.display = "block";

            for (let j = 0; j < replaceinv.length; j++)
            {
              if ((hiddenstatus[j].value == "REPLACE" || hiddenstatus[j].value == "REPLACED") && replaceinv[j].checked == true)
              {
                document.querySelector(".already-replace").style.display = "block";
                break;
              }
            }

            break;
          }
          else if (i == replaceinv.length - 1 && document.querySelector("#completereplace").type == "button")
          {
            for (let i = 0; i < emptyselection.length; i++)
            {
              emptyselection[i].style.display = "block";
            }
          }
        }
      }

    });

    document.addEventListener("mouseover", function(e) {
          
      if (!(document.querySelector("#completereplace").contains(e.target)))
      {
        document.querySelector(".notcheckedin").style.display = "none";
        document.querySelector(".emptyselection").style.display = "none";
        document.querySelector(".already-replace").style.display = "none";
      }

    });
    
  }
}

  // Code for sending to replaced items page 

if ((document.querySelector(".replaceitem") || document.querySelector(".missingitem")) && (!(document.querySelector(".user-view"))))
{
  if (document.querySelector("#insert-action-menu"))
  {

    var replacedinventory = document.getElementsByClassName("replacedinventory")

    document.querySelector("#insert-action-menu").addEventListener('click', function(e){ 

      if (document.querySelector(".replacedbutton"))
      {
        if (document.querySelector(".replacedbutton").contains(e.target))
        {
          document.querySelector(".replacedbutton").style.display = "none";
          document.querySelector("#confirmreplaced").style.display = "inline-block";

          for (let i = 0; i < replacedinventory.length; i++)
          {
            replacedinventory[i].style.display = "inline-block";
          }
        }
      }

    });

    document.querySelector("#moreinfo").addEventListener("click", function(e) {
      
      if (document.querySelector("#single-item-replaced").contains(e.target))
      {
        for (let i = 0; i < replacedinventory.length; i++)
        { 
          replacedinventory[i].style.display = "none";
          replacedinventory[i].checked = false;
        }

        document.querySelector("#confirmreplaced").style.display = "none";
        document.querySelector(".action-menu-button").style.display = "block";
        document.querySelector("#completereplaced").type = "sumbit"
        document.querySelector("#completereplaced").value = "replaced-single-item";
      }

    });

    document.querySelector("#closereplaced").addEventListener('click', function(e){ 

      document.querySelector(".action-menu-button").style.display = "block";
      document.querySelector(".replacedbutton").style.display = "inline-block";
      document.querySelector("#confirmreplaced").style.display = "none";

      for (let i = 0; i < replacedinventory.length; i++)
      {
        replacedinventory[i].style.display = "none";
        replacedinventory[i].checked= false;
      }

    });

    // Code to prevent sending to replaced item page without selection

    var replacedinv = document.getElementsByName("replacedinv")

    document.querySelector("#insert-action-menu").addEventListener('click', function(e){ 

      if (document.querySelector("#confirmreplaced"))
      {
        if (document.querySelector("#confirmreplaced").contains(e.target))
        {
          document.querySelector("#completereplaced").value = "replaced";

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
        }
      }

    });

    document.querySelector("#replaced-items-modal").addEventListener("click", function(e) {

      if (document.querySelector("#completereplaced").contains(e.target))
      {

        if (document.querySelector("#completereplaced").type == "button")
        {
          document.querySelector(".emptyselection").style.display = "block";
        }
        else if (document.querySelector("#completereplaced").type = "submit")
        {
          document.querySelector(".emptyselection").style.display = "none";
        }
          
      }

    });

    document.addEventListener("mouseover", function(e) {

      if (!(document.querySelector("#completereplaced").contains(e.target)))
      {
        document.querySelector(".emptyselection").style.display = "none";
      }

    });
  }
}

// Code for marking items as missing 

if ((document.querySelector(".additem") || document.querySelector(".replaceitem") || document.querySelector(".offsiteitem")) && (!(document.querySelector(".user-view"))))
{
  if (document.querySelector("#insert-action-menu"))
  {

    var missinginventory = document.getElementsByClassName("missinginventory")

    document.querySelector("#insert-action-menu").addEventListener("click", function(e) {

      if (document.querySelector(".missingbutton"))
      {
        if (document.querySelector(".missingbutton").contains(e.target))
        {
          document.querySelector(".missingbutton").style.display = "none";
          document.querySelector("#confirmmissing").style.display = "inline-block";
          
          for (let i = 0; i < missinginventory.length; i++)
          { 
            missinginventory[i].style.display = "inline-block";
          }

        }
      }
    });

    document.querySelector("#moreinfo").addEventListener("click", function(e) {
      
      if (document.querySelector("#single-item-missing").contains(e.target))
      {
        for (let i = 0; i < missinginventory.length; i++)
        { 
          missinginventory[i].style.display = "none";
          missinginventory[i].checked = false;
        }

        document.querySelector("#confirmmissing").style.display = "none";
        document.querySelector(".action-menu-button").style.display = "block";
        document.querySelector("#completemissing").type = "sumbit"
        document.querySelector("#completemissing").value = "missing-single-item" ;
      }

    });

    document.querySelector("#closemissing").addEventListener('click', function(e){ 

      document.querySelector(".missingbutton").style.display = "inline-block";
      document.querySelector("#confirmmissing").style.display = "none";

      for (let i = 0; i < missinginventory.length; i++)
      {
        missinginventory[i].style.display = "none";
        missinginventory[i].checked = false;
      }

    });

    // Code to prevent marking items as missing without selection for inventory

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

    document.querySelector("#insert-action-menu").addEventListener("click", function(e) {

      if (document.querySelector("#confirmmissing"))
      {
        if (document.querySelector("#confirmmissing").contains(e.target))
        {

          document.querySelector("#completemissing").value = "missing";

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
        }
      }
    });

    document.querySelector("#missing-items-modal").addEventListener("click", function(e) {

      if (document.querySelector("#completemissing").contains(e.target))
      {
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
}

// Code for editing multiple items and selecting items to edit

if (document.querySelector(".additem"))
{
  if (document.querySelector("#insert-action-menu"))
  {

    var editSingleItem = document.querySelector("#edit-item");
    var editinventory = document.getElementsByClassName("editinventory");
    var completeEdit = document.querySelector("#completeedit")
    
    for (let i = 0; i < editinventory.length; i++)
    {
      editinventory[i].style.display = "none"; 
    }

    document.querySelector("#insert-action-menu").addEventListener("click", function(e) {
    
      if (document.querySelector(".editbutton"))
      { 
        if (document.querySelector(".editbutton").contains(e.target))
        { 

          document.querySelector(".editbutton").style.display = "none";
          document.querySelector("#confirmedit").style.display = "inline-block";
          completeEdit.value = "edit"
          document.querySelector("#hidden-edit-item").value = null
          document.querySelector("#editInfoModalLabel").textContent = "Edit Items"
          
          for (let i = 0; i < editinventory.length; i++)
          {
            editinventory[i].style.display = "inline-block";
          }

        }
      }
    });

    editSingleItem.addEventListener('click', function(e) {

      completeEdit.value = "edit-single-item"

    })

    document.querySelector("#closeedit").addEventListener('click', function(e){ 

      document.querySelector(".editbutton").style.display = "inline-block";
      document.querySelector("#confirmedit").style.display = "none";
      document.querySelector("#hidden-edit-item").value = ""

      for (let i = 0; i < editinventory.length; i++)
      {

        editinventory[i].style.display = "none";
        editinventory[i].checked = false;

      }

    });
    
  }
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

if ((document.querySelector(".additem") || document.querySelector(".replaceditem") || document.querySelector(".inventory-archive")) && (!(document.querySelector(".user-view"))))
{
  if (document.querySelector("#insert-action-menu"))
  {

    document.querySelector("#insert-action-menu").addEventListener("click", function(e) {
      
      if (document.querySelector(".archivebutton"))
      {
        if (document.querySelector(".archivebutton").contains(e.target))
        {
          var archivebutton = document.querySelector(".archivebutton");
          var confirmarchive = document.querySelector("#confirmarchive");
          var archiveinventory = document.getElementsByClassName("archiveinventory")
          showArchiveCheckboxes(archivebutton, confirmarchive, archiveinventory)
        }
      }
      
      if (document.querySelector(".unarchivebutton"))
      {
        if (document.querySelector(".unarchivebutton").contains(e.target))
        {
          var archivebutton = document.querySelector(".unarchivebutton");
          var confirmarchive = document.querySelector("#confirmunarchive");
          var archiveinventory = document.getElementsByClassName("unarchiveinventory")
          showArchiveCheckboxes(archivebutton, confirmarchive, archiveinventory)
        }
      }

    });

    document.querySelector("#moreinfo").addEventListener("click", function(e) {
      
      if (document.querySelector(".archivebutton"))
      {
        var confirmarchive = document.querySelector("#confirmarchive");
        var completearchive = document.querySelector("#completearchive");
        var archiveinventory = document.getElementsByClassName("archiveinventory");

        if (document.querySelector("#single-item-archive").contains(e.target))
        {
          for (let i = 0; i < archiveinventory.length; i++)
          { 
            archiveinventory[i].style.display = "none";
            archiveinventory[i].checked = false;
          }

          confirmarchive.style.display = "none";
          document.querySelector(".action-menu-button").style.display = "block";
          completearchive.type = "sumbit";
          
          if (document.querySelector("#single-item-archive"))
          {
            completearchive.value = "archive-single-item";
          }
          else if (document.querySelector("#single-item-unarchive"))
          {
            completearchive.value = "unarchive-single-item";
          }
        }

      }
      else if (document.querySelector(".unarchivebutton"))
      {
        var confirmarchive = document.querySelector("#confirmunarchive");
        var completearchive = document.querySelector("#completeunarchive");
        var archiveinventory = document.getElementsByClassName("unarchiveinventory");

        if (document.querySelector("#single-item-unarchive").contains(e.target))
        {
          for (let i = 0; i < archiveinventory.length; i++)
          { 
            archiveinventory[i].style.display = "none";
            archiveinventory[i].checked = false;
          }

          confirmarchive.style.display = "none";
          document.querySelector(".action-menu-button").style.display = "block";
          completearchive.type = "sumbit";
          
          if (document.querySelector("#single-item-archive"))
          {
            completearchive.value = "archive-single-item";
          }
          else if (document.querySelector("#single-item-unarchive"))
          {
            completearchive.value = "unarchive-single-item";
          }
        }

      }

    });


    if (document.querySelector("#archive-items-modal"))
    {
      document.querySelector("#archive-items-modal").addEventListener("click", function(e) {
        
        if (document.querySelector("#closearchive"))
        {
          if (document.querySelector("#closearchive").contains(e.target))
          {
            var archivebutton = document.querySelector(".archivebutton");
            var confirmarchive = document.querySelector("#confirmarchive");
            var archiveinventory = document.getElementsByClassName("archiveinventory")
            hideArchiveCheckboxes(archivebutton, confirmarchive, archiveinventory)
          }
        }
      
      });
    }
    else if (document.querySelector("#unarchive-items-modal"))
    {
      document.querySelector("#unarchive-items-modal").addEventListener("click", function(e) {

        if (document.querySelector("#closeunarchive"))
        {
          if (document.querySelector("#closeunarchive").contains(e.target))
          {
            var archivebutton = document.querySelector(".unarchivebutton");
            var confirmarchive = document.querySelector("#confirmunarchive");
            var archiveinventory = document.getElementsByClassName("unarchiveinventory")
            hideArchiveCheckboxes(archivebutton, confirmarchive, archiveinventory)
          }
        }

      });
    }

    function showArchiveCheckboxes(archivebutton, confirmarchive, archiveinventory) 
    {
      archivebutton.style.display = "none";
      confirmarchive.style.display = "inline-block";
      
      for (let i = 0; i < archiveinventory.length; i++)
      {
        archiveinventory[i].style.display = "inline-block";
      }

    }

    function hideArchiveCheckboxes(archivebutton, confirmarchive, archiveinventory)
    {
      archivebutton.style.display = "inline-block";
      confirmarchive.style.display = "none";

      for (let i = 0; i < archiveinventory.length; i++)
      {
        archiveinventory[i].style.display = "none";
        archiveinventory[i].checked = false;
      }

    }

    // Code to prevent sending items to archive without selection

    document.querySelector("#insert-action-menu").addEventListener("click", function(e) {

      if (document.querySelector("#confirmarchive"))
      {
        if (document.querySelector("#confirmarchive").contains(e.target))
        {
          var archiveinv = document.getElementsByName("archiveinv")
          var completearchive = document.querySelector("#completearchive");
          completearchive.value = "archive";
          changeArchiveButtonType(archiveinv, completearchive)
        }
      }
      
      if (document.querySelector("#confirmunarchive"))
      {
        if (document.querySelector("#confirmunarchive").contains(e.target))
        {
          var archiveinv = document.getElementsByName("unarchiveinv")
          var completearchive = document.querySelector("#completeunarchive");
          completearchive.value = "unarchive";
          changeArchiveButtonType(archiveinv, completearchive)
        }
      }
    });

    if (document.querySelector("#archive-items-modal"))
    {
      document.querySelector("#archive-items-modal").addEventListener("click", function(e) {
      
        if (document.querySelector("#completearchive"))
        {
          if (document.querySelector("#completearchive").contains(e.target))
          {
            var emptyselection = document.querySelectorAll(".emptyselection");
            var completearchive = document.querySelector("#completearchive");
            emptySelectionWarning(completearchive, emptyselection)
          }
        }

      });
    }
    else if (document.querySelector("#unarchive-items-modal"))
    {
      document.querySelector("#unarchive-items-modal").addEventListener("click", function(e) {

        if (document.querySelector("#completeunarchive"))
        {
          if (document.querySelector("#completeunarchive").contains(e.target))
          {
            var emptyselection = document.querySelectorAll(".emptyselection");
            var completearchive = document.querySelector("#completeunarchive");
            emptySelectionWarning(completearchive, emptyselection)
          }
        }

      });
    }
    
    function changeArchiveButtonType(archiveinv, completearchive)
    {
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

    }

    function emptySelectionWarning(completearchive, emptyselection)
    {
      if (completearchive.type == "button")
      {
        for (let i = 0; i < emptyselection.length; i++)
        {
          emptyselection[i].style.display = "block";
        }
      }

      document.addEventListener("mouseover", function(e) {
          
        if (completearchive)
        {
          if (!(completearchive.contains(e.target)))
          {
            for (let i = 0; i < emptyselection.length; i++)
            {
              emptyselection[i].style.display = "none";
            }
  
          }
        }
  
      });
    }
  }
}

// Code to toggle visibility of action buttons on pages that have an action button

function actionButtonToggle()
{
  if (document.querySelector(".additem") || document.querySelector(".user-inventory") || document.querySelector(".replaceitem")  || document.querySelector(".replaceditem") || document.querySelector(".missingitem") 
  || document.querySelector(".adduser") || document.querySelector(".inventory-archive") || document.querySelector(".offsiteitem") || document.querySelector(".uploaditem")) 
  {

    var actionMenuButton = document.querySelector(".action-menu-button")
    var actionMenu = document.querySelector(".action-menu")

    if (actionMenuButton) 
    {
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

  document.querySelector(".additem").addEventListener('click', function(e){
    
    if (document.querySelector(".addbutton").contains(e.target))
    {
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
}

// Code to switch between inventory categories

if (document.querySelector(".additem") || document.querySelector(".replaceitem") || document.querySelector(".offsiteitem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory") 
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

function showInfoOrHistory()
{

  var showInfoOrHistory = document.getElementsByClassName("show-info-or-history")
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

  document.addEventListener("click", function(e) {

    for (let i = 0; i < showInfoOrHistory.length; i++)
    {
      if (!(showInfoOrHistory[i].contains(e.target)))
      {
        itemOptionSelect[i].style.display = "none"
      }
    }

  });

}

// Code to remove checkboxes if user clicks on single action options

if (document.querySelector("#moreinfo"))
{ 
  document.querySelector("#moreinfo").addEventListener("click", function(e) {

    var inventoryCheckbox = document.querySelectorAll(".inventory-checkbox")
    var confirmButton = document.querySelectorAll(".confirm-button")

    if (document.querySelector(".editbutton"))
    {
      if (document.querySelector("#edit-item").contains(e.target))
      {
        hideCheckboxes(inventoryCheckbox, confirmButton)
      }
    }

    if (document.querySelector(".replacebutton"))
    {
      if (document.querySelector("#single-item-replace").contains(e.target))
      {
        hideCheckboxes(inventoryCheckbox, confirmButton)
      }
    }

    if (document.querySelector(".replacedbutton"))
    {
      if (document.querySelector("#single-item-replaced").contains(e.target))
      {
        hideCheckboxes(inventoryCheckbox, confirmButton)
      }
    }

    if (document.querySelector(".missingbutton"))
    {
      if (document.querySelector("#single-item-missing").contains(e.target))
      {
        hideCheckboxes(inventoryCheckbox, confirmButton)
      }
    }

    if (document.querySelector(".archivebutton"))
    {
      if (document.querySelector("#single-item-archive").contains(e.target))
      {
        hideCheckboxes(inventoryCheckbox, confirmButton)
      }
    }

    if (document.querySelector(".unarchivebutton"))
    {
      if (document.querySelector("#single-item-unarchive").contains(e.target))
      {
        hideCheckboxes(inventoryCheckbox, confirmButton)
      }
    }

    if (document.querySelector(".delbutton"))
    {
      if (document.querySelector("#delete-item").contains(e.target))
      {
        hideCheckboxes(inventoryCheckbox, confirmButton)
      }
    }

  })

  function hideCheckboxes(inventoryCheckbox, confirmButton)
  {
    for (let i = 0; i < inventoryCheckbox.length; i++)
    {
      inventoryCheckbox[i].checked = false;
      inventoryCheckbox[i].style.display = "none"
    }

    for (let i = 0; i < confirmButton.length; i++)
    {
      confirmButton[i].style.display = "none"
    }

    document.querySelector(".action-menu-button").style.display = "block"
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

  document.addEventListener("click", function(e) {

    if (document.getElementById('close-upload').contains(e.target) || document.getElementById('close-upload-x').contains(e.target))
    {
      document.getElementById('upload-file').value = ""
      document.getElementById('chosen-file').textContent = "No file chosen";
      document.getElementById('completeupload').type = "button";
    }

  })

  document.addEventListener("mouseover", function(e) {

    if (document.getElementById('completeupload'))
    {
      if (!(completeupload.contains(e.target)))
      {
        document.querySelector(".emptywarning").style.display = "none"
      }
    }

  })
}

// Code to prevent user from clicking button multiple times

if (document.querySelector(".prevent-click"))
{
  var preventClick = document.querySelectorAll(".prevent-click")

  for (let i = 0; i < preventClick.length; i ++)
  {
    preventClick[i].addEventListener("click", function() {

      setTimeout(function () { 
        if (preventClick[i].type == "submit")
        {
          preventClick[i].disabled = true;
          preventClick[i].querySelector(".confirm-default-text").style.display = "none"
          preventClick[i].querySelector(".loading-alert").style.display = "block"

          if (document.querySelector("#searchbutton"))
          {
            document.querySelector("#searchbutton").style.width = "155px"
          }

        }
      }); 
    
    })
  }

}

// Code to populate filter selection

function filterTable() 
{

  if (document.querySelector(".tboundary"))
  {
    if (document.querySelector(".additem") || document.querySelector(".replaceitem") || document.querySelector(".replaceditem") || document.querySelector(".offsiteitem") || document.querySelector(".missingitem")  
    || document.querySelector(".user-inventory") || document.querySelector(".inventory-archive"))
    {
      if (document.querySelector(".offsiteitem"))
      {

        var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter"];

      }
      else if (document.querySelector(".missingitem"))
      {
        var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "No Filter", 
        "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter"];
      }
      else if (document.querySelector(".additem") || document.querySelector(".user-inventory"))
      {
        var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", 
        "No Filter", "No Filter", "No Filter", "No Filter"];
      }
      else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem") )
      {
        var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", 
        "No Filter", "No Filter", "No Filter", "No Filter"];
      }
      else if (document.querySelector(".inventory-archive"))
      {
        var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "No Filter"];
      }

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
        if (filterselect[i].value != filterdefault[i])
        {

          document.getElementById("clear-filter").style.display = "block"
          document.getElementById("show-filter").style.display = "none"
          document.getElementById("hide-filter").style.display = "none"

          for (let j = 0; j < filterselect.length; j++)
          {
            if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory"))
            { 
              if ((j >= 5 && j <= 7) || (j >= 9 && j <= 12))
              {
                if (filterselect[j].value != filterdefault[j])
                {
                  filterselect[j].style.display = "block";

                  if (j == 5 || j == 9)
                  {
                    filterselect[j - 1].value = "Location"
                  }
                  else if (j == 6 || j == 10)
                  {
                    filterselect[j - 2].value = "Department"
                  }
                  else if (j == 7 || j == 11)
                  {
                    filterselect[j - 3].value = "Room"
                  }
                  else if (j == 12)
                  {
                    filterselect[j - 4].value = "Off-site Location"
                  }
                }
                
                if (filterselect[5].value == filterdefault[5] && filterselect[6].value == filterdefault[6] && filterselect[7].value == filterdefault[7])
                {
                  filterselect[5].style.display = "block";
                }
                
                if (filterselect[9].value == filterdefault[9] && filterselect[10].value == filterdefault[10] && filterselect[11].value == filterdefault[11] && filterselect[12].value == filterdefault[12])
                {
                  filterselect[9].style.display = "block";
                }
              }
              else
              {
                filterselect[j].style.display = "block";
              }
            }
            else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem"))
            {
              if ((j >= 5 && j <= 7) || (j >= 9 && j <= 11))
              {
                if (filterselect[j].value != filterdefault[j])
                {
                  filterselect[j].style.display = "block";

                  if (j == 5 || j == 9)
                  {
                    filterselect[j - 1].value = "Location"
                  }
                  else if (j == 6 || j == 10)
                  {
                    filterselect[j - 2].value = "Department"
                  }
                  else if (j == 7 || j == 11)
                  {
                    filterselect[j - 3].value = "Room"
                  }

                }
                
                if (filterselect[5].value == filterdefault[5] && filterselect[6].value == filterdefault[6] && filterselect[7].value == filterdefault[7])
                {
                  filterselect[5].style.display = "block";
                }
                
                if (filterselect[9].value == filterdefault[9] && filterselect[10].value == filterdefault[10] && filterselect[11].value == filterdefault[11])
                {
                  filterselect[9].style.display = "block";
                }
              }
              else
              {
                filterselect[j].style.display = "block";
              }
            }
            else if (document.querySelector(".inventory-archive"))
            {
              if ((j >= 5 && j <= 7))
              {
                if (filterselect[j].value != filterdefault[j])
                {
                  filterselect[j].style.display = "block";

                  if (j == 5)
                  {
                    filterselect[j - 1].value = "Location"
                  }
                  else if (j == 6)
                  {
                    filterselect[j - 2].value = "Department"
                  }
                  
                  if (j == 7)
                  {
                    filterselect[j - 3].value = "Room"
                  }
                  
                  if (filterselect[5].value == filterdefault[5] && filterselect[6].value == filterdefault[6] && filterselect[7].value == filterdefault[7])
                  {
                    filterselect[5].style.display = "block";
                  }
                }
              }
              else
              {
                filterselect[j].style.display = "block";
              }
            }
            else 
            {   
              filterselect[j].style.display = "block";
            }
          }

          // Code to show date filters if filter is not set to default and show clear filter button

          for (let j = 0; j < filterDateSelect.length; j++)
          {
            filterDateSelect[j].style.display = "block"
            date_label[j].style.display = "block"
          }

          break;
        }

        // Code in case that filters are all default except date filters
        
        else if (i == filterselect.length - 1)
        {
          if (!(document.querySelector(".inventory-archive")))
          {
            for (let j = 0; j < filterDateSelect.length; j++)
            {
              if (filterDateSelect[j].value != filterDateDefault[j])
              {

                document.getElementById("clear-filter").style.display = "block"
                document.getElementById("show-filter").style.display = "none"
                document.getElementById("hide-filter").style.display = "none"

                for (let k = 0; k < filterDateSelect.length; k++)
                {
                  filterDateSelect[k].style.display = "block"
                  date_label[k].style.display = "block"
                }

                for (let k = 0; k < filterselect.length; k++)
                {
                  if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory"))
                  { 
                    if ((k >= 5 && k <= 7) || (k >= 9 && k <= 12))
                    {
                      if (filterselect[k].value != filterdefault[k])
                      {
                        filterselect[k].style.display = "block";

                        if (k == 5 || k == 9)
                        {
                          filterselect[k - 1].value = "Location"
                        }
                        else if (k == 6 || k == 10)
                        {
                          filterselect[k - 2].value = "Department"
                        }
                        else if (k == 7 || k == 11)
                        {
                          filterselect[k - 3].value = "Room"
                        }
                        else if (k == 12)
                        {
                          filterselect[k - 4].value = "Off-site Location"
                        }
                      }
                      
                      if (filterselect[5].value == filterdefault[5] && filterselect[6].value == filterdefault[6] && filterselect[7].value == filterdefault[7])
                      {
                        filterselect[5].style.display = "block";
                      }
                      
                      if (filterselect[9].value == filterdefault[9] && filterselect[10].value == filterdefault[10] && filterselect[11].value == filterdefault[11] && filterselect[12].value == filterdefault[12])
                      {
                        filterselect[9].style.display = "block";
                      }
                    }
                    else
                    {
                      filterselect[k].style.display = "block";
                    }
                  }
                  else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem"))
                  {
                    if ((k >= 5 && k <= 7) || (k >= 9 && k <= 11))
                    {
                      if (filterselect[k].value != filterdefault[k])
                      {
                        filterselect[k].style.display = "block";

                        if (k == 5 || k == 9)
                        {
                          filterselect[k - 1].value = "Location"
                        }
                        else if (k == 6 || k == 10)
                        {
                          filterselect[k - 2].value = "Department"
                        }
                        else if (k == 7 || k == 11)
                        {
                          filterselect[k - 3].value = "Room"
                        }

                      }
                      
                      if (filterselect[5].value == filterdefault[5] && filterselect[6].value == filterdefault[6] && filterselect[7].value == filterdefault[7])
                      {
                        filterselect[5].style.display = "block";
                      }
                      
                      if (filterselect[9].value == filterdefault[9] && filterselect[10].value == filterdefault[10] && filterselect[11].value == filterdefault[11])
                      {
                        filterselect[9].style.display = "block";
                      }
                    }
                    else
                    {
                      filterselect[k].style.display = "block";
                    }
                  }
                  else 
                  {   
                    filterselect[k].style.display = "block";
                  }
                }

                break;

              }
              else if (j == filterDateSelect.length - 1)
              {
                document.getElementById("clear-filter").style.display = "none"
                document.getElementById("show-filter").style.display = "block"
                document.getElementById("hide-filter").style.display = "none"
              }
            }
          }
          else if (document.querySelector(".inventory-archive"))
          {  
            for (let j = 0; j < filterDateSelect.length; j++)
            {
              if (filterDateSelect[j].value != filterDateDefaultArchive[j])
              {

                document.getElementById("clear-filter").style.display = "block"
                document.getElementById("show-filter").style.display = "none"
                document.getElementById("hide-filter").style.display = "none"

                for (let k = 0; k < filterDateSelect.length; k++)
                {
                  filterDateSelect[k].style.display = "block"
                  date_label[k].style.display = "block"
                }

                for (let k = 0; k < filterselect.length; k++)
                {
                  if ((k >= 5 && k <= 7))
                  {
                    if (filterselect[k].value != filterdefault[k])
                    {
                      filterselect[k].style.display = "block";

                      if (k == 5)
                      {
                        filterselect[k - 1].value = "Location"
                      }
                      else if (k == 6)
                      {
                        filterselect[k - 2].value = "Department"
                      }
                      else if (k == 7)
                      {
                        filterselect[k - 3].value = "Room"
                      }
                      
                      if (filterselect[5].value == filterdefault[5] && filterselect[6].value == filterdefault[6] && filterselect[7].value == filterdefault[7])
                      {
                        filterselect[5].style.display = "block";
                      }
                    }
                  }
                  else
                  {
                    filterselect[k].style.display = "block";
                  }
                }

                break;

              }
              else if (j == filterDateSelect.length - 1)
              {
                document.getElementById("clear-filter").style.display = "none"
                document.getElementById("show-filter").style.display = "block"
                document.getElementById("hide-filter").style.display = "none"
              }
            }
          }
        }       
      }

      // Code for user to show/hide filters in assigned location depending on search by filter

      if (!(document.querySelector(".offsiteitem")))
      {
        document.querySelector("#filtersbal").addEventListener("change", function() {

          if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory") || document.querySelector(".replaceitem") || document.querySelector(".replaceditem")
          || document.querySelector(".inventory-archive"))
          {
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

        })

        // Code for user to show/hide filters in current location depending on search by filter

        if (!(document.querySelector(".inventory-archive")))
        {
          document.querySelector("#filtersbcl").addEventListener("change", function() {
            
            if ((!(document.querySelector(".offsiteitem"))) || (!(document.querySelector(".inventory-archive"))))
            {
              if (document.querySelector("#filtersbcl").value == "Location")
              {
                document.querySelector("#filtercl").style.display = "block"
                document.querySelector("#filtercd").style.display = "none"
                document.querySelector("#filtercr").style.display = "none"
                
                if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".user-inventory"))
                {
                  document.querySelector("#filterosl").style.display = "none"
                }
              }
              else if (document.querySelector("#filtersbcl").value == "Department")
              {
                document.querySelector("#filtercl").style.display = "none"
                document.querySelector("#filtercd").style.display = "block"
                document.querySelector("#filtercr").style.display = "none"
                
                if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".user-inventory"))
                {
                  document.querySelector("#filterosl").style.display = "none"
                }
              }
              else if (document.querySelector("#filtersbcl").value == "Room")
              {
                document.querySelector("#filtercl").style.display = "none"
                document.querySelector("#filtercd").style.display = "none"
                document.querySelector("#filtercr").style.display = "block"

                if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".user-inventory"))
                {
                  document.querySelector("#filterosl").style.display = "none"
                }
              }
              if (document.querySelector(".missingitem") || document.querySelector(".additem") || document.querySelector(".user-inventory"))
              {
                if (document.querySelector("#filtersbcl").value == "Off-site Location")
                {
                  document.querySelector("#filtercl").style.display = "none"
                  document.querySelector("#filtercd").style.display = "none"
                  document.querySelector("#filtercr").style.display = "none"
                  document.querySelector("#filterosl").style.display = "block"
                }
              }
            } 

          })
        }
      }

      // Code to allow users to clear all filters

      if (document.getElementById("clear-filter"))
      {
        document.getElementById("clear-filter").addEventListener("click", function() {

          document.getElementById("search").disabled = true;
          loadingTable()
          disableActionButton()

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

          submitFilter()

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
        
          if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory") || document.querySelector(".replaceitem") || document.querySelector(".replaceditem")
          || document.querySelector(".offsiteitem"))
          {
            if (((startDateDoa == "" || endDateDoa == "") && (startDateDa == "" || endDateDa == "") && (startDateRd == "" || endDateRd == "")) 
            || ((startDateDoa != "" && endDateDoa != "") || (startDateDa != "" && endDateDa != "") || (startDateRd != "" && endDateRd != "")))
            {
              if ((startDateDoa == "" && endDateDoa != "") || (startDateDa == "" && endDateDa != "") || (startDateRd == "" && endDateRd != ""))
              {
                if (i != 4 && i != 8)
                {
                  document.getElementById("search").disabled = true;
                  loadingTable()
                  disableActionButton()
                  submitFilter()
                }

              }
              if ((startDateDoa != "" && endDateDoa == "") || (startDateDa != "" && endDateDa == "") || (startDateRd != "" && endDateRd == ""))
              {
                if (i != 4 && i != 8)
                {
                  document.getElementById("search").disabled = true;
                  loadingTable()
                  disableActionButton()
                  submitFilter()
                }
              }
              else if ((endDateDoa < startDateDoa) || (endDateDa < startDateDa) || (endDateRd < startDateRd))
              {
                alert("Start date must be a date before or the same as end date.")
              }
              else 
              {
                if (!(document.querySelector(".offsiteitem")))
                {
                  if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory"))
                  { 
                    if ((i >= 5 && i <= 7) || (i >= 9 && i <= 12))
                    {
                      if (i == 5 || i == 9)
                      {
                        filterselect[i + 1].value = "No Filter"
                        filterselect[i + 2].value = "No Filter"
                        
                        if (i == 9)
                        {
                          filterselect[i + 3].value = "No Filter"
                        }
  
                      }
                      else if (i == 6 || i == 10)
                      {
                        filterselect[i - 1].value = "No Filter"
                        filterselect[i + 1].value = "No Filter"
                        
                        if (i == 10)
                        {
                          filterselect[i + 2].value = "No Filter"
                        }
                      }
                      else if (i == 7 || i == 11)
                      {
                        filterselect[i - 2].value = "No Filter"
                        filterselect[i - 1].value = "No Filter"
                        
                        if (i == 11)
                        {
                          filterselect[i + 1].value = "No Filter"
                        }
                      }
                      else if (i == 12)
                      {
                        filterselect[i - 3].value = "No Filter"
                        filterselect[i - 2].value = "No Filter"
                        filterselect[i - 1].value = "No Filter"
                      }

                      document.getElementById("search").disabled = true;
                      loadingTable()
                      disableActionButton()
                      submitFilter()

                    }
                    else if (i != 4 && i != 8)
                    {
                      document.getElementById("search").disabled = true;
                      loadingTable()
                      disableActionButton()
                      submitFilter()
                    }
                  }
                  else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem"))
                  {
                    if ((i >= 5 && i <= 7) || (i >= 9 && i <= 11))
                    {
                      if (i == 5 || i == 9)
                      {
                        filterselect[i + 1].value = "No Filter"
                        filterselect[i + 2].value = "No Filter"
  
                      }
                      else if (i == 6 || i == 10)
                      {
                        filterselect[i - 1].value = "No Filter"
                        filterselect[i + 1].value = "No Filter"
                      }
                      else if (i == 7 || i == 11)
                      {
                        filterselect[i - 2].value = "No Filter"
                        filterselect[i - 1].value = "No Filter"
                      }

                      document.getElementById("search").disabled = true;
                      loadingTable()
                      disableActionButton()
                      submitFilter()

                    }
                    else if (i != 4 && i != 8)
                    {
                      document.getElementById("search").disabled = true;
                      loadingTable()
                      disableActionButton()
                      submitFilter()
                    }
                  }
                }
                else 
                {
                  document.getElementById("search").disabled = true;
                  loadingTable()
                  disableActionButton()
                  submitFilter()
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
                document.getElementById("search").disabled = true;
                loadingTable()
                disableActionButton()
                submitFilter()
              }
              if ((startDateDa != "" && endDateDa == "") || (startDateRd != "" && endDateRd == ""))
              {
                document.getElementById("search").disabled = true;
                loadingTable()
                disableActionButton()
                submitFilter()
              }
              else if ((endDateDa < startDateDa) || (endDateRd < startDateRd))
              {
                alert("Start date must be a date before or the same as end date.")
              }
              else 
              {
                if ((i >= 5 && i <= 7))
                {
                  if (i == 5)
                  {
                    filterselect[i - 1].value = "Location"
                  }
                  else if (i == 6)
                  {
                    filterselect[i - 2].value = "Department"
                  }
                  else if (i == 7)
                  {
                    filterselect[i - 3].value = "Room"
                  }
                  
                  document.getElementById("search").disabled = true;
                  loadingTable()
                  disableActionButton()
                  submitFilter()

                }
                else if (i != 4)
                {
                  document.getElementById("search").disabled = true;
                  loadingTable()
                  disableActionButton()
                  submitFilter()
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
                      document.getElementById("search").disabled = true;
                      loadingTable()
                      disableActionButton()
                      submitFilter()
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
                      document.getElementById("search").disabled = true;
                      loadingTable()
                      disableActionButton()
                      submitFilter()
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
                      document.getElementById("search").disabled = true;
                      loadingTable()
                      disableActionButton()
                      submitFilter();
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
                      document.getElementById("search").disabled = true;
                      loadingTable()
                      disableActionButton()
                      submitFilter();
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
}

// Code to allow user show/hide filters

if (document.querySelector("#inventory-tools-wrapper"))
{
  document.querySelector("#inventory-tools-wrapper").addEventListener("click", function(e) {

    if (document.querySelector("#show-filter").contains(e.target) || document.querySelector("#hide-filter").contains(e.target))
    {

      var filterselect = document.getElementsByName("filter");
      var filterDateSelect = document.getElementsByName("filterdate");
      var date_label = document.getElementsByClassName("date-label");

      if (document.querySelector("#show-filter").style.display == "block")
      {
        document.querySelector("#show-filter").style.display = "none"
        document.querySelector("#hide-filter").style.display = "block"
      }
      else if (document.querySelector("#hide-filter").style.display == "block")
      {
        document.querySelector("#show-filter").style.display = "block"
        document.querySelector("#hide-filter").style.display = "none"
      }

      for (let i = 0; i < filterselect.length; i++)
      {

        if (!(document.querySelector(".offsiteitem")))
        {
          if (i == 4)
          {
            if (filterselect[4].style.display == "none")
            {
              filterselect[4].style.display = "block"
              
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

              if (document.querySelector("#filtersbcl").value == "Location")
              {
                document.querySelector("#filtercl").style.display = "block"
                document.querySelector("#filtercd").style.display = "none"
                document.querySelector("#filtercr").style.display = "none"

                if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory"))
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

                if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory"))
                {
                  document.querySelector("#filterosl").style.display = "none"
                }
              }
              else if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory"))
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
              
              if (document.querySelector(".additem") || document.querySelector(".missingitem") || document.querySelector(".user-inventory"))
              {
                filterselect[12].style.display = "none"
              }
            }
          }
          else if (((!(document.querySelector(".replaceitem"))) && (!(document.querySelector(".replaceditem")))) && (!(document.querySelector(".inventory-archive"))))
          {
            if (i > 5)
            {
              if ((i + 7) == filterselect.length)
              {
                break;
              }

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
              if ((i + 6) == filterselect.length)
              {
                break;
              }

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
              if ((i + 3) == filterselect.length)
              {
                break;
              }

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
      }

      // Code to allow user show/hide filters for date inputs

      for (let i = 0; i < filterDateSelect.length; i++)
      {
        if (filterDateSelect[i].style.display == "none")
        {
          filterDateSelect[i].style.display = "block";
          date_label[i].style.display = "block";
        }
        else if (filterDateSelect[i].style.display == "block")
        {
          filterDateSelect[i].style.display = "none";
          date_label[i].style.display = "none";
        }
      }
    }
  });
}

async function getInventoryTable() {
    
  if (searchFilter && (searchFilter.value == "IN USE" || searchFilter.value == "LOANED" || searchFilter.value == "OUT FOR REPAIR"))
  {

    if (searchFilter.value == "IN USE")
    {
      if (document.querySelector(".additem"))
      {
        var tableUrl = "admin_inventory_table"
      }
      else 
      {
        var tableUrl = "inventory_table"
      }
    }
    else if (searchFilter.value == "LOANED")
    {
      if (document.querySelector(".additem"))
      {
        var tableUrl = "admin_inventory_table"
      }
      else 
      {
        var tableUrl = "inventory_table"
      }
    }
    else if (searchFilter.value == "OUT FOR REPAIR")
    {
      if (document.querySelector(".additem"))
      {
        var tableUrl = "admin_inventory_table"
      }
      else 
      {
        var tableUrl = "inventory_table"
      }
    }

    if (tableUrl == "admin_inventory_table" || tableUrl == "inventory_table")
    {
      var data = new FormData()
      data.append("sf", searchFilter.value)
      await fetch(tableUrl, {
        "method": "POST",
        "body": data,
      }).then(async (response) => {
          return await response.text();
      }).then((text) => {
        let div = document.createElement("div")
        div.innerHTML = text

        if (div.querySelector(".action-menu-wrapper"))
        {
          document.getElementById("insert-action-menu").prepend(div.querySelector(".action-menu-wrapper"))
        }

        if (document.querySelector("#insert-inventory-table"))
        {
          document.getElementById("insert-inventory-table").prepend(div.querySelector("#inventory-table"))
        }
        
        tablePagination()
        actionButtonToggle()
        filterTable() 

        if (!(document.querySelector(".user-inventory") || document.querySelector(".user-view")))
        {
          showInfoOrHistory()
          showItemOptions()
        } 

      });
    }
  }
  else 
  {

    if (document.querySelector(".offsiteitem"))
    {
      var tableUrl = "off-site_table"
    }
    else if (document.querySelector(".missingitem"))
    {
      var tableUrl = "missing_table"
    }
    else if (document.querySelector(".additem") || document.querySelector(".user-inventory"))
    {
      if (document.querySelector(".additem"))
      {
        var tableUrl = "admin_inventory_table"
      }
      else 
      {
        var tableUrl = "inventory_table"
      }
    }
    else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem") )
    {
      if (document.querySelector(".replaceitem"))
      {
        var tableUrl = "replace_table"
      }
      else 
      {
        var tableUrl = "replaced_items_table"
      }
    }
    else if (document.querySelector(".inventory-archive"))
    {
      var tableUrl = "archive_table"
    }
    else if (document.querySelector(".uploaditem"))
    {
      var tableUrl = "upload_inventory_table"
    }

    await fetch(tableUrl, {
      "method": "GET",
    }).then(async (response) => {
        return await response.text();
    }).then((text) => {
        let div = document.createElement("div")
        div.innerHTML = text

        if (div.querySelector(".action-menu-wrapper"))
        {
          document.getElementById("insert-action-menu").prepend(div.querySelector(".action-menu-wrapper"))
        }

        if (document.querySelector("#insert-inventory-table"))
        {
          document.getElementById("insert-inventory-table").prepend(div.querySelector("#inventory-table"))
        }          

        tablePagination()
        actionButtonToggle()
        
        if (!(document.querySelector(".uploaditem")))
        {
          filterTable() 
        }

        if (!(document.querySelector(".user-inventory") || document.querySelector(".user-view") || document.querySelector(".uploaditem")))
        {
          showInfoOrHistory()
          showItemOptions()
        } 

    });
  }
}

function showItemOptions() 
{
  for (let i = 0; i < showinfo.length; i++)
  {
    showinfo[i].addEventListener("click", function() {
        
      var data = new FormData()
      data.append("showinfo",  showinfo[i].value)
      var admin_url = "admin_inventory"
      fetch(admin_url, {
          "method": "POST",
          "body": data,
      }).then((response) => {
          
          return response.json()

      }).then((result) => {

        img.src = "/static/qrcodes/"+ result['qr_code'] +".png";

        if (document.querySelector(".additem"))
        {
          document.getElementById("hidden-edit-item").value = result['qr_code'];
          document.getElementById("hidden-delete-item").value = result['qr_code'];
          document.getElementById("downloadqrcode").href = "static/qrcodes/"+result['qr_code']+".png";
        }
        if (document.querySelector(".additem"))
        {
          document.getElementById("hidden-replace-item").value = result['qr_code'];
        }
        if (document.querySelector(".replaceitem") || document.querySelector(".missingitem"))
        {
          document.getElementById("hidden-replaced-item").value = result['qr_code'];
        }
        if (document.querySelector(".additem") || document.querySelector(".replaceitem") || document.querySelector(".offsiteitem"))
        {
          document.getElementById("hiddenmissingitem").value = result['qr_code'];
        }
        if (document.querySelector(".additem") || document.querySelector(".replaceditem"))
        {
        document.getElementById("hidden-archive-item").value = result['qr_code'];
        }

        if (document.querySelector(".additem"))
        {
          if (result['status'] == "REPLACE" || result['status'] == "REPLACED")
          {
              document.querySelector("#single-item-replace").style.display = "none";
              document.querySelector("#single-item-replace").disabled = true;
          }
          else if (result['status'] != "REPLACE" || result['status'] != "REPLACED")
          {
              document.querySelector("#single-item-replace").style.display = "block";
              document.querySelector("#single-item-replace").disabled = false;
          }

          if (result['status'] == "MISSING")
          {
              document.querySelector("#single-item-missing").style.display = "none";
              document.querySelector("#single-item-missing").disabled = true;
          }
          else if (result['status'] != "MISSING")
          {
              document.querySelector("#single-item-missing").style.display = "block";
              document.querySelector("#single-item-missing").disabled = false;
          }

          if (result['status'] != "REPLACED")
          {
              document.querySelector("#single-item-archive").style.display = "none";
              document.querySelector("#single-item-archive").disabled = true;
          }
          else if (result['status'] == "REPLACED")
          {
              document.querySelector("#single-item-archive").style.display = "block";
              document.querySelector("#single-item-archive").disabled = false;
          }
        }

      });

      moreInfoModal.show();

    });
  }

  for (let i = 0; i < showhistory.length; i++)
  {
    showhistory[i].addEventListener("click", function() {

        var data = new FormData()
        data.append("showhistory",  showhistory[i].value)
        var activity_url = "activity_history"
        var activity_div = document.getElementById("activity_history")
        fetch(activity_url, {
            "method": "POST",
            "body": data,
        }).then((response) => {
            return response.text();
        }).then((text) => {
            activity_div.innerHTML = text
        });
            
        showHistoryModal.show();

    });
  }
}

function submitFilter()
{
  clearTimeout(timeout)

  timeout = setTimeout(function() {

    if (document.querySelector(".offsiteitem"))
    {
      var tableUrl = "off-site_table"
    }
    else if (document.querySelector(".missingitem"))
    {
      var tableUrl = "missing_table"
    }
    else if (document.querySelector(".additem") || document.querySelector(".user-inventory"))
    {
      if (document.querySelector(".additem"))
      {
        var tableUrl = "admin_inventory_table"
      }
      else 
      {
        var tableUrl = "inventory_table"
      }
    }
    else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem") )
    {
      if (document.querySelector(".replaceitem"))
      {
        var tableUrl = "replace_table"
      }
      else 
      {
        var tableUrl = "replaced_items_table"
      }
    }
    else if (document.querySelector(".inventory-archive"))
    {
      var tableUrl = "archive_table"
    }

    var filterData = document.getElementsByName("filter")
    var filterDateData = document.getElementsByName("filterdate")
    var searchInventory = document.getElementById("search");
    var data = new FormData()

    for (let i = 0; i < filterData.length; i++)
    {
      data.append("filter", filterData[i].value)
    }

    for (let i = 0; i < filterDateData.length; i++)
    {
      data.append("filterdate", filterDateData[i].value)
    }

    data.append("search", searchInventory.value)

    fetch(tableUrl, {
      "method": "POST",
      "body": data,
    }).then(async (response) => {
        return await response.text();
    }).then((text) => {
      let div = document.createElement("div")
      div.innerHTML = text

      if (div.querySelector(".action-menu-wrapper"))
      {
        document.getElementById("insert-action-menu").removeChild(document.getElementById("insert-action-menu").firstElementChild)
      }

      document.getElementById("insert-inventory-table").removeChild(document.getElementById("insert-inventory-table").querySelector("#inventory-table"))

      if (div.querySelector(".action-menu-wrapper"))
      {
        document.getElementById("insert-action-menu").prepend(div.querySelector(".action-menu-wrapper"))
      }

      if (document.querySelector("#insert-inventory-table"))
      {
        document.getElementById("insert-inventory-table").prepend(div.querySelector("#inventory-table"))
      }

      if (document.querySelector(".pages").firstChild)
      {
        document.querySelector(".pages").removeChild(document.querySelector(".pages").firstChild)
      }

      tablePagination()
      actionButtonToggle()
      finishLoading()
      filterTable() 

      if (!(document.querySelector(".user-inventory") || document.querySelector(".user-view")))
      {
        showInfoOrHistory()
        showItemOptions()
      } 

      if (document.querySelector(".nodate"))
      {
        document.querySelector(".nodate").addEventListener("animationend", function() {
          document.querySelector(".nodate").style.display = "none";
        });
      }

      if (document.querySelector(".no-search-match"))
      {
        var removeElement = document.querySelector(".no-search-match");
        removeElement.remove();
      }

      if (div.querySelector(".no-search-match"))
      {
        document.querySelector("#insert-inventory-table").insertAdjacentElement("beforebegin", div.querySelector(".no-search-match"))
        finishLoading()
        enableActionButton()

        document.querySelector(".no-search-match").addEventListener("animationend", function() {
          var removeElement = document.querySelector(".no-search-match");
          removeElement.remove();
        });
      }

    })
  }, 1000)
}

function loadingTable() {
  
  document.querySelector("#loading-table").style.display = "flex"

  if (document.querySelector(".additem"))
  {
    document.getElementById("download-all-qr").disabled = true;
  }

  document.getElementById("show-filter").disabled = true;
  document.getElementById("hide-filter").disabled = true;
  document.getElementById("clear-filter").disabled = true;
  document.getElementById("refresh-page").disabled = true;

}

function finishLoading() {
  
  document.querySelector("#loading-table").style.display = "none"
  document.getElementById("search").disabled = false;

  if (document.querySelector(".additem"))
  {
    document.getElementById("download-all-qr").disabled = false;
  }

  document.getElementById("show-filter").disabled = false;
  document.getElementById("hide-filter").disabled = false;
  document.getElementById("clear-filter").disabled = false;
  document.getElementById("refresh-page").disabled = false;

}

function disableActionButton() 
{

  if (document.querySelector(".additem") || document.querySelector(".offsiteitem") || document.querySelector(".replaceitem") || document.querySelector(".replaceditem") || document.querySelector(".missingitem")
  || document.querySelector(".inventory-archive"))
  {
    if (document.querySelector(".action-menu-button"))
    {
      document.querySelector(".action-menu-button").disabled = true;
    }
  }

  if (document.querySelector(".additem"))
  {
    if (document.querySelector("#confirmedit"))
    {
      document.querySelector("#confirmedit").disabled = true;
    }
    if (document.querySelector("#confirmreplace"))
    {
      document.querySelector("#confirmreplace").disabled = true;
    }
    if (document.querySelector("#confirmdel"))
    {
      document.querySelector("#confirmdel").disabled = true;
    }
  }

  if (document.querySelector(".additem") || document.querySelector(".offsiteitem") || document.querySelector(".replaceitem"))
  {
    if (document.querySelector("#confirmmissing"))
    {
      document.querySelector("#confirmmissing").disabled = true;
    }
    
  }
  
  if (document.querySelector(".additem") || document.querySelector(".replaceditem"))
  {
    if (document.querySelector("#confirmarchive"))
    {
      document.querySelector("#confirmarchive").disabled = true;
    }
  }

  if (document.querySelector(".replaceitem") || document.querySelector(".missingitem"))
  {
    if (document.querySelector("#confirmreplaced"))
    {
      document.querySelector("#confirmreplaced").disabled = true;
    }
  }

  if (document.querySelector(".inventory-archive"))
  {
    if (document.querySelector("#confirmunarchive"))
    {
      document.querySelector("#confirmunarchive").disabled = true;
    }
  }

}

function enableActionButton() 
{
  if (document.querySelector(".additem") || document.querySelector(".offsiteitem") || document.querySelector(".replaceitem") || document.querySelector(".replaceditem") || document.querySelector(".missingitem")
  || document.querySelector(".inventory-archive"))
  {
    if (document.querySelector(".action-menu-button"))
    {
      document.querySelector(".action-menu-button").disabled = false;
    }
  }

  if (document.querySelector(".additem"))
  {
    if (document.querySelector("#confirmedit"))
    {
      document.querySelector("#confirmedit").disabled = false;
    }
    if (document.querySelector("#confirmreplace"))
    {
      document.querySelector("#confirmreplace").disabled = false;
    }
    if (document.querySelector("#confirmdel"))
    {
      document.querySelector("#confirmdel").disabled = false;
    }
  }

  if (document.querySelector(".additem") || document.querySelector(".offsiteitem") || document.querySelector(".replaceitem"))
  {
    if (document.querySelector("#confirmmissing"))
    {
      document.querySelector("#confirmmissing").disabled = false;
    }
    
  }
  
  if (document.querySelector(".additem") || document.querySelector(".replaceditem"))
  {
    if (document.querySelector("#confirmarchive"))
    {
      document.querySelector("#confirmarchive").disabled = false;
    }
  }

  if (document.querySelector(".replaceitem") || document.querySelector(".missingitem"))
  {
    if (document.querySelector("#confirmreplaced"))
    {
      document.querySelector("#confirmreplaced").disabled = false;
    }
  }

  if (document.querySelector(".inventory-archive"))
  {
    if (document.querySelector("#confirmunarchive"))
    {
      document.querySelector("#confirmunarchive").disabled = false;
    }
  }
}

// Code for search feature

function searchTool() {
  document.addEventListener("input", function(e) {

    clearTimeout(timeout)

    if (document.getElementById("search").contains(e.target))
    {

      loadingTable()
      disableActionButton()

      if (document.querySelector("#search").value == "")
      {
        if (document.querySelector(".no-search-match"))
        {
          var removeElement = document.querySelector(".no-search-match");
          removeElement.remove();
        }
      }
        
      timeout = setTimeout(function() {
        if (document.querySelector(".offsiteitem"))
        {
          var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter"];
          var tableUrl = "off-site_table"
        }
        else if (document.querySelector(".missingitem"))
        {
          var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "No Filter", 
          "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter"];
          var tableUrl = "missing_table"
        }
        else if (document.querySelector(".additem") || document.querySelector(".user-inventory"))
        {
          var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "No Filter", "No Filter", 
          "No Filter", "No Filter", "No Filter", "No Filter"];
          
          if (document.querySelector(".additem"))
          {
            var tableUrl = "admin_inventory_table"
          }
          else 
          {
            var tableUrl = "inventory_table"
          }
        }
        else if (document.querySelector(".replaceitem") || document.querySelector(".replaceditem") )
        {
          var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", 
          "No Filter", "No Filter", "No Filter", "No Filter"];
          
          if (document.querySelector(".replaceitem"))
          {
            var tableUrl = "replace_table"
          }
          else 
          {
            var tableUrl = "replaced_items_table"
          }
        }
        else if (document.querySelector(".inventory-archive"))
        {
          var filterdefault = ["No Filter", "No Filter", "No Filter", "No Filter", "Location", "No Filter", "No Filter", "No Filter", "No Filter"];
          var tableUrl = "archive_table"
        }
        
        var filterDateData = document.getElementsByName("filterdate")
        
        if (document.querySelector(".inventory-archive"))
        {
          var filterDateDefault = ["", "", "", ""];
        }
        else
        {
          var filterDateDefault = ["", "", "", "", "", ""];
          
        }

        var filterData = document.getElementsByName("filter")
        var filterDateData = document.getElementsByName("filterdate")
        var searchInventory = document.getElementById("search");
        var data = new FormData()
        data.append("search", searchInventory.value)

        if ((!(filterData && filterDateData)) || (filterData.length == 0 && filterDateData.length == 0))
        {
          for (let i = 0; i < filterdefault.length; i++)
          {
            data.append("filter", filterdefault[i])
          }

          for (let i = 0; i < filterDateDefault.length; i++)
          {
            data.append("filterdate", filterDateDefault[i])
          }
        }
        else 
        {
          for (let i = 0; i < filterData.length; i++)
          {
            data.append("filter", filterData[i].value)
          }
      
          for (let i = 0; i < filterDateData.length; i++)
          {
            data.append("filterdate", filterDateData[i].value)
          }
        }

        fetch(tableUrl, {
            "method": "POST",
            "body": data,
        }).then((response) => {
            return response.text();
        }).then((text) => {
          let div = document.createElement("div")
          div.innerHTML = text

          if (!(div.querySelector(".no-search-match")))
          {
            if (div.querySelector(".action-menu-wrapper"))
            {
              document.getElementById("insert-action-menu").removeChild(document.getElementById("insert-action-menu").firstElementChild)
            }
            
            document.getElementById("insert-inventory-table").removeChild(document.getElementById("insert-inventory-table").querySelector("#inventory-table"))
            
            if (div.querySelector(".action-menu-wrapper"))
            {
              document.getElementById("insert-action-menu").prepend(div.querySelector(".action-menu-wrapper"))
            }

            if (document.querySelector("#insert-inventory-table"))
            {
              document.getElementById("insert-inventory-table").prepend(div.querySelector("#inventory-table"))
            }
            
            if (document.querySelector(".pages").firstChild)
            {
              document.querySelector(".pages").removeChild(document.querySelector(".pages").firstChild)
            }
            
            tablePagination()
            actionButtonToggle()
            finishLoading()
            filterTable() 

            if (!(document.querySelector(".user-inventory") || document.querySelector(".user-view")))
            {
              showInfoOrHistory()
              showItemOptions()
            } 
          }
          else
          {
            if (document.querySelector(".no-search-match"))
            {
              var removeElement = document.querySelector(".no-search-match");
              removeElement.remove();
            }

            document.querySelector("#insert-inventory-table").insertAdjacentElement("beforebegin", div.querySelector(".no-search-match"))
            finishLoading()
            enableActionButton()

            document.querySelector(".no-search-match").addEventListener("animationend", function() {
              var removeElement = document.querySelector(".no-search-match");
              removeElement.remove();
            });
          }

        });
      }, 1000)
    }
  })
}