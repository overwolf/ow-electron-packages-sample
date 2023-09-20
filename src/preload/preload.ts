
console.log('** preload **')
const { contextBridge, ipcRenderer  } = require('electron');

async function initialize () {
  function replaceText (selector: string, text: string) {
   const element = document.querySelector<HTMLElement>(selector);
   if (element) {
     element.innerText = text;
   }
 }

 replaceText('.electron-version', `ow-electron v${process.versions.electron}`);
}

contextBridge.exposeInMainWorld('app', {
 initialize
});

contextBridge.exposeInMainWorld('gep', {
  onMessage: (func) =>{
    ipcRenderer.on('console-message',(e, ...args)=>{
      func(...args);
    });
  },

  setRequiredFeature: () => {
    return ipcRenderer.invoke('gep-set-required-feature');
  },

  getInfo: () => {
    return ipcRenderer.invoke('gep-getInfo');
  },
});

contextBridge.exposeInMainWorld('osr', {
  openOSR: () => {
    return ipcRenderer.invoke('createOSR');
  },
  toggle: () => {
    return ipcRenderer.invoke('toggleOSRVisibility');
  },
  updateHotkey: () => {
    return ipcRenderer.invoke('updateHotkey');
  },
});

contextBridge.exposeInMainWorld('overlay', {
  setExclusiveModeType: (mode) => {
    return ipcRenderer.invoke('EXCLUSIVE_TYPE', mode);
  },
  setExclusiveModeHotkeyBehavior: (behavior) => {
    return ipcRenderer.invoke('EXCLUSIVE_BEHAVIOR',behavior );
  },
  updateExclusiveOptions: (options) => {
    return ipcRenderer.invoke('updateExclusiveOptions', options);
  }
});


