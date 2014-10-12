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


/*
  handle debug
*/
var debug = function(message) {
  if(shouldDebug) {
    console.log(message);
  }
};


/*
  actually do something
*/
var SCROLLING_AREA_SELECTOR = 'Tm aeJ';
var ACTION_BAR_SELECTOR = 'nH aqK';
var PIXELS_OFFSET = 60;

// memory
var originalActionBarIndex, originlActionBarPosition, scrollingArea;
var actionBarCandidates, actionBar, scrolled, rowToMove;
var processTimeout;
var shouldDebug = true;

var initialize = function() {
  if(window.location.hash.indexOf("#inbox") !== -1) {
    debug('INITIALIZATION');
    try {
      actionBar = null;
      actionBarCandidates = document.getElementsByClassName(ACTION_BAR_SELECTOR);
      /* the ation bar is the last visible element from the former list */
      for (var i = actionBarCandidates.length - 1; i >= 0; i--) {
        if(actionBarCandidates[i].offsetParent !== null) {
          actionBar = actionBarCandidates[i];
          break;
        }
      }
      if(actionBar === null) {
        throw "nothing visible yet";
      }
      rowToMove = actionBar.parentNode.parentNode;
      originalActionBarIndex = indexInParentNode(rowToMove);
      originlActionBarPosition = cumulativeOffset(actionBar);
      scrollingArea = document.getElementsByClassName(SCROLLING_AREA_SELECTOR)[0];
      scrollingArea.addEventListener("scroll", deferProcess);

      debug(actionBar);
      debug(rowToMove);
      debug(originalActionBarIndex);
      debug(originlActionBarPosition);
      debug(scrollingArea);
    } catch(error) {
      debug(error);
      window.setTimeout(initialize, 1000);
    }
  } else { window.setTimeout(initialize, 1000); }
};

var computeIsUp = function(node) {
  return [].indexOf.call(node.parentNode.children, node) !== node.parentNode.children.length - 1;
};

// debounce the process function to avoid computing it too often
var deferProcess = function() {
  window.clearTimeout(processTimeout);
  processTimeout = window.setTimeout(process, 100);
};

var process = function() {
  scrolled = scrollingArea.scrollTop;
  var isUp = computeIsUp(rowToMove);
  debug('-');
  debug('top: ' + originlActionBarPosition.top);
  debug('scrolled: ' + scrolled);
  debug('isUp: ' + isUp);
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
