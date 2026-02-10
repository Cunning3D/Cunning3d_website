'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VERSION_LIST = ['v1.2', 'v1.1', 'v1.0'];
const LATEST = 'v1.2';

interface VersionSwitcherProps {
  currentVersion?: string;
  availableVersions?: string[];
  className?: string;
}

export function VersionSwitcher({ currentVersion = LATEST, availableVersions = VERSION_LIST, className }: VersionSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleVersionChange = (version: string) => {
    if (version === currentVersion || !pathname) return;
    const pathParts = pathname.split('/').filter(Boolean);
    const isVersioned = VERSION_LIST.includes(pathParts[1]);
    let newPath: string;
    if (version === LATEST) {
      newPath = isVersioned ? `/${pathParts[0]}/${pathParts.slice(2).join('/')}` : pathname;
    } else {
      newPath = isVersioned
        ? `/${pathParts[0]}/${version}/${pathParts.slice(2).join('/')}`
        : `/${pathParts[0]}/${version}/${pathParts.slice(1).join('/')}`;
    }
    router.push(newPath);
  };

  return (
    <Select value={currentVersion} onValueChange={handleVersionChange}>
      <SelectTrigger className={`w-24 h-7 text-xs ${className ?? ''}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableVersions.map((v) => (
          <SelectItem key={v} value={v} className="text-xs">
            {v}{v === LATEST && ' (latest)'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
