function isdefined( variable)
{
    return (typeof(window[variable]) == "undefined")?  false: true;
}

function isnull( variable ) {
  return !(typeof(variable) !== 'undefined' && variable != null);
}

// Method voor het ophalen van een item uit een array op basis van het item id.
function getItemFromArray( arr, itemId ) {
  for (i=0; i<arr.length; i++) {
    if ( arr[i].id == itemId ) {
      return arr[i];
    }
  }
}

function addLoadEvent(func) { 
  var oldonload = window.onload; 
  if (typeof window.onload != 'function') { 
    window.onload = func; 
  } else { 
    window.onload = function() { 
      if (oldonload) { 
        oldonload(); 
      } 
      func(); 
    }
  } 
} 


// Omdat het script meerdere keren aangeroepen kan worden op de pagina (door een widget) wordt hier bepaald of dat de queues al aanwezig zijn.
if ( isnull(bol_pml_item_queue) || isnull(bol_pml_url_queue) || isnull(bol_pml_item_counter) ) {
  var bol_pml_item_queue = new Array();
  var bol_pml_url_queue = new Array();
  var bol_pml_item_counter = 0;
  
  // Hang een extra onload op deze pagina.
  addLoadEvent(bol_pml_build_products);
}

function bol_pml_init(){

  if (!window.bol_pml) {
    return;
  }
  var item = window.bol_pml;
  var id = item.id;

  var url = item.urlPrefix+'/rest/catalog/1/getproducts?'+item.productId;

  var previewBox = document.getElementById('preview-box');
  
  if ( !isnull(previewBox) ) {
    var scriptUrl = url+'&methodid=bol_pml_build_product_link_inner()';
    bol_pml_do_script_call(scriptUrl, id);
    return;
  }

  if ( isnull(bol_pml_item_queue[id]) ) {
    bol_pml_item_queue[bol_pml_item_counter] = item;
    bol_pml_url_queue[bol_pml_item_counter] = url;
  }
  
  bol_pml_item_counter++;
}

// Method voor het inladen van all products die in de queue staan.
function bol_pml_build_products() {
  for (i=0; i<bol_pml_item_queue.length; i++) {
    var item = bol_pml_item_queue[i];
    
    var id = item.id;

    var scriptUrl = bol_pml_url_queue[i];
    
    scriptUrl +='&methodid=bol_pml_build_product_link_new(\''+id+'\')';
    bol_pml_do_script_call( scriptUrl, id );
  }
}

function bol_pml_do_script_call(scriptUrl,addid) {
  var dataScript = document.createElement("script");
  dataScript.src = scriptUrl; 

  var scriptPlace = document.getElementById(addid);
  scriptPlace.parentNode.insertBefore(dataScript, scriptPlace);
}

// Legacy method doordat inline script deze nog kan aanroepen.
function bol_pml_build_product_link() {
  // geen implementatie!
}

// Method voor het builden van een product (nieuwe variant).
function bol_pml_build_product_link_new(itemId){
  var bol_item = getItemFromArray(bol_pml_item_queue, itemId);
  
  bol_pml_build_product_link_inner(bol_item);
}

