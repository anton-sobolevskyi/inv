import { LINKS } from '@/lib/constants';
import { cn } from '@/utils/cn';

import NavLink from '../components/NavLink';
import LogoutLink from '../components/LogoutLink';

export default function Sidebar() {
  return (
    <aside className={cn('d-flex flex-column justify-content-center shadow-sm h-100')}>
      <nav>
        <ul className={cn('list-unstyled')}>
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
