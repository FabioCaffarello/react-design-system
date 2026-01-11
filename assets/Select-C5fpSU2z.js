import{j as s}from"./jsx-runtime-D_zvdyIk.js";function c({options:a,placeholder:o,error:n=!1,className:r="",...l}){const t=["block","w-full","rounded","h-form-element","px-large","border","text-base","focus:outline-none","focus:ring-2","focus:ring-offset-2"],i=n?"border-red-500 focus:ring-red-500":"border-gray-300 focus:ring-indigo-500",d=[...t,i,r].filter(Boolean).join(" ");return s.jsxs("select",{className:d,"aria-invalid":n,"aria-describedby":n?`${l.id}-error`:void 0,...l,children:[o&&s.jsx("option",{value:"",disabled:!0,children:o}),a.map(e=>s.jsx("option",{value:e.value,disabled:e.disabled,children:e.label},e.value))]})}c.__docgenInfo={description:`Select Component

A styled select dropdown component for forms.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<Select 
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" }
  ]}
  placeholder="Select an option"
/>
\`\`\``,methods:[],displayName:"Select",props:{options:{required:!0,tsType:{name:"Array",elements:[{name:"Option"}],raw:"Option[]"},description:""},placeholder:{required:!1,tsType:{name:"string"},description:""},error:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["Omit"]};export{c as S};
