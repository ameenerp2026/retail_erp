export type RoleType=
    |'STANDARD'
     |'MANAGER'
    |'ADMIN'
    |'SUPER_ADMIN' 

    export type RoleStatus= 'ACTIVE'|'INACTIVE'

    export interface Role{
        id:number;
        name:string;
        description:string;
        roleType:RoleType;
        userCount:number;
        permissionCount:number;
        status:RoleStatus;
        createdAt:string;
        updatedAt:string;
    }
   