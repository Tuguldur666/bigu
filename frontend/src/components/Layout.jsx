import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const displayName = user?.companyName || (user?.lastname ? `${user.lastname} ${user.firstname}` : '')
  const initial = displayName[0]?.toUpperCase() || 'U'

  return (
    <div className="app">
      <div className="navbar">
        <div className="navbar__logo" onClick={() => navigate('/')}>
          <div className="navbar__logo-img"><span>Z</span></div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-name">zangia.mn</span>
            <span className="navbar__logo-tagline">МОНГОЛЫН ИРГЭН БҮРД АЖЛЫН БАЙР!</span>
          </div>
        </div>
        <div className="navbar__links">
          <span className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`} onClick={() => navigate('/')}>Ажлын зар</span>
          <span className={`navbar__link ${isActive('/companies') ? 'navbar__link--active' : ''}`} onClick={() => navigate('/companies')}>Компани</span>
          <span className="navbar__link">GWA</span>
          {user?.type === 'employer' && (
            <span className={`navbar__link ${isActive('/profile') ? 'navbar__link--active' : ''}`} onClick={() => navigate('/profile')}>Профайл</span>
          )}
        </div>
        <div className="navbar__right">
          {user ? (
            <div className="navbar__user">
              <div className="navbar__avatar">{initial}</div>
              <span className="navbar__username">{displayName}</span>
              <button className="btn btn--logout" onClick={logout}>Гарах</button>
            </div>
          ) : (
            <>
              <button className="btn btn--primary" onClick={() => navigate('/login', { state: { tab: 'seeker' } })}>Нэвтрэх</button>
              <button className="btn btn--outline" onClick={() => navigate('/login', { state: { tab: 'employer' } })}>Ажил олгогч</button>
            </>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  )
}