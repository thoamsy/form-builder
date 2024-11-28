import { type RouteConfig, route } from '@react-router/dev/routes';

export default [
  route('/', './pages/Home/page.tsx'),
  route('builder/:formId', './pages/FormBuilder/FormBuilder.tsx'),
] satisfies RouteConfig;
