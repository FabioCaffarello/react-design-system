var I=Object.defineProperty,O=Object.defineProperties;var W=Object.getOwnPropertyDescriptors;var P=Object.getOwnPropertySymbols;var E=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var u=(a,e,t)=>e in a?I(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t,o=(a,e)=>{for(var t in e||(e={}))E.call(e,t)&&u(a,t,e[t]);if(P)for(var t of P(e))L.call(e,t)&&u(a,t,e[t]);return a},r=(a,e)=>O(a,W(e));import{j as c}from"./jsx-runtime-D_zvdyIk.js";import{r as n}from"./iframe-38FCFUQv.js";import{T as i}from"./TablePagination-BfBF-ZBz.js";import"./preload-helper-BDBacUwf.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./Button-CioV4BCG.js";import"./Spinner-zwBmS9q3.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";import"./AvatarGroup-QeYvIKtG.js";import"./chevron-left-CSWgm5TS.js";import"./chevron-right-B-aA5A0W.js";const Ce={title:"Organisms/Table/TablePagination",component:i,parameters:{docs:{description:{component:"Pagination controls for tables with page navigation and page size selection."}}}},g={render:()=>{const[a,e]=n.useState(1),[t,s]=n.useState(10);return c.jsx(i,{page:a,pageSize:t,total:100,onPageChange:e,onPageSizeChange:s})}},p={render:()=>{const[a,e]=n.useState(1);return c.jsx(i,{page:a,pageSize:10,total:100,onPageChange:e,onPageSizeChange:()=>{},showPageSizeSelector:!1})}},m={render:()=>{const[a,e]=n.useState(1),[t,s]=n.useState(10);return c.jsx(i,{page:a,pageSize:t,total:100,onPageChange:e,onPageSizeChange:s,showPageInfo:!1})}},S={render:()=>{const[a,e]=n.useState(1),[t,s]=n.useState(25);return c.jsx(i,{page:a,pageSize:t,total:1250,onPageChange:e,onPageSizeChange:s,pageSizeOptions:[10,25,50,100,250]})}};var z,l,d;g.parameters=r(o({},g.parameters),{docs:r(o({},(z=g.parameters)==null?void 0:z.docs),{source:o({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return <TablePagination page={page} pageSize={pageSize} total={100} onPageChange={setPage} onPageSizeChange={setPageSize} />;
  }
}`},(d=(l=g.parameters)==null?void 0:l.docs)==null?void 0:d.source)})});var h,C,f;p.parameters=r(o({},p.parameters),{docs:r(o({},(h=p.parameters)==null?void 0:h.docs),{source:o({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    return <TablePagination page={page} pageSize={10} total={100} onPageChange={setPage} onPageSizeChange={() => {}} showPageSizeSelector={false} />;
  }
}`},(f=(C=p.parameters)==null?void 0:C.docs)==null?void 0:f.source)})});var x,b,T;m.parameters=r(o({},m.parameters),{docs:r(o({},(x=m.parameters)==null?void 0:x.docs),{source:o({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    return <TablePagination page={page} pageSize={pageSize} total={100} onPageChange={setPage} onPageSizeChange={setPageSize} showPageInfo={false} />;
  }
}`},(T=(b=m.parameters)==null?void 0:b.docs)==null?void 0:T.source)})});var j,w,D;S.parameters=r(o({},S.parameters),{docs:r(o({},(j=S.parameters)==null?void 0:j.docs),{source:o({originalSource:`{
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    return <TablePagination page={page} pageSize={pageSize} total={1250} onPageChange={setPage} onPageSizeChange={setPageSize} pageSizeOptions={[10, 25, 50, 100, 250]} />;
  }
}`},(D=(w=S.parameters)==null?void 0:w.docs)==null?void 0:D.source)})});const fe=["Default","WithoutPageSizeSelector","WithoutPageInfo","LargeDataset"];export{g as Default,S as LargeDataset,m as WithoutPageInfo,p as WithoutPageSizeSelector,fe as __namedExportsOrder,Ce as default};
