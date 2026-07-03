export type AccountGroupNode = {
  id: string
  code: string
  name: string
  level: 1 | 2 | 3
  children?: AccountGroupNode[]
}