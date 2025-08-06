"use client";

type AdminNavbarProps = {
  onMenuClick: () => void;
  user: any;
  onLogout: () => void;
  sidebarCollapsed: boolean;
};

export default function AdminNavbar({ 
  onMenuClick, 
  user, 
  onLogout, 
  sidebarCollapsed 
}: AdminNavbarProps) {
  return (
    <header 
      className="bg-white shadow-sm fixed z-30 transition-all duration-300" 
      style={{ 
        left: sidebarCollapsed ? '5rem' : '16rem',
        width: sidebarCollapsed ? 'calc(100% - 5rem)' : 'calc(100% - 16rem)'
      }}
    >
      <div className="px-4 py-3 flex items-center justify-between">
        <button 
          onClick={onMenuClick}
          className="text-gray-500 hover:text-gray-600 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-lg text-black font-semibold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <span className="text-sm hidden text-black sm:inline">{user.name}</span>
              <button 
                onClick={onLogout}
                className="text-sm text-red-600 hover:text-red-800"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}