var N=Object.defineProperty,f=Object.defineProperties;var q=Object.getOwnPropertyDescriptors;var c=Object.getOwnPropertySymbols;var I=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var u=(i,e,a)=>e in i?N(i,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):i[e]=a,s=(i,e)=>{for(var a in e||(e={}))I.call(e,a)&&u(i,a,e[a]);if(c)for(var a of c(e))L.call(e,a)&&u(i,a,e[a]);return i},t=(i,e)=>f(i,q(e));import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{E as n,L as p}from"./ErrorMessage-3-I322lz.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import{I as l}from"./Input-DlIdFoDR.js";import"./Button-CioV4BCG.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";const cr={title:"Atoms/ErrorMessage",component:n,parameters:{docs:{description:{component:"A component for displaying validation error messages. Accessible with role='alert'."}}},argTypes:{message:{control:"text",description:"Error message to display"},id:{control:"text",description:"ID for accessibility (should match aria-describedby on input)"}}},o={args:{message:"This field is required"}},m={render:()=>r.jsxs("div",{className:"space-y-2 max-w-md",children:[r.jsx(p,{htmlFor:"email",variant:"required",children:"Email Address"}),r.jsx(l,{id:"email",type:"email",placeholder:"Enter email...","aria-invalid":"true","aria-describedby":"email-error"}),r.jsx(n,{message:"Please enter a valid email address",id:"email-error"})]})},d={render:()=>r.jsxs("div",{className:"space-y-4 max-w-md",children:[r.jsxs("div",{className:"space-y-2",children:[r.jsx(p,{htmlFor:"name",variant:"required",children:"Name"}),r.jsx(l,{id:"name","aria-invalid":"true","aria-describedby":"name-error"}),r.jsx(n,{message:"Name must be at least 3 characters",id:"name-error"})]}),r.jsxs("div",{className:"space-y-2",children:[r.jsx(p,{htmlFor:"password",variant:"required",children:"Password"}),r.jsx(l,{id:"password",type:"password","aria-invalid":"true","aria-describedby":"password-error"}),r.jsx(n,{message:"Password must be at least 8 characters",id:"password-error"})]})]})};var b,v,h;o.parameters=t(s({},o.parameters),{docs:t(s({},(b=o.parameters)==null?void 0:b.docs),{source:s({originalSource:`{
  args: {
    message: "This field is required"
  }
}`},(h=(v=o.parameters)==null?void 0:v.docs)==null?void 0:h.source)})});var g,x,y;m.parameters=t(s({},m.parameters),{docs:t(s({},(g=m.parameters)==null?void 0:g.docs),{source:s({originalSource:`{
  render: () => <div className="space-y-2 max-w-md">
      <Label htmlFor="email" variant="required">
        Email Address
      </Label>
      <Input id="email" type="email" placeholder="Enter email..." aria-invalid="true" aria-describedby="email-error" />
      <ErrorMessage message="Please enter a valid email address" id="email-error" />
    </div>
}`},(y=(x=m.parameters)==null?void 0:x.docs)==null?void 0:y.source)})});var w,j,E;d.parameters=t(s({},d.parameters),{docs:t(s({},(w=d.parameters)==null?void 0:w.docs),{source:s({originalSource:`{
  render: () => <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Name
        </Label>
        <Input id="name" aria-invalid="true" aria-describedby="name-error" />
        <ErrorMessage message="Name must be at least 3 characters" id="name-error" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" variant="required">
          Password
        </Label>
        <Input id="password" type="password" aria-invalid="true" aria-describedby="password-error" />
        <ErrorMessage message="Password must be at least 8 characters" id="password-error" />
      </div>
    </div>
}`},(E=(j=d.parameters)==null?void 0:j.docs)==null?void 0:E.source)})});const ur=["Default","WithInput","MultipleErrors"];export{o as Default,d as MultipleErrors,m as WithInput,ur as __namedExportsOrder,cr as default};
