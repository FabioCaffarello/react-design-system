var b=Object.defineProperty,h=Object.defineProperties;var N=Object.getOwnPropertyDescriptors;var t=Object.getOwnPropertySymbols;var d=Object.prototype.hasOwnProperty,c=Object.prototype.propertyIsEnumerable;var o=(e,a,s)=>a in e?b(e,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[a]=s,m=(e,a)=>{for(var s in a||(a={}))d.call(a,s)&&o(e,s,a[s]);if(t)for(var s of t(a))c.call(a,s)&&o(e,s,a[s]);return e},p=(e,a)=>h(e,N(a));var u=(e,a)=>{var s={};for(var n in e)d.call(e,n)&&a.indexOf(n)<0&&(s[n]=e[n]);if(e!=null&&t)for(var n of t(e))a.indexOf(n)<0&&c.call(e,n)&&(s[n]=e[n]);return s};import{j as r}from"./jsx-runtime-D_zvdyIk.js";function g(y){var i=y,{variant:e="default",icon:a,className:s="",children:n}=i,f=u(i,["variant","icon","className","children"]);const v=["inline-flex","items-center","px-1","pt-1","border-b-2","text-sm","font-medium","transition-colors"],x={default:"border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",active:"border-indigo-500 text-gray-900",disabled:"border-transparent text-gray-300 cursor-not-allowed pointer-events-none"},l=[...v,x[e],s].filter(Boolean).join(" ");return e==="disabled"?r.jsxs("span",{className:l,"aria-disabled":"true",children:[a&&r.jsx("span",{className:"flex-shrink-0",children:a}),n]}):r.jsxs("a",p(m({className:l},f),{children:[a&&r.jsx("span",{className:"flex-shrink-0",children:a}),n]}))}g.__docgenInfo={description:`NavLink Component

A navigation link component with active and disabled states.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<NavLink href="/dashboard" variant="active">
  Dashboard
</NavLink>
\`\`\``,methods:[],displayName:"NavLink",props:{variant:{required:!1,tsType:{name:"union",raw:'"default" | "active" | "disabled"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"active"'},{name:"literal",value:'"disabled"'}]},description:"",defaultValue:{value:'"default"',computed:!1}},icon:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["AnchorHTMLAttributes"]};export{g as N};
