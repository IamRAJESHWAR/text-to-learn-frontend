// Fixed: wrong import path was './components/SidebarNavigation' (self-referencing)
import React from 'react';
import SidebarNavigation from './SidebarNavigation';
import { Outlet } from 'react-router-dom';
import AskAIWidget from './AskAIWidget';

const Layout = () => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <SidebarNavigation />
    <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
      <Outlet />
    </main>
    <AskAIWidget />
  </div>
);

export default Layout;
