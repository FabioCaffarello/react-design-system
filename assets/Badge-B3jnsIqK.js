import{j as o}from"./jsx-runtime-D_zvdyIk.js";function i({variant:a="neutral",className:r="",children:e,...n}){const t=["inline-flex","items-center","px-2","py-1","rounded","text-xs","font-medium","border"],s={success:"bg-green-100 text-green-800 border-green-500",warning:"bg-yellow-100 text-yellow-800 border-yellow-500",error:"bg-red-100 text-red-800 border-red-500",info:"bg-blue-100 text-blue-800 border-blue-500",neutral:"bg-gray-100 text-gray-800 border-gray-500"},l=[...t,s[a],r].filter(Boolean).join(" ");return o.jsx("span",{role:"status","aria-label":typeof e=="string"?e:void 0,className:l,...n,children:e})}i.__docgenInfo={description:`Badge Component

A versatile badge component for displaying status, priority, and other labels.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<Badge variant="success">Active</Badge>
<Badge variant="error">Critical</Badge>
\`\`\``,methods:[],displayName:"Badge",props:{variant:{required:!1,tsType:{name:"union",raw:'"success" | "warning" | "error" | "info" | "neutral"',elements:[{name:"literal",value:'"success"'},{name:"literal",value:'"warning"'},{name:"literal",value:'"error"'},{name:"literal",value:'"info"'},{name:"literal",value:'"neutral"'}]},description:"",defaultValue:{value:'"neutral"',computed:!1}},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["HTMLAttributes"]};export{i as B};
