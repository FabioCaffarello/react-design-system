var f=Object.defineProperty,T=Object.defineProperties;var x=Object.getOwnPropertyDescriptors;var a=Object.getOwnPropertySymbols;var m=Object.prototype.hasOwnProperty,c=Object.prototype.propertyIsEnumerable;var s=(e,i,r)=>i in e?f(e,i,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[i]=r,p=(e,i)=>{for(var r in i||(i={}))m.call(i,r)&&s(e,r,i[r]);if(a)for(var r of a(i))c.call(i,r)&&s(e,r,i[r]);return e},d=(e,i)=>T(e,x(i));var u=(e,i)=>{var r={};for(var t in e)m.call(e,t)&&i.indexOf(t)<0&&(r[t]=e[t]);if(e!=null&&a)for(var t of a(e))i.indexOf(t)<0&&c.call(e,t)&&(r[t]=e[t]);return r};import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{D as h}from"./Dropdown-3XcqUhyy.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import{B as g}from"./Button-CioV4BCG.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import{c as y}from"./createLucideIcon-DQdFte_Y.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"12",cy:"5",r:"1",key:"gxeob9"}],["circle",{cx:"12",cy:"19",r:"1",key:"lyex9k"}]],A=y("ellipsis-vertical",v);function k(D){var l=D,{actions:e,row:i,align:r="right",className:t=""}=l,w=u(l,["actions","row","align","className"]);const b=e.map(o=>({label:o.label,onClick:()=>o.onClick(i),variant:o.variant,disabled:o.disabled}));return n.jsx("div",d(p({className:`inline-flex ${t}`},w),{children:n.jsx(h,{trigger:n.jsx(g,{variant:"ghost",size:"sm","aria-label":"Row actions",className:"h-8 w-8 p-0",children:n.jsx(A,{className:"h-4 w-4"})}),items:b,align:r})}))}k.__docgenInfo={description:`TableActions Component

Dropdown menu for row actions in tables.
Follows Atomic Design principles as a Molecule component.

@example
\`\`\`tsx
<TableActions
  row={rowData}
  actions={[
    { label: 'Edit', onClick: (row) => handleEdit(row) },
    { label: 'Delete', onClick: (row) => handleDelete(row), variant: 'danger' },
  ]}
/>
\`\`\``,methods:[],displayName:"TableActions",props:{actions:{required:!0,tsType:{name:"Array",elements:[{name:"TableAction",elements:[{name:"T"}],raw:"TableAction<T>"}],raw:"TableAction<T>[]"},description:""},row:{required:!0,tsType:{name:"T"},description:""},align:{required:!1,tsType:{name:"union",raw:"'left' | 'right'",elements:[{name:"literal",value:"'left'"},{name:"literal",value:"'right'"}]},description:"",defaultValue:{value:"'right'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};export{k as T};
