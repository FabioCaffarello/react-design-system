var w=Object.defineProperty,D=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var u=Object.getOwnPropertySymbols;var W=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var d=(s,r,a)=>r in s?w(s,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[r]=a,e=(s,r)=>{for(var a in r||(r={}))W.call(r,a)&&d(s,a,r[a]);if(u)for(var a of u(r))B.call(r,a)&&d(s,a,r[a]);return s},o=(s,r)=>D(s,G(r));import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{N as p}from"./NavbarGroup-Cskdgt3R.js";const z={title:"Molecules/NavbarGroup",component:p,parameters:{docs:{description:{component:"A clickable group in the navbar that can expand a sidebar."}}},argTypes:{label:{control:"text",description:"Label text for the group"},isActive:{control:"boolean",description:"Whether the group is currently active"}}},i={args:{label:"Agile",isActive:!1}},n={args:{label:"Agile",isActive:!0}},c={args:{label:"Agile",isActive:!1,icon:t.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z"})})}},l={render:()=>t.jsxs("nav",{className:"flex space-x-4 bg-white p-4 border-b",children:[t.jsx(p,{label:"Dashboard",isActive:!1}),t.jsx(p,{label:"Agile",isActive:!0}),t.jsx(p,{label:"Documentação",isActive:!1})]})};var v,m,b;i.parameters=o(e({},i.parameters),{docs:o(e({},(v=i.parameters)==null?void 0:v.docs),{source:e({originalSource:`{
  args: {
    label: "Agile",
    isActive: false
  }
}`},(b=(m=i.parameters)==null?void 0:m.docs)==null?void 0:b.source)})});var g,h,A;n.parameters=o(e({},n.parameters),{docs:o(e({},(g=n.parameters)==null?void 0:g.docs),{source:e({originalSource:`{
  args: {
    label: "Agile",
    isActive: true
  }
}`},(A=(h=n.parameters)==null?void 0:h.docs)==null?void 0:A.source)})});var x,f,N;c.parameters=o(e({},c.parameters),{docs:o(e({},(x=c.parameters)==null?void 0:x.docs),{source:e({originalSource:`{
  args: {
    label: "Agile",
    isActive: false,
    icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
  }
}`},(N=(f=c.parameters)==null?void 0:f.docs)==null?void 0:N.source)})});var j,k,L;l.parameters=o(e({},l.parameters),{docs:o(e({},(j=l.parameters)==null?void 0:j.docs),{source:e({originalSource:`{
  render: () => <nav className="flex space-x-4 bg-white p-4 border-b">
      <NavbarGroup label="Dashboard" isActive={false} />
      <NavbarGroup label="Agile" isActive={true} />
      <NavbarGroup label="Documentação" isActive={false} />
    </nav>
}`},(L=(k=l.parameters)==null?void 0:k.docs)==null?void 0:L.source)})});const C=["Default","Active","WithIcon","NavigationBar"];export{n as Active,i as Default,l as NavigationBar,c as WithIcon,C as __namedExportsOrder,z as default};