// Method voor het builden van een product (nieuwe variant).
function bol_pml_build_product_link_inner(bol_item){

  if ( isnull(bol_item) ) {
    bol_item = bol_pml;
  }

  //Delete old elements if they exist.
  var delElemS = document.getElementById( 'S'+bol_item.id);
  if ( delElemS ) {
    delElemS.parentNode.removeChild(delElemS);
  }
  var delElemB = document.getElementById( 'B'+bol_item.id);
  if ( delElemB ) {
    delElemB.parentNode.removeChild(delElemB);
  }
  var delElemH = document.getElementById( 'H'+bol_item.id);
  if ( delElemH ) {
    delElemH.parentNode.removeChild(delElemH);
  }
  var delElemC = document.getElementById( 'C'+bol_item.id );
  if( delElemC ) {
    delElemC.parentNode.removeChild(delElemC);
  }

  //CALCULATE THE TEXT LENGTH
  var colWidth = (Math.floor(bol_item.width/bol_item.cols)-10);
  
  if(bol_item.image){
    if(bol_item.image_size){
      var textLen = (colWidth - 85);
    }else{
      var textLen = (colWidth - 65);
    }
  }else{
    var textLen = (colWidth - 3);
  }
  var nrChar = Math.ceil(textLen/7);
  
  var imgWidth = 0;
  if(bol_item.image_size){
    imgWidth = '65';  
  }else{
    imgWidth = '45';  
  }
  
  
  //CREATE HTML
    //create the main div
    var mainDiv = document.createElement("div");
      mainDiv.className = 'bol_pml_box';
      mainDiv.id = 'S'+bol_item.id;

    var mainDivInner = document.createElement("div");
      mainDivInner.className = 'bol_pml_box_inner';
    
    
    if(!bolData.product.length){
      
      oldData = bolData.product;
      bolData.product = new Array;
      
      bolData.product[0] = oldData;
    }
    
    
    var maxImgHeight = 0;
    var maxImgWidth = 0;
    
    //loop over products
    var rowCounter = 1;
    for (var i = 0; i < bolData.product.length; ++i) {
      //create an element
      var elmDiv = document.createElement("div");
        elmDiv.className = 'bol_pml_element';
      
      
      var imgDiv = document.createElement("div");
        imgDiv.className = 'imgwrap_mini';

        //create img
        var imgElem = document.createElement("img");
          if(bolData.product[i].thumbnailUrl){
            if(bol_item.secure){
              bolData.product[i].thumbnailUrl = bolData.product[i].thumbnailUrl.replace("http://", "https://"); 
            }
            imgElem.src = bolData.product[i].thumbnailUrl;
          }else{
            if(bol_item.secure){
              imgElem.src = 'https://'+bol_item.baseUrl+'/partner/static/images/noimage_48x48default.gif';
            }else{
              imgElem.src = 'http://'+bol_item.baseUrl+'/partner/static/images/noimage_48x48default.gif';
            }
          } 

          oldWidth = imgElem.width;
          oldHeight = imgElem.height;
          
          calFactor = imgWidth/oldWidth;
          
          imgElem.border = 0;
          imgElem.width = imgWidth;
          newHeight = calFactor * oldHeight;
          if(newHeight > 1){
            imgElem.height = calFactor * oldHeight;
          }
          imgElem.alt =bolData.product[i].title;

          if ( imgElem.height > maxImgHeight ) {
            maxImgHeight = imgElem.height;
          }
          if ( imgElem.width > maxImgWidth ) {
            maxImgWidth = imgElem.width;
          }
          
          var imgLink = document.createElement("a");
          
          //<a href='http://"+this.baseUrl+"/click/click?p=1&amp;s="+$('sites_list').value+"&amp;t=p&amp;pid="+this.selectedData[j].id+"
          if(bol_item.target){
            imgLink.target = '_blank';
          }
          
          if(bol_item.secure){
            imgLink.href= 'https://'+bol_item.baseUrl+'/click/click?p=1&s='+bol_item.site_id+'&t=p&pid='+bolData.product[i].id+"&f=PDL";
          }else{
            imgLink.href= 'http://'+bol_item.baseUrl+'/click/click?p=1&s='+bol_item.site_id+'&t=p&pid='+bolData.product[i].id+"&f=PDL";
            
          }
          
          if(bol_item.link_subid.length > 0){
            imgLink.href = imgLink.href+"&subid="+escape(bol_item.link_subid);
          }
          if(bol_item.link_name.length > 0){
            imgLink.href = imgLink.href+"&name="+escape(bol_item.link_name);
          }
          imgLink.title =  bolData.product[i].title;
          
          imgLink.appendChild(imgElem);
          
          imgDiv.appendChild(imgLink);
      
      var detailsDiv = document.createElement("div");
        detailsDiv.className = 'product_details_mini';

      
      // create title span
      var titleSpan = document.createElement("span");
        
        var clickLink = document.createElement("a");
          
          //<a href='http://"+this.baseUrl+"/click/click?p=1&amp;s="+$('sites_list').value+"&amp;t=p&amp;pid="+this.selectedData[j].id+"
          if(bol_item.target){
            clickLink.target = '_blank';
          }
          
          if(bol_item.secure){
            clickLink.href= 'https://'+bol_item.baseUrl+'/click/click?p=1&s='+bol_item.site_id+'&t=p&pid='+bolData.product[i].id+"&f=PDL";
          }else{
            clickLink.href= 'http://'+bol_item.baseUrl+'/click/click?p=1&s='+bol_item.site_id+'&t=p&pid='+bolData.product[i].id+"&f=PDL";
          
          }
          
          if(bol_item.link_subid.length > 0){
            clickLink.href = clickLink.href+"&subid="+escape(bol_item.link_subid);
          }
          if(bol_item.link_name.length > 0){
            clickLink.href = clickLink.href+"&name="+escape(bol_item.link_name);
          }
          clickLink.title =  bolData.product[i].title;
          
        if(bolData.product[i].title.length > nrChar){
          clickLink.innerHTML = bolData.product[i].title.substr(0,nrChar)+'...';
        }else{
          clickLink.innerHTML = bolData.product[i].title;
        }
      
      titleSpan.appendChild(clickLink);
      
      if(bol_item.price){
        // create price 
        var priceSpan = document.createElement("span"); 
          priceSpan.className = 'bol_pml_price'; 
          priceSpan.innerHTML = '&euro; '+parseFloat(bolData.product[i].price).toFixed(2).toString().replace('.',',');
      }
      
      
      if(bol_item.rating && bolData.product[i].rating){
        // create rating  
        var ratingSpan = document.createElement("img"); 
          ratingSpan.border = 0;          
          if(bol_item.secure){
            ratingSpan.src = 'https://'+bol_item.baseUrl+'/partner/static/images/rating_'+Math.round(parseInt(bolData.product[i].rating)/5)*5+'.png';
          }else{
            ratingSpan.src = 'http://'+bol_item.baseUrl+'/partner/static/images/rating_'+Math.round(parseInt(bolData.product[i].rating)/5)*5+'.png';
          }
      }
      
      
      if(!isdefined('hideImpressions')){
        var impressionImg = document.createElement("img");
          if(bol_item.secure){
            impressionLink= 'https://'+bol_item.baseUrl+'/click/impression?p=1&s='+bol_item.site_id+'&t=p&pid='+bolData.product[i].id+"&f=PDL";
          }else{
            impressionLink= 'http://'+bol_item.baseUrl+'/click/impression?p=1&s='+bol_item.site_id+'&t=p&pid='+bolData.product[i].id+"&f=PDL";
          
          }
          if(bol_item.link_subid.length > 0){
            impressionLink = impressionLink+"&subid="+escape(bol_item.link_subid);
          }
          if(bol_item.link_name.length > 0){
            impressionLink = impressionLink+"&name="+escape(bol_item.link_name);
          }
          
          impressionImg.src = impressionLink;
          impressionImg.width=1;
          impressionImg.height=1;
          impressionImg.alt="";
      }
      
      
      //Add to page
      
      elmDiv.appendChild(imgDiv);
      
      detailsDiv.appendChild(titleSpan);
      if(bol_item.price){
        detailsDiv.appendChild(priceSpan);
      }
      if(bol_item.rating && bolData.product[i].rating){
        detailsDiv.appendChild(ratingSpan);
      }
      if(!isdefined('hideImpressions')){
        detailsDiv.appendChild(impressionImg);
      }
      elmDiv.appendChild(detailsDiv);
      mainDivInner.appendChild(elmDiv);
      
      
      
      
      // create clearer 
      if(rowCounter == bol_item.cols){
        var clearDiv = document.createElement("div");
          
          if (i < bolData.product.length-1){
            clearDiv.className = 'clearer spacer';
          }else{
            clearDiv.className = 'clearer';
          }
          
        rowCounter =1
        mainDivInner.appendChild(clearDiv);
      }else{
        rowCounter++;
      }
    }
    
    var clearDiv = document.createElement("div");
      clearDiv.className = 'clearer';
    mainDivInner.appendChild(clearDiv);
    mainDiv.appendChild(mainDivInner);

  var scriptPlace = document.getElementById(bol_item.id);
    scriptPlace.parentNode.insertBefore(mainDiv, scriptPlace);

  // Voeg de css toe aan de header. (Dit staat onderin vanwege het nodig hebben van de img hoogte.
  product_createStyle(bol_item, colWidth, maxImgHeight, maxImgWidth);

  
  document.getElementById('B'+bol_item.id).style.display = 'none';
  
}

