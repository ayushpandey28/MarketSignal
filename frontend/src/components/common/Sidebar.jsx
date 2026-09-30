import { NavLink } from 'react-router-dom';

export default function Sidebar({ items }) {
  return (
    <aside className="card h-fit p-3 md:w-56">
      <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 2}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
