import { Settings } from 'lucide-react';

import { LINKS } from '@/lib/constants';
import { cn } from '@/utils/cn';

import NavLink from '../components/NavLink';
import LogoutLink from '../components/LogoutLink';

export default function Sidebar() {
  return (
    <aside className={cn('d-flex flex-column align-items-center shadow-sm h-100 py-5')}>
      <div className="position-relative mb-5">
        <span
          className="d-flex align-items-center justify-content-center rounded-circle bg-body-secondary text-body-secondary fw-bold"
          style={{ width: '6rem', height: '6rem', fontSize: '2rem' }}
          aria-hidden
        >
          AM
        </span>
      </div>

      <nav className="mb-auto">
        <ul className={cn('list-unstyled m-0 d-flex flex-column gap-3')}>
          {LINKS.map(({ href, key }) => (
            <li className={cn('text-center')} key={href}>
              <NavLink href={href} text={key} />
            </li>
          ))}
        </ul>
      </nav>

      <LogoutLink />
    </aside>
  );
}
