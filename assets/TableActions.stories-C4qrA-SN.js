var D=Object.defineProperty,E=Object.defineProperties;var A=Object.getOwnPropertyDescriptors;var m=Object.getOwnPropertySymbols;var V=Object.prototype.hasOwnProperty,T=Object.prototype.propertyIsEnumerable;var p=(t,o,r)=>o in t?D(t,o,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[o]=r,e=(t,o)=>{for(var r in o||(o={}))V.call(o,r)&&p(t,r,o[r]);if(m)for(var r of m(o))T.call(o,r)&&p(t,r,o[r]);return t},i=(t,o)=>E(t,A(o));import{T as v}from"./TableActions-B_csfOtW.js";import"./jsx-runtime-D_zvdyIk.js";import"./Dropdown-3XcqUhyy.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./Button-CioV4BCG.js";import"./Spinner-zwBmS9q3.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";import"./AvatarGroup-QeYvIKtG.js";const s={id:"1",name:"Sample Item",status:"ACTIVE"},bo={title:"Organisms/Table/TableActions",component:v,parameters:{docs:{description:{component:"Dropdown menu for row actions in tables."}}}},n={args:{row:s,actions:[{label:"View",onClick:()=>{}},{label:"Edit",onClick:()=>{}},{label:"Delete",onClick:()=>{},variant:"danger"}]}},a={args:{row:s,actions:[{label:"View",onClick:()=>{}},{label:"Edit",onClick:()=>{},disabled:!0},{label:"Delete",onClick:()=>{},variant:"danger"}]}},l={args:{row:s,align:"left",actions:[{label:"View",onClick:()=>{}},{label:"Edit",onClick:()=>{}}]}};var c,d,b;n.parameters=i(e({},n.parameters),{docs:i(e({},(c=n.parameters)==null?void 0:c.docs),{source:e({originalSource:`{
  args: {
    row: sampleRow,
    actions: [{
      label: 'View',
      onClick: () => {}
    }, {
      label: 'Edit',
      onClick: () => {}
    }, {
      label: 'Delete',
      onClick: () => {},
      variant: 'danger'
    }]
  }
}`},(b=(d=n.parameters)==null?void 0:d.docs)==null?void 0:b.source)})});var g,w,C;a.parameters=i(e({},a.parameters),{docs:i(e({},(g=a.parameters)==null?void 0:g.docs),{source:e({originalSource:`{
  args: {
    row: sampleRow,
    actions: [{
      label: 'View',
      onClick: () => {}
    }, {
      label: 'Edit',
      onClick: () => {},
      disabled: true
    }, {
      label: 'Delete',
      onClick: () => {},
      variant: 'danger'
    }]
  }
}`},(C=(w=a.parameters)==null?void 0:w.docs)==null?void 0:C.source)})});var k,u,f;l.parameters=i(e({},l.parameters),{docs:i(e({},(k=l.parameters)==null?void 0:k.docs),{source:e({originalSource:`{
  args: {
    row: sampleRow,
    align: 'left',
    actions: [{
      label: 'View',
      onClick: () => {}
    }, {
      label: 'Edit',
      onClick: () => {}
    }]
  }
}`},(f=(u=l.parameters)==null?void 0:u.docs)==null?void 0:f.source)})});const go=["Default","WithDisabledAction","LeftAligned"];export{n as Default,l as LeftAligned,a as WithDisabledAction,go as __namedExportsOrder,bo as default};
