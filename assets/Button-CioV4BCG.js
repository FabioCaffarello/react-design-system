var O=Object.defineProperty,S=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var o=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,v=Object.prototype.propertyIsEnumerable;var f=(n,e,a)=>e in n?O(n,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[e]=a,u=(n,e)=>{for(var a in e||(e={}))x.call(e,a)&&f(n,a,e[a]);if(o)for(var a of o(e))v.call(e,a)&&f(n,a,e[a]);return n},B=(n,e)=>S(n,E(e));var T=(n,e)=>{var a={};for(var t in n)x.call(n,t)&&e.indexOf(t)<0&&(a[t]=n[t]);if(n!=null&&o)for(var t of o(n))e.indexOf(t)<0&&v.call(n,t)&&(a[t]=n[t]);return a};var w=(n,e,a)=>f(n,typeof e!="symbol"?e+"":e,a);import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as D}from"./iframe-38FCFUQv.js";import{g as r}from"./colors-BnDqA8Th.js";import{S as R}from"./Spinner-zwBmS9q3.js";class U{constructor(){w(this,"classes",[])}addBase(){return this.classes.push("inline-flex","items-center","justify-center","font-medium","rounded-md","transition-colors","focus:outline-none","focus:ring-2","focus:ring-offset-2","disabled:opacity-50","disabled:cursor-not-allowed"),this}addVariant(e){const a=e==="regular"?"primary":e,t={primary:[r("primary","DEFAULT","bg"),"text-white","hover:opacity-90","focus:ring-indigo-500"],secondary:[r("secondary","DEFAULT","bg"),"text-white","hover:opacity-90","focus:ring-violet-500"],error:[r("error","DEFAULT","bg"),"text-white","hover:opacity-90","focus:ring-red-500"],outline:["border-2",r("neutral","DEFAULT","border"),"bg-transparent",r("neutral","dark","text"),"hover:bg-gray-50","focus:ring-gray-500"],ghost:["bg-transparent",r("neutral","dark","text"),"hover:bg-gray-100","focus:ring-gray-500"],iconOnly:["bg-transparent",r("neutral","dark","text"),"hover:bg-gray-100","focus:ring-gray-500","p-0"]};return this.classes.push(...t[a]),this}addSize(e,a){if((a==="regular"?"primary":a)==="iconOnly"){const d={sm:["h-8","w-8","p-0"],md:["h-10","w-10","p-0"],lg:["h-12","w-12","p-0"]};return this.classes.push(...d[e]),this}const i={sm:["px-3","py-1.5","text-sm","gap-1.5"],md:["px-4","py-2","text-base","gap-2"],lg:["px-6","py-3","text-lg","gap-2.5"]};return this.classes.push(...i[e]),this}addFullWidth(){return this.classes.push("w-full"),this}addCustom(e){return e&&this.classes.push(e),this}build(){return this.classes.filter(Boolean).join(" ")}}function V({children:n,position:e}){return n?s.jsx("span",{className:`inline-flex items-center ${e==="left"?"mr-0":"ml-0"}`,children:n}):null}const j=D.forwardRef(function(W,N){var b=W,{variant:e="primary",size:a="md",isLoading:t=!1,loadingText:i,loadingIcon:d,leftIcon:c,rightIcon:p,fullWidth:q=!1,as:g="button",className:C="",disabled:y=!1,children:l,"aria-label":h}=b,I=T(b,["variant","size","isLoading","loadingText","loadingIcon","leftIcon","rightIcon","fullWidth","as","className","disabled","children","aria-label"]);const k=new U().addBase().addVariant(e).addSize(a,e).addFullWidth(q).addCustom(C).build(),A=(e==="iconOnly"||!l&&(c||p))&&!h&&!l?"Button":h,m=e==="regular"?"primary":e,z=()=>m==="error"?"primary":m==="primary"||m==="secondary"?"neutral":"primary",F=d||s.jsx(R,{size:a==="sm"?"sm":a==="lg"?"lg":"md",variant:z()}),L=u(u({className:k,disabled:y||t,"aria-busy":t,"aria-label":A,"aria-disabled":y||t},g==="button"?{type:"button"}:{}),I);return s.jsx(g,B(u({ref:N},L),{children:t?s.jsxs(s.Fragment,{children:[F,i&&s.jsx("span",{className:"ml-2",children:i}),!i&&l&&s.jsx("span",{className:"ml-2 opacity-0",children:l})]}):s.jsxs(s.Fragment,{children:[c&&s.jsx(V,{position:"left",children:c}),l,p&&s.jsx(V,{position:"right",children:p})]})}))});j.displayName="Button";j.__docgenInfo={description:`Button Component

A styled button component with variants, sizes, and loading states.
Follows Atomic Design principles as an Atom component.
Uses Builder Pattern for class construction.
Supports polymorphic \`as\` prop for rendering as different elements (Link, NextLink, etc.).

@example
\`\`\`tsx
// Basic usage
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

// With icons
<Button leftIcon={<Icon />} rightIcon={<Icon />}>
  Action
</Button>

// Loading state
<Button isLoading loadingText="Saving...">
  Save
</Button>

// As Link
<Button as={Link} href="/page">
  Navigate
</Button>

// Icon only
<Button variant="iconOnly" leftIcon={<Icon />} aria-label="Close" />
\`\`\``,methods:[],displayName:"Button",props:{variant:{required:!1,tsType:{name:"union",raw:"'primary' | 'regular' | 'secondary' | 'error' | 'outline' | 'ghost' | 'iconOnly'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'regular'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'error'"},{name:"literal",value:"'outline'"},{name:"literal",value:"'ghost'"},{name:"literal",value:"'iconOnly'"}]},description:"",defaultValue:{value:"'primary'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},isLoading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},loadingText:{required:!1,tsType:{name:"string"},description:""},loadingIcon:{required:!1,tsType:{name:"ReactNode"},description:""},leftIcon:{required:!1,tsType:{name:"ReactNode"},description:""},rightIcon:{required:!1,tsType:{name:"ReactNode"},description:""},fullWidth:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},as:{required:!1,tsType:{name:"ElementType"},description:"",defaultValue:{value:"'button'",computed:!1}},href:{required:!1,tsType:{name:"string"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1},disabled:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["Omit"]};export{j as B};
