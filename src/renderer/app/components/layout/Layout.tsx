import React from 'react';
import SideNavbar from './side-navigation';
import Routing from '../router/routing';

function AppLayout() {
  return (
    <>
      <SideNavbar />
      <main className='main'>
        <Routing />
      </main>
    </>
  );
}

export default AppLayout;
