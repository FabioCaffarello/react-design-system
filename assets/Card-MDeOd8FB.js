import{j as d}from"./jsx-runtime-D_zvdyIk.js";function m({variant:e="default",padding:a="medium",className:l="",children:n,...s}){const r=["bg-white","rounded-lg","border","border-gray-200","shadow-sm"],t={default:"",hover:"hover:shadow-md transition-shadow cursor-pointer",selected:"border-indigo-500 shadow-md"},o={none:"",small:"p-2",medium:"p-4",large:"p-6"},i=[...r,t[e],o[a],l].filter(Boolean).join(" ");return d.jsx("div",{className:i,...s,children:n})}m.__docgenInfo={description:`Card Component

A versatile card component for displaying content in containers.
Follows Atomic Design principles as a Molecule component.
Can be used to replace BoxWrapper in many cases with more flexibility.

@example
\`\`\`tsx
<Card variant="hover" padding="large">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
\`\`\``,methods:[],displayName:"Card",props:{variant:{required:!1,tsType:{name:"union",raw:'"default" | "hover" | "selected"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"hover"'},{name:"literal",value:'"selected"'}]},description:"",defaultValue:{value:'"default"',computed:!1}},padding:{required:!1,tsType:{name:"union",raw:'"none" | "small" | "medium" | "large"',elements:[{name:"literal",value:'"none"'},{name:"literal",value:'"small"'},{name:"literal",value:'"medium"'},{name:"literal",value:'"large"'}]},description:"",defaultValue:{value:'"medium"',computed:!1}},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["HTMLAttributes"]};export{m as C};
