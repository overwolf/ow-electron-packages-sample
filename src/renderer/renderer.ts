console.log('renderer script');

//@ts-ignore
window.gep.onMessage(function(...args) {
  console.info(...args);

  let item = ''
  args.forEach(arg => {
    item = `${item}-${JSON.stringify(arg)}`;
  })
  addMessageToTerminal(item);

});


const btn = document.querySelector('#clearTerminalTextAreaBtn') as HTMLButtonElement;

btn.addEventListener('click', function(e) {
  var begin = new Date().getTime();
  const terminal = document.querySelector('#TerminalTextArea');
  terminal.innerHTML = '';
});

const setRequiredBtn = document.querySelector('#setRequiredFeaturesBtn') as HTMLButtonElement;
setRequiredBtn.addEventListener('click', async function(e) {
  try {
    // @ts-ignore
    await window.gep.setRequiredFeature();
    addMessageToTerminal('setRequiredFeatures ok');
  } catch (error) {
    addMessageToTerminal('setRequiredFeatures error');
    alert('setRequiredFeatures error' + error);
  }
});

const getInfoBtn = document.querySelector('#getInfoBtn') as HTMLButtonElement;
getInfoBtn.addEventListener('click', async function(e) {
  try {
    // @ts-ignore
    const info = await window.gep.getInfo();
    addMessageToTerminal(JSON.stringify(info));
  } catch (error) {
    addMessageToTerminal('getInfo error');
    alert('getInfo error' + error);
  }
});

const createOSRBtn = document.querySelector('#createOSR') as HTMLButtonElement;
createOSRBtn.addEventListener('click', async function(e) {
  try {
    // @ts-ignore
    const info = await window.osr.openOSR();
  } catch (error) {
    addMessageToTerminal('createOSR error');
  }
});

const visibilityOSRBtn = document.querySelector('#visibilityOSR') as HTMLButtonElement;
visibilityOSRBtn.addEventListener('click', async function(e) {
  try {
    // @ts-ignore
    const info = await window.osr.toggle();
  } catch (error) {
    console.log(error);
    addMessageToTerminal('toggle osr error');
  }
});


const updateHotkeyBtn = document.querySelector('#updateHotkey') as HTMLButtonElement;
updateHotkeyBtn.addEventListener('click', async function(e) {
  try {
    // @ts-ignore
    const info = await window.osr.updateHotkey();
  } catch (error) {
    console.log(error);
    addMessageToTerminal('toggle osr error');
  }
});


function addMessageToTerminal(message) {
  const terminal = document.querySelector('#TerminalTextArea');
  // $('#TerminalTextArea');
  terminal.append(message + '\n');
  terminal.scrollTop = terminal.scrollHeight;
}
