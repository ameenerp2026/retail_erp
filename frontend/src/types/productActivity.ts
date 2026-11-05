export type ActivityType =
  | 'Stock Received'
  | 'Price Updated'
  | 'Barcode Generated'
  | 'Low Stock Alert'
  | 'Approval Granted'
  | 'Product Created'
  | 'Attribute Updated'
  | 'UOM Mapped'
  | 'Category Changed'
  | 'Hierarchy Updated'
  | string

export interface ProductActivityItem {
  id: string
  activity: ActivityType
  subtext?: string
  productCode: string
  productName: string
  details: string
  performedBy: string
  role?: string
  avatar: string
  avatarBg?: string
  dotColor?: string
  iconBg?: string
  iconType:
    | 'package'
    | 'tag'
    | 'barcode'
    | 'alert'
    | 'check'
    | 'box'
    | 'attribute'
    | 'uom'
    | 'category'
    | 'hierarchy'
  timestamp: string
}

