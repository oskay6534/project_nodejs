module.export={
privGroups:[

{
    id:"USERS",
    name:"User Permissions"
},
{
    id:"ROLES",
    name:"Role Permissions"
},
{
    id:"AUDİTLOGS",
    name:"Audit Log Permissions"
}
    
],
privigiles:[
    {key:"user_view",
        name:"User View",
        group:"USERS",
        description:"User View Permission"


    },
      {key:"user_add",
        name:"User ADD",
        group:"USERS",
        description:"User ADD Permission"


    },
      {key:"user_update",
        name:"User Update",
        group:"USERS",
        description:"User Update Permission"


    },  {key:"user_delete",
        name:"User Delete",
        group:"USERS",
        description:"User Delete Permission"


    },
    {key:"role_view",
        name:"Role View",
        group:"ROLES",
        description:"Role View Permission"


    },
        {key:"role_add",
        name:"Role ADD",
        group:"ROLES",
        description:"Role ADD Permission"


    },
        {key:"role_update",
        name:"Role Update",
        group:"ROLES",
        description:"Role Update Permission"


    },  {key:"role_delete",
        name:"Role Delete",
        group:"ROLES",
        description:"Role Delete Permission"


    },

      {key:"cateory_view",
        name:"Cateory View",
        group:"CATEGORIES",
        description:"Cateory View Permission"


    },
      {key:"cateory_add",
        name:"Cateory ADD",
        group:"CATEGORIES",
        description:"Cateory ADD Permission"


    },
        {key:"cateory_update",  
        name:"Cateory Update",
        group:"CATEGORIES",
        description:"Cateory Update Permission"
    },  {key:"cateory_delete",
        name:"Cateory Delete",
        group:"CATEGORIES",
        description:"Cateory Delete Permission"


    },      
    
    {key:"auditlogs_view",
        name:"Audit Logs View",
        group:"AUDITLOGS",
        description:"Audit Logs View Permission"


    },  
]
}