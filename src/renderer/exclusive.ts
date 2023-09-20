import { ipcRenderer } from 'electron';

var hideTimeout = null;

function exclusiveModeUpdated(info) {
  console.log('exclusive mode updates', info);

  if (info.eventName === 'enter') {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    document.querySelector('.notification-text').classList.add('hide');
    //$(".notification-text").addClass("hide");

    _updateHotkeyHtml(info);

    document.body.classList.add('active');
    //$('body').addClass('active');
  }
  if (info.eventName === 'exit') {
    //$('body').removeClass('active');
    document.body.classList.remove('active');

    hideTimeout = setTimeout(() => {
      ipcRenderer.send('HIDE_EXCLUSIVE');
      ///overwolf.windows.hide("index",function(){});
    }, 1000);
  }
}

function _updateHotkeyHtml(info) {
  let className = '.notification-text-dock';
  let label = '<h1>to return to the game (owe)</h1>';
  let html = '';
  if (info.hasOwnProperty('releaseHotkeyString') && info.releaseHotkeyString) {
    let hotkeys = info.releaseHotkeyString.split('+');

    for (let hotkey of hotkeys) {
      html += "<span class='hotkey'>" + hotkey + '</span>';
    }
    html += label;
  } else {
    html = label;
  }
  const classElement = document.querySelector(className);
  classElement.innerHTML = html;
  classElement.classList.remove('hide');
  // $(className).empty();
  // $(className).html(html);
  //$(className).removeClass("hide");
}

// Define a function to handle visibility changes
function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    exclusiveModeUpdated({
      eventName: 'enter',
      releaseHotkeyString: 'Ctrl+Tab',
    });
  }
}

// Attach the event listener to the document
document.addEventListener('visibilitychange', handleVisibilityChange);
handleVisibilityChange();

ipcRenderer.on('EXCLUSIVE_MODE', (event, enter) => {
  exclusiveModeUpdated({
    eventName: enter ? 'enter' : 'exit',
    releaseHotkeyString: 'Ctrl+Tab',
  });
});
