export type HierarchyLevel = 'GROUP' | 'DEPARTMENT' | 'SECTION'

export type HierarchyNode = {
  id: number
  code: string
  name: string
  level: HierarchyLevel
  parentId: number | null
  status: 'ACTIVE' | 'INACTIVE'
}

export const MOCK_HIERARCHY_NODES: HierarchyNode[] = [
  { id: 1, code: 'ELEC', name: 'Electronics', level: 'GROUP', parentId: null, status: 'ACTIVE' },
  { id: 2, code: 'MOB', name: 'Mobiles', level: 'DEPARTMENT', parentId: 1, status: 'ACTIVE' },
  { id: 3, code: 'SMART', name: 'Smartphones', level: 'SECTION', parentId: 2, status: 'ACTIVE' },
  { id: 4, code: 'FEATURE', name: 'Feature Phones', level: 'SECTION', parentId: 2, status: 'ACTIVE' },
  { id: 5, code: 'AUDIO', name: 'Audio', level: 'DEPARTMENT', parentId: 1, status: 'ACTIVE' },
  { id: 6, code: 'HEAD', name: 'Headphones', level: 'SECTION', parentId: 5, status: 'ACTIVE' },
  { id: 7, code: 'APP', name: 'Apparel', level: 'GROUP', parentId: null, status: 'ACTIVE' },
  { id: 8, code: 'CLO', name: 'Clothing', level: 'DEPARTMENT', parentId: 7, status: 'ACTIVE' },
  { id: 9, code: 'TSHIRT', name: 'T-Shirts', level: 'SECTION', parentId: 8, status: 'ACTIVE' },
  { id: 10, code: 'JEANS', name: 'Jeans', level: 'SECTION', parentId: 8, status: 'ACTIVE' },
  { id: 11, code: 'FOOT', name: 'Footwear', level: 'DEPARTMENT', parentId: 7, status: 'ACTIVE' },
  { id: 12, code: 'SNEAK', name: 'Sneakers', level: 'SECTION', parentId: 11, status: 'ACTIVE' },
  { id: 13, code: 'FMCG', name: 'FMCG', level: 'GROUP', parentId: null, status: 'ACTIVE' },
  { id: 14, code: 'CARE', name: 'Personal Care', level: 'DEPARTMENT', parentId: 13, status: 'ACTIVE' },
  { id: 15, code: 'BATH', name: 'Bath & Body', level: 'SECTION', parentId: 14, status: 'ACTIVE' },
  { id: 16, code: 'GROC', name: 'Grocery', level: 'DEPARTMENT', parentId: 13, status: 'ACTIVE' },
  { id: 17, code: 'STAP', name: 'Staples', level: 'SECTION', parentId: 16, status: 'ACTIVE' },
  { id: 18, code: 'HARD', name: 'Hardware', level: 'GROUP', parentId: null, status: 'ACTIVE' },
  { id: 19, code: 'POWER', name: 'Power Tools', level: 'DEPARTMENT', parentId: 18, status: 'ACTIVE' },
  { id: 20, code: 'DRILL', name: 'Drills', level: 'SECTION', parentId: 19, status: 'ACTIVE' },
  { id: 21, code: 'ELECTR', name: 'Electrical', level: 'DEPARTMENT', parentId: 18, status: 'ACTIVE' },
]
