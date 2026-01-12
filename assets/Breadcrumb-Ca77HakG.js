var h=Object.defineProperty,g=Object.defineProperties;var j=Object.getOwnPropertyDescriptors;var t=Object.getOwnPropertySymbols;var o=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable;var m=(e,a,s)=>a in e?h(e,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[a]=s,d=(e,a)=>{for(var s in a||(a={}))o.call(a,s)&&m(e,s,a[s]);if(t)for(var s of t(a))p.call(a,s)&&m(e,s,a[s]);return e},u=(e,a)=>g(e,j(a));var f=(e,a)=>{var s={};for(var r in e)o.call(e,r)&&a.indexOf(r)<0&&(s[r]=e[r]);if(e!=null&&t)for(var r of t(e))a.indexOf(r)<0&&p.call(e,r)&&(s[r]=e[r]);return s};import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{N}from"./NavLink-Cym3z70p.js";function B(v){var i=v,{items:e,separator:a="/",className:s=""}=i,r=f(i,["items","separator","className"]);const x=[...["flex","items-center","space-x-2","text-sm"],s].filter(Boolean).join(" ");return n.jsx("nav",u(d({"aria-label":"Breadcrumb",className:x},r),{children:n.jsx("ol",{className:"flex items-center space-x-2",children:e.map((l,c)=>{const b=c===e.length-1;return n.jsxs("li",{className:"flex items-center",children:[c>0&&n.jsx("span",{className:"mx-2 text-gray-400","aria-hidden":"true",children:a}),b?n.jsx("span",{className:"text-gray-900 font-medium","aria-current":"page",children:l.label}):l.href?n.jsx(N,{href:l.href,variant:"default",children:l.label}):n.jsx("span",{className:"text-gray-500",children:l.label})]},c)})})}))}B.__docgenInfo={description:`Breadcrumb Component

A breadcrumb navigation component for hierarchical navigation.
Follows Atomic Design principles as a Molecule component.

@example
\`\`\`tsx
<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Epics", href: "/epics" },
    { label: "Epic Details" }
  ]}
/>
\`\`\``,methods:[],displayName:"Breadcrumb",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"BreadcrumbItem"}],raw:"BreadcrumbItem[]"},description:""},separator:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"/"',computed:!1}},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["HTMLAttributes"]};export{B};
