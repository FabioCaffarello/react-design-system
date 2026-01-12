var y=Object.defineProperty,A=Object.defineProperties;var O=Object.getOwnPropertyDescriptors;var d=Object.getOwnPropertySymbols;var R=Object.prototype.hasOwnProperty,k=Object.prototype.propertyIsEnumerable;var l=(t,e,o)=>e in t?y(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,a=(t,e)=>{for(var o in e||(e={}))R.call(e,o)&&l(t,o,e[o]);if(d)for(var o of d(e))k.call(e,o)&&l(t,o,e[o]);return t},r=(t,e)=>A(t,O(e));import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{r as g}from"./iframe-38FCFUQv.js";import{P as s}from"./Pagination-b1td3i4q.js";import"./preload-helper-BDBacUwf.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./Button-CioV4BCG.js";import"./Spinner-zwBmS9q3.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";import"./AvatarGroup-QeYvIKtG.js";const we={title:"Molecules/Pagination",component:s,parameters:{docs:{description:{component:"A pagination component for navigating through pages of data. Supports page info and ellipsis for large page counts."}}},argTypes:{currentPage:{control:"number",description:"Current page number (1-based)"},totalPages:{control:"number",description:"Total number of pages"},showPageInfo:{control:"boolean",description:"Whether to show page information"}}},p={render:()=>{const[t,e]=g.useState(1);return n.jsx(s,{currentPage:t,totalPages:10,onPageChange:e,totalItems:100,itemsPerPage:10})}},i={render:()=>{const[t,e]=g.useState(1);return n.jsx(s,{currentPage:t,totalPages:10,onPageChange:e})}},P={render:()=>{const[t,e]=g.useState(5);return n.jsx(s,{currentPage:t,totalPages:10,onPageChange:e,totalItems:100,itemsPerPage:10})}},m={render:()=>{const[t,e]=g.useState(10);return n.jsx(s,{currentPage:t,totalPages:10,onPageChange:e,totalItems:100,itemsPerPage:10})}},c={render:()=>{const[t,e]=g.useState(2);return n.jsx(s,{currentPage:t,totalPages:3,onPageChange:e})}},u={render:()=>{const[t,e]=g.useState(1);return n.jsx(s,{currentPage:t,totalPages:10,onPageChange:e,showPageInfo:!1})}};var h,f,S;p.parameters=r(a({},p.parameters),{docs:r(a({},(h=p.parameters)==null?void 0:h.docs),{source:a({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} totalItems={100} itemsPerPage={10} />;
  }
}`},(S=(f=p.parameters)==null?void 0:f.docs)==null?void 0:S.source)})});var C,x,I;i.parameters=r(a({},i.parameters),{docs:r(a({},(C=i.parameters)==null?void 0:C.docs),{source:a({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
  }
}`},(I=(x=i.parameters)==null?void 0:x.docs)==null?void 0:I.source)})});var j,b,w;P.parameters=r(a({},P.parameters),{docs:r(a({},(j=P.parameters)==null?void 0:j.docs),{source:a({originalSource:`{
  render: () => {
    const [page, setPage] = useState(5);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} totalItems={100} itemsPerPage={10} />;
  }
}`},(w=(b=P.parameters)==null?void 0:b.docs)==null?void 0:w.source)})});var F,E,M;m.parameters=r(a({},m.parameters),{docs:r(a({},(F=m.parameters)==null?void 0:F.docs),{source:a({originalSource:`{
  render: () => {
    const [page, setPage] = useState(10);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} totalItems={100} itemsPerPage={10} />;
  }
}`},(M=(E=m.parameters)==null?void 0:E.docs)==null?void 0:M.source)})});var W,D,L;c.parameters=r(a({},c.parameters),{docs:r(a({},(W=c.parameters)==null?void 0:W.docs),{source:a({originalSource:`{
  render: () => {
    const [page, setPage] = useState(2);
    return <Pagination currentPage={page} totalPages={3} onPageChange={setPage} />;
  }
}`},(L=(D=c.parameters)==null?void 0:D.docs)==null?void 0:L.source)})});var T,_,v;u.parameters=r(a({},u.parameters),{docs:r(a({},(T=u.parameters)==null?void 0:T.docs),{source:a({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} showPageInfo={false} />;
  }
}`},(v=(_=u.parameters)==null?void 0:_.docs)==null?void 0:v.source)})});const Fe=["Default","FirstPage","MiddlePage","LastPage","FewPages","WithoutPageInfo"];export{p as Default,c as FewPages,i as FirstPage,m as LastPage,P as MiddlePage,u as WithoutPageInfo,Fe as __namedExportsOrder,we as default};
