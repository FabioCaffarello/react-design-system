var f=Object.defineProperty,I=Object.defineProperties;var A=Object.getOwnPropertyDescriptors;var c=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;var u=(a,i,n)=>i in a?f(a,i,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[i]=n,r=(a,i)=>{for(var n in i||(i={}))S.call(i,n)&&u(a,n,i[n]);if(c)for(var n of c(i))D.call(i,n)&&u(a,n,i[n]);return a},t=(a,i)=>I(a,A(i));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{L as o}from"./ErrorMessage-3-I322lz.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import{I as s}from"./Input-DlIdFoDR.js";import"./Button-CioV4BCG.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";const ve={title:"Atoms/Label",component:o,parameters:{docs:{description:{component:"A styled label component for form inputs. Supports required and optional variants."}}},argTypes:{variant:{control:"select",options:["default","required","optional"],description:"Visual variant of the label"},htmlFor:{control:"text",description:"ID of the associated input element"}}},m={args:{children:"Email Address",htmlFor:"email"},render:a=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,r({},a)),e.jsx(s,{id:"email",placeholder:"Enter email..."})]})},l={args:{children:"Email Address",htmlFor:"email-required",variant:"required"},render:a=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,r({},a)),e.jsx(s,{id:"email-required",placeholder:"Enter email...",required:!0})]})},d={args:{children:"Middle Name",htmlFor:"middle-name",variant:"optional"},render:a=>e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,r({},a)),e.jsx(s,{id:"middle-name",placeholder:"Enter middle name..."})]})},p={render:()=>e.jsxs("div",{className:"space-y-4 max-w-md",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"name",variant:"required",children:"Full Name"}),e.jsx(s,{id:"name",placeholder:"Enter your name..."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"email",variant:"required",children:"Email"}),e.jsx(s,{id:"email",type:"email",placeholder:"Enter your email..."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(o,{htmlFor:"phone",variant:"optional",children:"Phone Number"}),e.jsx(s,{id:"phone",type:"tel",placeholder:"Enter your phone..."})]})]})};var h,v,x;m.parameters=t(r({},m.parameters),{docs:t(r({},(h=m.parameters)==null?void 0:h.docs),{source:r({originalSource:`{
  args: {
    children: "Email Address",
    htmlFor: "email"
  },
  render: args => <div className="space-y-2">
      <Label {...args} />
      <Input id="email" placeholder="Enter email..." />
    </div>
}`},(x=(v=m.parameters)==null?void 0:v.docs)==null?void 0:x.source)})});var y,j,E;l.parameters=t(r({},l.parameters),{docs:t(r({},(y=l.parameters)==null?void 0:y.docs),{source:r({originalSource:`{
  args: {
    children: "Email Address",
    htmlFor: "email-required",
    variant: "required"
  },
  render: args => <div className="space-y-2">
      <Label {...args} />
      <Input id="email-required" placeholder="Enter email..." required />
    </div>
}`},(E=(j=l.parameters)==null?void 0:j.docs)==null?void 0:E.source)})});var N,g,q;d.parameters=t(r({},d.parameters),{docs:t(r({},(N=d.parameters)==null?void 0:N.docs),{source:r({originalSource:`{
  args: {
    children: "Middle Name",
    htmlFor: "middle-name",
    variant: "optional"
  },
  render: args => <div className="space-y-2">
      <Label {...args} />
      <Input id="middle-name" placeholder="Enter middle name..." />
    </div>
}`},(q=(g=d.parameters)==null?void 0:g.docs)==null?void 0:q.source)})});var b,F,L;p.parameters=t(r({},p.parameters),{docs:t(r({},(b=p.parameters)==null?void 0:b.docs),{source:r({originalSource:`{
  render: () => <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Full Name
        </Label>
        <Input id="name" placeholder="Enter your name..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          Email
        </Label>
        <Input id="email" type="email" placeholder="Enter your email..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" variant="optional">
          Phone Number
        </Label>
        <Input id="phone" type="tel" placeholder="Enter your phone..." />
      </div>
    </div>
}`},(L=(F=p.parameters)==null?void 0:F.docs)==null?void 0:L.source)})});const xe=["Default","Required","Optional","WithInput"];export{m as Default,d as Optional,l as Required,p as WithInput,xe as __namedExportsOrder,ve as default};
