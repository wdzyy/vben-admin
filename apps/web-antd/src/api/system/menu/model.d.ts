export interface Menu {
  createBy?: any;
  createTime: string;
  updateBy?: any;
  updateTime?: any;
  remark?: any;
  menuId: number;
  title: string;
  parentName?: string;
  parentId: number;
  order: number;
  path: string;
  component?: string;
  query: string;
  isFrame: string;
  keepAlive: string;
  menuType: string;
  hideInMenu: string;
  status: string;
  perms: string;
  icon: string;
  children: Menu[];
}

/**
 * @description 菜单信息
 * @param label 菜单名称
 */
export interface MenuOption {
  id: number;
  parentId: number;
  label: string;
  weight: number;
  children: MenuOption[];
}

/**
 * @description 菜单返回
 * @param checkedKeys 选中的菜单id
 * @param menus 菜单信息
 */
export interface MenuResp {
  checkedKeys: number[];
  menus: MenuOption[];
}
