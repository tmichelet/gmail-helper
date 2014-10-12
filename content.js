/*
  get the position of a node compared to the top of the page
*/
var cumulativeOffset = function(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};

/*
  get the index of a node in parent's children list
*/
var indexInParentNode = function(node) {
    var i = 1;
    while (node = node.previousSibling) {
        if (node.nodeType === 1) { ++i; }
    }
    return i;
};


/*
  When the current page changes, run the initialization script again
*/


function hashHandler() {
    this.oldHash = window.location.hash;
    this.Check;

    var that = this;
    var detect = function(){
        if(that.oldHash!=window.location.hash){
            window.setTimeout(initialize, 100);
            that.oldHash = window.location.hash;
        }
    };
    this.Check = setInterval(function() { detect(); }, 100);
}
var hashDetection = new hashHandler();
var SCROLLING_AREA_SELECTOR = 'Tm aeJ';
var ACTION_BAR_SELECTOR = 'nH aqK';
var PIXELS_OFFSET = 60;

// memory
var isUp = true;
var originalActionBarIndex, originlActionBarPosition, scrollingArea;
var actionBar, scrolled, rowToMove;

var initialize = function() {
  if(window.location.hash === "#inbox") {
    try {
      actionBar = document.getElementsByClassName(ACTION_BAR_SELECTOR);
      actionBar = actionBar[actionBar.length-1];
      rowToMove = actionBar.parentNode.parentNode;
      originalActionBarIndex = indexInParentNode(rowToMove);
      originlActionBarPosition = cumulativeOffset(actionBar);
      scrollingArea = document.getElementsByClassName(SCROLLING_AREA_SELECTOR)[0];
      scrollingArea.addEventListener("scroll", process);
    } catch(error) {
      window.setTimeout(initialize, 1000);
    }
  } else { window.setTimeout(initialize, 1000); }
};

var process = function() {
  scrolled = scrollingArea.scrollTop;
  if(originlActionBarPosition.top < scrolled + PIXELS_OFFSET) {
    if(isUp) {
      rowToMove.parentNode.appendChild(rowToMove);
      isUp = false;
    }
  }
  else {
    if(!isUp) {
      rowToMove.parentNode.insertBefore(rowToMove, rowToMove.parentNode.children[originalActionBarIndex]);
      isUp = true;
    }
  }
};
window.setTimeout(initialize, 5000);

