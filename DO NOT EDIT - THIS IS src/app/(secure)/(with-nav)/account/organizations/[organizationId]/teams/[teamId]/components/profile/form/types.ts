export type FlexComponentProps<TEditConfig, TViewConfig> = TEditConfig & {
  editing?: boolean
  viewConfig: TViewConfig
}
