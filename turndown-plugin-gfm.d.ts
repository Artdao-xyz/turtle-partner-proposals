declare module "turndown-plugin-gfm" {
  type TurndownPlugin = (service: { use: (plugin: TurndownPlugin) => void }) => void;
  export const gfm: TurndownPlugin;
  export const tables: TurndownPlugin;
  export const strikethrough: TurndownPlugin;
  export const taskListItems: TurndownPlugin;
}
