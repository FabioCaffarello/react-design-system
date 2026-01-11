import{j as i}from"./jsx-runtime-D_zvdyIk.js";function c({error:e=!1,resize:n="vertical",className:r="",...a}){const o=["block","w-full","rounded","px-large","py-medium","border","text-base","focus:outline-none","focus:ring-2","focus:ring-offset-2"],t={none:"resize-none",both:"resize",horizontal:"resize-x",vertical:"resize-y"},s=e?"border-red-500 focus:ring-red-500":"border-gray-300 focus:ring-indigo-500",l=[...o,t[n],s,r].filter(Boolean).join(" ");return i.jsx("textarea",{className:l,"aria-invalid":e,"aria-describedby":e&&a.id?`${a.id}-error`:void 0,...a})}c.__docgenInfo={description:`Textarea Component

A styled textarea component for longer text input.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<Textarea 
  placeholder="Enter description..."
  rows={4}
/>
\`\`\``,methods:[],displayName:"Textarea",props:{error:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},resize:{required:!1,tsType:{name:"union",raw:'"none" | "both" | "horizontal" | "vertical"',elements:[{name:"literal",value:'"none"'},{name:"literal",value:'"both"'},{name:"literal",value:'"horizontal"'},{name:"literal",value:'"vertical"'}]},description:"",defaultValue:{value:'"vertical"',computed:!1}},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["TextareaHTMLAttributes"]};export{c as T};
