import { type RouteConfig, route, layout } from '@react-router/dev/routes';

export default [
  layout('./DrawerLayout.tsx', [
    route('/', './pages/Home/page.tsx', [
      route(':formId/preview', './pages/FormPreview/FormPreview.tsx'),
    ]),
    route('builder/:formId', './pages/FormBuilder/FormBuilder.tsx', [
      // 这种 preview 的做法可能有问题，还是要改成直接 render Layout 的模式
      route('preview', './pages/FormPreview/Page.tsx'),
    ]),
  ]),
] satisfies RouteConfig;
