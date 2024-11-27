// React Router generated types for route:
// ./pages/FormPreview/Page.tsx

import type * as T from "react-router/route-module"

import type { Info as Parent0 } from "../../../+types/root"
import type { Info as Parent1 } from "../../../+types/DrawerLayout"
import type { Info as Parent2 } from "../../FormBuilder/+types/FormBuilder"

type Module = typeof import("../Page")

export type Info = {
  parents: [Parent0, Parent1, Parent2],
  id: "pages/FormPreview/Page"
  file: "./pages/FormPreview/Page.tsx"
  path: "preview"
  params: {"formId": string}
  module: Module
  loaderData: T.CreateLoaderData<Module>
  actionData: T.CreateActionData<Module>
}

export namespace Route {
  export type LinkDescriptors = T.LinkDescriptors
  export type LinksFunction = () => LinkDescriptors

  export type MetaArgs = T.CreateMetaArgs<Info>
  export type MetaDescriptors = T.MetaDescriptors
  export type MetaFunction = (args: MetaArgs) => MetaDescriptors

  export type HeadersArgs = T.HeadersArgs
  export type HeadersFunction = (args: HeadersArgs) => Headers | HeadersInit

  export type LoaderArgs = T.CreateServerLoaderArgs<Info>
  export type ClientLoaderArgs = T.CreateClientLoaderArgs<Info>
  export type ActionArgs = T.CreateServerActionArgs<Info>
  export type ClientActionArgs = T.CreateClientActionArgs<Info>

  export type HydrateFallbackProps = T.CreateHydrateFallbackProps<Info>
  export type ComponentProps = T.CreateComponentProps<Info>
  export type ErrorBoundaryProps = T.CreateErrorBoundaryProps<Info>
}