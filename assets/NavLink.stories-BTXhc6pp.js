var A=Object.defineProperty,B=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var m=Object.getOwnPropertySymbols;var W=Object.prototype.hasOwnProperty,T=Object.prototype.propertyIsEnumerable;var v=(n,e,s)=>e in n?A(n,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):n[e]=s,a=(n,e)=>{for(var s in e||(e={}))W.call(e,s)&&v(n,s,e[s]);if(m)for(var s of m(e))T.call(e,s)&&v(n,s,e[s]);return n},r=(n,e)=>B(n,M(e));import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{N as i}from"./NavLink-Cym3z70p.js";const _={title:"Atoms/NavLink",component:i,parameters:{docs:{description:{component:"A navigation link component with active and disabled states. Used in headers, sidebars, and breadcrumbs."}}},argTypes:{variant:{control:"select",options:["default","active","disabled"],description:"Visual variant of the link"},href:{control:"text",description:"URL for the link"}}},t={args:{children:"Dashboard",href:"/dashboard"}},c={args:{children:"Epics",href:"/epics",variant:"active"}},d={args:{children:"Coming Soon",variant:"disabled"}},h={args:{children:"Dashboard",href:"/dashboard",icon:o.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:o.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"})})}},l={render:()=>o.jsxs("nav",{className:"flex space-x-8",children:[o.jsx(i,{href:"/",variant:"active",children:"Dashboard"}),o.jsx(i,{href:"/epics",children:"Epics"}),o.jsx(i,{href:"/stories",children:"Stories"}),o.jsx(i,{href:"/tasks",children:"Tasks"}),o.jsx(i,{variant:"disabled",children:"Coming Soon"})]})};var p,u,f;t.parameters=r(a({},t.parameters),{docs:r(a({},(p=t.parameters)==null?void 0:p.docs),{source:a({originalSource:`{
  args: {
    children: "Dashboard",
    href: "/dashboard"
  }
}`},(f=(u=t.parameters)==null?void 0:u.docs)==null?void 0:f.source)})});var k,g,b;c.parameters=r(a({},c.parameters),{docs:r(a({},(k=c.parameters)==null?void 0:k.docs),{source:a({originalSource:`{
  args: {
    children: "Epics",
    href: "/epics",
    variant: "active"
  }
}`},(b=(g=c.parameters)==null?void 0:g.docs)==null?void 0:b.source)})});var x,N,L;d.parameters=r(a({},d.parameters),{docs:r(a({},(x=d.parameters)==null?void 0:x.docs),{source:a({originalSource:`{
  args: {
    children: "Coming Soon",
    variant: "disabled"
  }
}`},(L=(N=d.parameters)==null?void 0:N.docs)==null?void 0:L.source)})});var j,S,D;h.parameters=r(a({},h.parameters),{docs:r(a({},(j=h.parameters)==null?void 0:j.docs),{source:a({originalSource:`{
  args: {
    children: "Dashboard",
    href: "/dashboard",
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
  }
}`},(D=(S=h.parameters)==null?void 0:S.docs)==null?void 0:D.source)})});var C,E,w;l.parameters=r(a({},l.parameters),{docs:r(a({},(C=l.parameters)==null?void 0:C.docs),{source:a({originalSource:`{
  render: () => <nav className="flex space-x-8">
      <NavLink href="/" variant="active">
        Dashboard
      </NavLink>
      <NavLink href="/epics">
        Epics
      </NavLink>
      <NavLink href="/stories">
        Stories
      </NavLink>
      <NavLink href="/tasks">
        Tasks
      </NavLink>
      <NavLink variant="disabled">
        Coming Soon
      </NavLink>
    </nav>
}`},(w=(E=l.parameters)==null?void 0:E.docs)==null?void 0:w.source)})});const y=["Default","Active","Disabled","WithIcon","NavigationBar"];export{c as Active,t as Default,d as Disabled,l as NavigationBar,h as WithIcon,y as __namedExportsOrder,_ as default};
