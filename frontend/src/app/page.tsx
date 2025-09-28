'use client';

import { useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function HomePage() {
  const router = useRouter();
  const { authenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.replace(paths.auth.jwt.login);
    }
  }, [authenticated, loading, router]);

  if (!authenticated) {
    return null;
  }

  return <></>;
}
