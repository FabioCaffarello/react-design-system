var j=Object.defineProperty,C=Object.defineProperties;var F=Object.getOwnPropertyDescriptors;var o=Object.getOwnPropertySymbols;var f=Object.prototype.hasOwnProperty,g=Object.prototype.propertyIsEnumerable;var c=(e,s,a)=>s in e?j(e,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[s]=a,v=(e,s)=>{for(var a in s||(s={}))f.call(s,a)&&c(e,a,s[a]);if(o)for(var a of o(s))g.call(s,a)&&c(e,a,s[a]);return e},y=(e,s)=>C(e,F(s));var b=(e,s)=>{var a={};for(var r in e)f.call(e,r)&&s.indexOf(r)<0&&(a[r]=e[r]);if(e!=null&&o)for(var r of o(e))s.indexOf(r)<0&&g.call(e,r)&&(a[r]=e[r]);return a};import{j as l}from"./jsx-runtime-D_zvdyIk.js";import{g as t}from"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./typography-BGNr2Ph4.js";import{g as d}from"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";function N(q){var u=q,{value:e,max:s=100,variant:a="primary",size:r="md",showLabel:h=!1,label:m,"aria-label":x,className:w=""}=u,T=b(u,["value","max","variant","size","showLabel","label","aria-label","className"]);const i=e===void 0,n=i?void 0:Math.min(Math.max(e/s*100,0),100),A={sm:"h-1",md:"h-2",lg:"h-3"},p={primary:t("primary","DEFAULT","bg"),secondary:t("secondary","DEFAULT","bg"),success:t("success","DEFAULT","bg"),error:t("error","DEFAULT","bg"),warning:t("warning","DEFAULT","bg"),info:t("info","DEFAULT","bg")},L=a==="primary"||a==="secondary"?"bg-gray-200":`${t(a,"light","bg")}`,$=x||(i?"Loading in progress":`Progress: ${n==null?void 0:n.toFixed(0)}%`);return l.jsxs("div",y(v({className:`w-full ${w}`},T),{children:[h&&(m||!i)&&l.jsxs("div",{className:"flex items-center justify-between mb-1",children:[m&&l.jsx("span",{className:"text-sm font-medium text-gray-700",children:m}),!i&&n!==void 0&&l.jsxs("span",{className:"text-sm text-gray-500",children:[n.toFixed(0),"%"]})]}),l.jsx("div",{role:"progressbar","aria-valuemin":i?void 0:0,"aria-valuemax":i?void 0:s,"aria-valuenow":i?void 0:e,"aria-label":$,"aria-busy":i,className:`
          relative
          w-full
          overflow-hidden
          ${A[r]}
          ${L}
          ${d("full")}
        `,children:i?l.jsx("div",{className:`
              absolute
              top-0
              left-0
              bottom-0
              ${p[a]}
              ${d("full")}
            `,style:{width:"30%",animation:"progress-indeterminate 1.5s ease-in-out infinite"}}):l.jsx("div",{className:`
              h-full
              ${p[a]}
              ${d("full")}
              transition-all
              duration-300
              ease-out
            `,style:{width:`${n}%`},"aria-hidden":"true"})})]}))}N.__docgenInfo={description:`Progress Component

A progress bar component for displaying progress or loading states.
Supports both determinate (with value) and indeterminate (without value) modes.
Fully accessible with ARIA attributes.

@example
\`\`\`tsx
// Determinate progress
<Progress value={75} variant="primary" />

// Indeterminate progress
<Progress variant="primary" />

// With label
<Progress value={50} showLabel label="Uploading..." />
\`\`\``,methods:[],displayName:"Progress",props:{value:{required:!1,tsType:{name:"number"},description:""},max:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"100",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info'",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'success'"},{name:"literal",value:"'error'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'info'"}]},description:"",defaultValue:{value:"'primary'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},showLabel:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},label:{required:!1,tsType:{name:"string"},description:""},"aria-label":{required:!1,tsType:{name:"string"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};export{N as P};
