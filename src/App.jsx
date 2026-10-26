import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'

import Dashboard from './pages/Dashboard'
import ServiceSimulator from './pages/ServiceSimulator'
import Resources from './pages/Resources'
import ActivityLogs from './pages/ActivityLogs'
import Analytics from './pages/Analytics'
import SettingsAbout from './pages/SettingsAbout'

function AppShell() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-wrapper">
        <TopBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulator" element={<ServiceSimulator />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/logs" element={<ActivityLogs />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/about" element={<SettingsAbout />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

export default App
