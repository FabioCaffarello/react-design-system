var S=Object.defineProperty;var t=Object.getOwnPropertySymbols;var m=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable;var d=(r,e,a)=>e in r?S(r,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[e]=a,s=(r,e)=>{for(var a in e||(e={}))m.call(e,a)&&d(r,a,e[a]);if(t)for(var a of t(e))p.call(e,a)&&d(r,a,e[a]);return r};var u=(r,e)=>{var a={};for(var o in r)m.call(r,o)&&e.indexOf(o)<0&&(a[o]=r[o]);if(r!=null&&t)for(var o of t(r))e.indexOf(o)<0&&p.call(r,o)&&(a[o]=r[o]);return a};import{j as c}from"./jsx-runtime-D_zvdyIk.js";import{r as f}from"./iframe-38FCFUQv.js";import{g as z}from"./colors-BnDqA8Th.js";const v=f.memo(function(C){var n=C,{orientation:e="horizontal",variant:a="solid",className:o=""}=n,l=u(n,["orientation","variant","className"]);const h=["border-0",z("neutral","DEFAULT","border")],b={horizontal:"w-full border-t",vertical:"h-full border-l self-stretch"},x={solid:"border-solid",dashed:"border-dashed",dotted:"border-dotted"},i=f.useMemo(()=>[...h,b[e],x[a],o].filter(Boolean).join(" "),[e,a,o]);return e==="vertical"?c.jsx("div",s({className:i,role:"separator","aria-orientation":"vertical"},l)):c.jsx("hr",s({className:i,role:"separator","aria-orientation":"horizontal"},l))});v.displayName="Separator";v.__docgenInfo={description:`Separator Component

A visual separator component for dividing content.
Follows Atomic Design principles as an Atom component.
Optimized with React.memo to prevent unnecessary re-renders.

@example
\`\`\`tsx
<Separator />

<Separator orientation="vertical" variant="dashed" />
\`\`\``,methods:[],displayName:"Separator",props:{orientation:{required:!1,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:"",defaultValue:{value:"'horizontal'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'solid' | 'dashed' | 'dotted'",elements:[{name:"literal",value:"'solid'"},{name:"literal",value:"'dashed'"},{name:"literal",value:"'dotted'"}]},description:"",defaultValue:{value:"'solid'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};export{v as S};
