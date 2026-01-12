var B=Object.defineProperty,C=Object.defineProperties;var H=Object.getOwnPropertyDescriptors;var m=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;var u=(a,n,i)=>n in a?B(a,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):a[n]=i,e=(a,n)=>{for(var i in n||(n={}))y.call(n,i)&&u(a,i,n[i]);if(m)for(var i of m(n))D.call(n,i)&&u(a,i,n[i]);return a},s=(a,n)=>C(a,H(n));import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{a as p}from"./SidebarItem-F_v96Oje.js";const T={title:"Organisms/Sidebar/SidebarItem",component:p,parameters:{docs:{description:{component:"An individual navigation item within a sidebar."}}},argTypes:{isActive:{control:"boolean",description:"Whether the item is currently active"},href:{control:"text",description:"URL for the navigation item"}}},o={args:{href:"/epics",children:"Epics",isActive:!1}},t={args:{href:"/epics",children:"Epics",isActive:!0}},c={args:{href:"/epics",children:"Epics",isActive:!1,icon:r.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})}},d={args:{href:"/epics",children:"Epics",isActive:!1,nested:!0,icon:r.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})}},l={args:{href:"/epics",children:"Epics",isActive:!1,nested:2,icon:r.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})})}},h={render:()=>r.jsxs("div",{className:"space-y-2 w-64",children:[r.jsx(p,{href:"/test",iconSize:"sm",icon:r.jsx("span",{children:"📄"}),children:"Small Icon"}),r.jsx(p,{href:"/test",iconSize:"md",icon:r.jsx("span",{children:"📄"}),children:"Medium Icon (default)"}),r.jsx(p,{href:"/test",iconSize:"lg",icon:r.jsx("span",{children:"📄"}),children:"Large Icon"})]})};var f,v,g;o.parameters=s(e({},o.parameters),{docs:s(e({},(f=o.parameters)==null?void 0:f.docs),{source:e({originalSource:`{
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false
  }
}`},(g=(v=o.parameters)==null?void 0:v.docs)==null?void 0:g.source)})});var S,k,x;t.parameters=s(e({},t.parameters),{docs:s(e({},(S=t.parameters)==null?void 0:S.docs),{source:e({originalSource:`{
  args: {
    href: "/epics",
    children: "Epics",
    isActive: true
  }
}`},(x=(k=t.parameters)==null?void 0:k.docs)==null?void 0:x.source)})});var j,I,L;c.parameters=s(e({},c.parameters),{docs:s(e({},(j=c.parameters)==null?void 0:j.docs),{source:e({originalSource:`{
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false,
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
  }
}`},(L=(I=c.parameters)==null?void 0:I.docs)==null?void 0:L.source)})});var w,z,A;d.parameters=s(e({},d.parameters),{docs:s(e({},(w=d.parameters)==null?void 0:w.docs),{source:e({originalSource:`{
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false,
    nested: true,
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
  }
}`},(A=(z=d.parameters)==null?void 0:z.docs)==null?void 0:A.source)})});var E,N,V;l.parameters=s(e({},l.parameters),{docs:s(e({},(E=l.parameters)==null?void 0:E.docs),{source:e({originalSource:`{
  args: {
    href: "/epics",
    children: "Epics",
    isActive: false,
    nested: 2,
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
  }
}`},(V=(N=l.parameters)==null?void 0:N.docs)==null?void 0:V.source)})});var b,W,M;h.parameters=s(e({},h.parameters),{docs:s(e({},(b=h.parameters)==null?void 0:b.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-2 w-64">
      <SidebarItem href="/test" iconSize="sm" icon={<span>📄</span>}>
        Small Icon
      </SidebarItem>
      <SidebarItem href="/test" iconSize="md" icon={<span>📄</span>}>
        Medium Icon (default)
      </SidebarItem>
      <SidebarItem href="/test" iconSize="lg" icon={<span>📄</span>}>
        Large Icon
      </SidebarItem>
    </div>
}`},(M=(W=h.parameters)==null?void 0:W.docs)==null?void 0:M.source)})});const U=["Default","Active","WithIcon","Nested","NestedLevel2","DifferentIconSizes"];export{t as Active,o as Default,h as DifferentIconSizes,d as Nested,l as NestedLevel2,c as WithIcon,U as __namedExportsOrder,T as default};
