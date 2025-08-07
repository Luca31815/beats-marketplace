// src/components/NavMenu.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavMenu() {
  return (
    <nav className="bg-gray-900 text-gray-200 p-4">
      <ul className="flex space-x-6 list-none m-0 p-0">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-gray-200 transition'
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/test"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-gray-200 transition'
            }
          >
            Test Conn.
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/twtest"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-gray-200 transition'
            }
          >
            TW Test
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-gray-200 transition'
            }
          >
            Register
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-gray-200 transition'
            }
          >
            Login
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/upload"
            className={({ isActive }) =>
              isActive
                ? 'text-white font-semibold'
                : 'text-gray-400 hover:text-gray-200 transition'
            }
          >
            Upload
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
