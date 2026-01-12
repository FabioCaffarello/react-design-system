var v=Object.defineProperty,w=Object.defineProperties;var b=Object.getOwnPropertyDescriptors;var p=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var m=(r,t,o)=>t in r?v(r,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):r[t]=o,e=(r,t)=>{for(var o in t||(t={}))k.call(t,o)&&m(r,o,t[o]);if(p)for(var o of p(t))L.call(t,o)&&m(r,o,t[o]);return r},i=(r,t)=>w(r,b(t));import{j as c}from"./jsx-runtime-D_zvdyIk.js";import{E as N}from"./EmptyState-B42kcNnT.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./Button-CioV4BCG.js";import"./Spinner-zwBmS9q3.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";import"./AvatarGroup-QeYvIKtG.js";const lt={title:"Molecules/EmptyState",component:N,parameters:{layout:"centered",docs:{description:{component:"A component for displaying empty states when there's no content. Includes proper ARIA attributes (role='status', aria-live='polite') for screen reader announcements."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","withAction","withIllustration"],description:"Visual variant of the empty state"},title:{control:"text",description:"Title text displayed prominently"},message:{control:"text",description:"Descriptive message text"},actionLabel:{control:"text",description:"Label for the action button"},onAction:{action:"onAction",description:"Callback when action button is clicked"}}},a={args:{title:"No items found",message:"There are no items to display at this time."}},s={args:{title:"No epics yet",message:"Get started by creating your first epic to organize your work.",actionLabel:"Create Epic",onAction:()=>{},variant:"withAction"}},n={args:{title:"No stories found",message:"This epic doesn't have any stories yet. Add a story to get started.",actionLabel:"Add Story",onAction:()=>{},variant:"withIllustration",illustration:c.jsx("svg",{className:"mx-auto h-12 w-12 text-gray-400",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","aria-hidden":"true",children:c.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})}};var l,d,u;a.parameters=i(e({},a.parameters),{docs:i(e({},(l=a.parameters)==null?void 0:l.docs),{source:e({originalSource:`{
  args: {
    title: "No items found",
    message: "There are no items to display at this time."
  }
}`},(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source)})});var h,g,y;s.parameters=i(e({},s.parameters),{docs:i(e({},(h=s.parameters)==null?void 0:h.docs),{source:e({originalSource:`{
  args: {
    title: "No epics yet",
    message: "Get started by creating your first epic to organize your work.",
    actionLabel: "Create Epic",
    onAction: () => {},
    variant: "withAction"
  }
}`},(y=(g=s.parameters)==null?void 0:g.docs)==null?void 0:y.source)})});var f,A,x;n.parameters=i(e({},n.parameters),{docs:i(e({},(f=n.parameters)==null?void 0:f.docs),{source:e({originalSource:`{
  args: {
    title: "No stories found",
    message: "This epic doesn't have any stories yet. Add a story to get started.",
    actionLabel: "Add Story",
    onAction: () => {},
    variant: "withIllustration",
    illustration: <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
  }
}`},(x=(A=n.parameters)==null?void 0:A.docs)==null?void 0:x.source)})});const dt=["Default","WithAction","WithIllustration"];export{a as Default,s as WithAction,n as WithIllustration,dt as __namedExportsOrder,lt as default};
