import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Drawer } from '@/components/ui/drawer';
import { useEffect, useState } from 'react';

export const DrawerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(location.pathname.includes('preview'));
  }, [location.pathname]);

  return (
    <Drawer
      open={open}
      onAnimationEnd={(open) => !open && navigate(-1)}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <Outlet />
    </Drawer>
  );
};
