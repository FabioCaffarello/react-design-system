var N=Object.defineProperty,h=Object.defineProperties;var y=Object.getOwnPropertyDescriptors;var t=Object.getOwnPropertySymbols;var l=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable;var i=(e,a,n)=>a in e?N(e,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[a]=n,c=(e,a)=>{for(var n in a||(a={}))l.call(a,n)&&i(e,n,a[n]);if(t)for(var n of t(a))p.call(a,n)&&i(e,n,a[n]);return e},d=(e,a)=>h(e,y(a));var u=(e,a)=>{var n={};for(var s in e)l.call(e,s)&&a.indexOf(s)<0&&(n[s]=e[s]);if(e!=null&&t)for(var s of t(e))a.indexOf(s)<0&&p.call(e,s)&&(n[s]=e[s]);return n};import{j as r}from"./jsx-runtime-D_zvdyIk.js";function j(A){var o=A,{label:e,isActive:a=!1,icon:n,onClick:s,className:m="",children:b}=o,f=u(o,["label","isActive","icon","onClick","className","children"]);const x=["inline-flex","items-center","px-3","py-2","text-sm","font-medium","rounded-md","transition-colors"],g=a?"bg-indigo-100 text-indigo-700 border-b-2 border-indigo-600":"text-gray-600 hover:bg-gray-100 hover:text-gray-900",v=[...x,g,m].filter(Boolean).join(" ");return r.jsxs("button",d(c({type:"button",className:v,onClick:s,"aria-expanded":a,"aria-haspopup":"true"},f),{children:[n&&r.jsx("span",{className:"mr-2",children:n}),r.jsx("span",{children:e}),b]}))}j.__docgenInfo={description:`NavbarGroup Component

A clickable group in the navbar that can expand a sidebar.
Follows Atomic Design principles as a Molecule component.

@example
\`\`\`tsx
<NavbarGroup
  label="Agile"
  isActive={activeGroup === 'agile'}
  onClick={() => setActiveGroup('agile')}
/>
\`\`\``,methods:[],displayName:"NavbarGroup",props:{label:{required:!0,tsType:{name:"string"},description:""},isActive:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},icon:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["ButtonHTMLAttributes"]};export{j as N};
