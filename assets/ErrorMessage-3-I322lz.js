var R=Object.defineProperty,A=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var j=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var N=(t,e,n)=>e in t?R(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,g=(t,e)=>{for(var n in e||(e={}))j.call(e,n)&&N(t,n,e[n]);if(b)for(var n of b(e))L.call(e,n)&&N(t,n,e[n]);return t},v=(t,e)=>A(t,E(e));var x=(t,e)=>{var n={};for(var s in t)j.call(t,s)&&e.indexOf(s)<0&&(n[s]=t[s]);if(t!=null&&b)for(var s of b(t))e.indexOf(s)<0&&L.call(t,s)&&(n[s]=t[s]);return n};import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{r as l}from"./iframe-38FCFUQv.js";function I({defaultOpen:t=!0,open:e,onOpenChange:n,storageKey:s}){const m=l.useCallback(()=>{if(s&&typeof window!="undefined"){const f=localStorage.getItem(s);if(f!==null)return f==="true"}return t},[t,s]),[a,c]=l.useState(m),r=e!==void 0?e:a;l.useEffect(()=>{s&&typeof window!="undefined"&&e===void 0&&localStorage.setItem(s,String(a))},[a,s,e]);const u=l.useCallback(f=>{e===void 0&&c(f),n==null||n(f)},[e,n]),h=l.useCallback(()=>{u(!r)},[r,u]);return{isOpen:r,toggle:h,setOpen:u}}function M(f){var C=f,{children:t,trigger:e,defaultOpen:n=!0,open:s,onOpenChange:m,disabled:a=!1,duration:c=200,storageKey:r,className:u=""}=C,h=x(C,["children","trigger","defaultOpen","open","onOpenChange","disabled","duration","storageKey","className"]);const{isOpen:i,toggle:T}=I({defaultOpen:n,open:s,onOpenChange:m,storageKey:r}),d=l.useRef(null),[y,q]=l.useState(i?"auto":0);l.useEffect(()=>{d.current&&q(i?d.current.scrollHeight:0)},[i,t]),l.useEffect(()=>{if(!i||!d.current)return;const p=new ResizeObserver(()=>{d.current&&i&&q(d.current.scrollHeight)});return p.observe(d.current),()=>{p.disconnect()}},[i]);const w=`collapsible-content-${Math.random().toString(36).substr(2,9)}`;return o.jsxs("div",v(g({className:u},h),{children:[o.jsx("button",{type:"button",onClick:T,onKeyDown:p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),a||T())},disabled:a,"aria-expanded":i,"aria-controls":w,"aria-disabled":a,className:"w-full text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md",children:e}),o.jsx("div",{id:w,ref:d,style:{height:typeof y=="number"?`${y}px`:y,overflow:"hidden",transition:`height ${c}ms ease-in-out`},"aria-hidden":!i,children:o.jsx("div",{children:t})})]}))}M.__docgenInfo={description:`Collapsible Component

A generic, reusable collapsible component for any content.
Supports both controlled and uncontrolled modes.
Includes smooth animations and full ARIA support.

@example
\`\`\`tsx
<Collapsible
  trigger={<button>Toggle</button>}
  defaultOpen={true}
>
  <div>Collapsible content</div>
</Collapsible>
\`\`\``,methods:[],displayName:"Collapsible",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},trigger:{required:!0,tsType:{name:"ReactNode"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},open:{required:!1,tsType:{name:"boolean"},description:""},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},duration:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"200",computed:!1}},storageKey:{required:!1,tsType:{name:"string"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};function k(m){var a=m,{variant:t="default",className:e="",children:n}=a,s=x(a,["variant","className","children"]);const c=["block","text-sm","font-medium","text-gray-700"],r={default:"",required:"after:content-['*'] after:ml-0.5 after:text-red-500",optional:"after:content-['(optional)'] after:ml-1 after:text-gray-400 after:font-normal"},u=[...c,r[t],e].filter(Boolean).join(" ");return o.jsx("label",v(g({className:u},s),{children:n}))}k.__docgenInfo={description:`Label Component

A styled label component for form inputs.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<Label htmlFor="email" variant="required">
  Email Address
</Label>
\`\`\``,methods:[],displayName:"Label",props:{variant:{required:!1,tsType:{name:"union",raw:'"default" | "required" | "optional"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"required"'},{name:"literal",value:'"optional"'}]},description:"",defaultValue:{value:'"default"',computed:!1}},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["LabelHTMLAttributes"]};function S(m){var a=m,{message:t,id:e,className:n=""}=a,s=x(a,["message","id","className"]);const r=[...["mt-1","text-sm","text-red-600","flex","items-center","gap-1"],n].filter(Boolean).join(" ");return o.jsxs("div",v(g({role:"alert",id:e,className:r,"aria-live":"polite"},s),{children:[o.jsx("svg",{className:"h-4 w-4 flex-shrink-0",fill:"currentColor",viewBox:"0 0 20 20","aria-hidden":"true",children:o.jsx("path",{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"})}),o.jsx("span",{children:t})]}))}S.__docgenInfo={description:`ErrorMessage Component

A component for displaying validation error messages.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<ErrorMessage message="This field is required" id="email-error" />
\`\`\``,methods:[],displayName:"ErrorMessage",props:{message:{required:!0,tsType:{name:"string"},description:""},id:{required:!1,tsType:{name:"string"},description:""},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["HTMLAttributes"]};export{M as C,S as E,k as L};
