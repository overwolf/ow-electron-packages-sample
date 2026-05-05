import React from 'react';
import { ipcRenderer } from 'electron';

const MoreActionsButtons: React.FC = () => {
  const handleResize = () => {
    console.log('resize click ', new Date().toString());
    ipcRenderer.send('randomResize');
  };
  //----------------------------------------------------------------------------------------------------------------

  const handleMove = () => {
    console.log('move click ', new Date().toString());
    ipcRenderer.send('randomMove');
  };
  //----------------------------------------------------------------------------------------------------------------

  const handleDevTools = () => {
    ipcRenderer.send('devtools');
  };

  //----------------------------------------------------------------------------------------------------------------
  const handleDrag = () => {
    ipcRenderer.send('startDraggingOsr')
  };

  //----------------------------------------------------------------------------------------------------------------

  return (
    <>
      <br />
      <hr />
      <section className="more-actions-button">
        <button onClick={handleResize}>Random resize</button>

        <button onClick={handleMove}>Random move</button>

        <button onClick={handleDevTools}>Devtool</button>

        <button onMouseDown={handleDrag}>Drag</button>
      </section>
    </>
  );
};

export default MoreActionsButtons;
