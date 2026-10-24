export type AppId =
  | "profile"
  | "projects"
  | "academic"
  | "terminal"
  | "contact";

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface AppDefinition {
  id: AppId;
  titleKey: string;
  icon: string;
  defaultSize: { width: number; height: number };
}
