import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { Toaster } from 'sonner';
import FormPreviewLayout from './pages/FormPreview/FormPreview';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Form builder</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <div className="h-dvh w-dvw">
      <Toaster />
      <div data-vaul-drawer-wrapper="" className="mx-auto h-screen">
        <FormPreviewLayout>
          <Outlet />
        </FormPreviewLayout>
      </div>
    </div>
  );
}