function product_createStyle(bol_item, colWidth, iHeight, iWidth) {

  var imgPos = 'left';
  var imgSpace = '0 0 0 10px';
  if(bol_item.image_position == "right"){
    imgPos  = 'right';
    imgSpace = '0 10px 0 0';
  }

  var imgContainerHeight = iHeight;
  if ( imgContainerHeight < 60 ) {
    imgContainerHeight = 60;
  }
  var imgContainerWidth = iWidth;
  if ( imgContainerWidth < 75 ) {
    imgContainerWidth = 75;
  }
  var detailsContainerWidth = colWidth - imgContainerWidth - 10;
  if ( detailsContainerWidth < 40 ) {
    detailsContainerWidth = 40;
  }
  var elementWidth = colWidth;
  if ( ( bol_item.width - colWidth) < 20 ) {
    elementWidth = elementWidth - (bol_item.width - colWidth);
  }
    
  //CREATE CSS
  var headID = document.getElementsByTagName("head")[0];
  var cssNode = document.createElement('style');
    var def = '#S'+bol_item.id+' { overflow: hidden; background:'+bol_item.background_color+'; border:1px solid '+bol_item.border_color+'; padding:12px 10px 10px 10px; width:'+bol_item.width+'px; font-family:verdana; font-size:11px; color:'+bol_item.text_color+'   }';
    def += '#S'+bol_item.id+'  div { font-family:verdana; font-size:11px; color:'+bol_item.text_color+'   }';
    def += '#S'+bol_item.id+' .bol_pml_box_inner { float:'+imgPos+'}';
    def += '#S'+bol_item.id+' .bol_pml_element { float:left; width: '+elementWidth+'px;  }';
    def += '#S'+bol_item.id+' .bol_pml_element img { border:none; margin:0; }';
    def += '#S'+bol_item.id+' .bol_pml_element span { display:block; padding:0 0 5px 0; text-align:'+imgPos+';}';
    def += '#S'+bol_item.id+' .bol_pml_element a { color:'+bol_item.link_color+'; }';
    def += '#S'+bol_item.id+' .bol_pml_element .imgwrap_mini { float:'+imgPos+'; }';
    def += '#S'+bol_item.id+' .bol_pml_element .imgwrap_mini img { width:'+iWidth+'px; }';
    def += '#S'+bol_item.id+' .bol_pml_element .product_details_mini { width:'+detailsContainerWidth+'px; float:'+imgPos+'; margin:'+imgSpace+'; }';
    def += '#S'+bol_item.id+' .bol_pml_element .product_details_mini img { float:'+imgPos+';}';
    def += '#S'+bol_item.id+' .clearer { clear:both; height:1px; }';
    def += '#S'+bol_item.id+' .bol_pml_price { font-weight:bold; color:'+bol_item.text_color+'; }';
    def += '#S'+bol_item.id+' .spacer { height:10px; }';
    
  cssNode.setAttribute("type", "text/css");
  cssNode.id = "C"+bol_item.id;
  
  //loader
  var loaderBox = document.createElement("div");
    loaderBox.id = 'B'+bol_item.id;
  
    var loaderImg = document.createElement("img");
      if(bol_item.secure){
        loaderImg.src = 'https://'+bol_item.baseUrl+'/partner/static/images/ajax-loader.gif';
      }else{
        loaderImg.src = 'http://'+bol_item.baseUrl+'/partner/static/images/ajax-loader.gif';
      }
    loaderBox.appendChild(loaderImg);
  var scriptPlace = document.getElementById(bol_item.id);
    scriptPlace.parentNode.insertBefore(loaderBox, scriptPlace);
    
  
  
  if (cssNode.styleSheet) {   // IE
    cssNode.styleSheet.cssText = def;
  } else {                // the world
    var tt1 = document.createTextNode(def);
    cssNode.appendChild(tt1);
  }
  headID.appendChild(cssNode);
  //headID.appendChild(cssNode);
}

// Roep de init aan zodat een nieuwe call in de queue wordt gezet.
bol_pml_init();
