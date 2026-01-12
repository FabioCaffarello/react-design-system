var E=Object.defineProperty,H=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var C=Object.getOwnPropertySymbols;var _=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var P=(a,r,l)=>r in a?E(a,r,{enumerable:!0,configurable:!0,writable:!0,value:l}):a[r]=l,$=(a,r)=>{for(var l in r||(r={}))_.call(r,l)&&P(a,l,r[l]);if(C)for(var l of C(r))B.call(r,l)&&P(a,l,r[l]);return a},T=(a,r)=>H(a,M(r));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as h}from"./iframe-38FCFUQv.js";import{g as v}from"./radius-CrNLhUJa.js";import{g as y}from"./shadows-B52VkgOA.js";import{g as F}from"./spacing-Bf5iY5pu.js";import{I}from"./Input-DlIdFoDR.js";import{P as L}from"./Popover-d74k1b_1.js";function D({value:a,defaultValue:r="#000000",format:l="hex",onChange:n,presets:q,showInput:j=!0,disabled:o=!1,label:N,className:V=""}){const[R,p]=h.useState(r),[c,u]=h.useState({r:0,g:0,b:0}),f=a!==void 0,i=f?a:R,g=s=>{const t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:{r:0,g:0,b:0}},S=(s,t,m)=>"#"+[s,t,m].map(d=>{const b=d.toString(16);return b.length===1?"0"+b:b}).join("");h.useEffect(()=>{if(i){const s=g(i);u(s)}},[i]);const w=s=>{const t=s.target.value;(/^#[0-9A-F]{6}$/i.test(t)||t==="")&&(f||p(t),n==null||n(t),t&&u(g(t)))},x=(s,t)=>{const m=T($({},c),{[s]:Math.max(0,Math.min(255,t))});u(m);const d=S(m.r,m.g,m.b);f||p(d),n==null||n(d)},k=q||["#000000","#ffffff","#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#808080","#ffa500"],A=e.jsxs("div",{className:`${F("base","p")} min-w-[280px]`,children:[e.jsx("div",{className:`
          w-full
          h-32
          ${v("md")}
          ${y("sm")}
          mb-4
          border
          border-gray-200
        `,style:{backgroundColor:i}}),e.jsxs("div",{className:"space-y-3 mb-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-xs font-medium text-gray-700 mb-1",children:["Red: ",c.r]}),e.jsx("input",{type:"range",min:"0",max:"255",value:c.r,onChange:s=>x("r",parseInt(s.target.value)),disabled:o,className:"w-full"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-xs font-medium text-gray-700 mb-1",children:["Green: ",c.g]}),e.jsx("input",{type:"range",min:"0",max:"255",value:c.g,onChange:s=>x("g",parseInt(s.target.value)),disabled:o,className:"w-full"})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"block text-xs font-medium text-gray-700 mb-1",children:["Blue: ",c.b]}),e.jsx("input",{type:"range",min:"0",max:"255",value:c.b,onChange:s=>x("b",parseInt(s.target.value)),disabled:o,className:"w-full"})]})]}),j&&e.jsx("div",{className:"mb-4",children:e.jsx(I,{label:"Hex",value:i,onChange:w,disabled:o,placeholder:"#000000",className:"font-mono"})}),k.length>0&&e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-medium text-gray-700 mb-2",children:"Presets"}),e.jsx("div",{className:"grid grid-cols-10 gap-1",children:k.map((s,t)=>e.jsx("button",{type:"button",onClick:()=>{o||(f||p(s),n==null||n(s),u(g(s)))},disabled:o,className:`
                  w-6
                  h-6
                  ${v("sm")}
                  border
                  border-gray-300
                  hover:scale-110
                  ${y("sm")}
                  ${i.toLowerCase()===s.toLowerCase()?"ring-2 ring-offset-1 ring-indigo-500":""}
                `,style:{backgroundColor:s},"aria-label":`Select color ${s}`},t))})]})]});return e.jsx("div",{className:V,children:e.jsx(L,{trigger:e.jsxs("div",{className:"flex items-center gap-2",children:[N&&e.jsx("label",{className:"text-sm font-medium text-gray-700",children:N}),e.jsx("div",{className:`
                w-10
                h-10
                ${v("md")}
                border
                border-gray-300
                ${y("sm")}
                cursor-pointer
                ${o?"opacity-50 cursor-not-allowed":""}
              `,style:{backgroundColor:i}}),j&&e.jsx(I,{value:i,onChange:w,disabled:o,placeholder:"#000000",className:"w-24 font-mono"})]}),placement:"bottom-start",showCloseButton:!0,title:"Pick a Color",children:A})})}D.__docgenInfo={description:`ColorPicker Component

A color picker component for selecting colors.
Supports hex, rgb, and hsl formats with presets.
Follows Atomic Design principles as a Molecule component.

@example
\`\`\`tsx
<ColorPicker
  value="#ff0000"
  onChange={(color) => console.log(color)}
/>
\`\`\``,methods:[],displayName:"ColorPicker",props:{value:{required:!1,tsType:{name:"string"},description:""},defaultValue:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'#000000'",computed:!1}},format:{required:!1,tsType:{name:"union",raw:"'hex' | 'rgb' | 'hsl'",elements:[{name:"literal",value:"'hex'"},{name:"literal",value:"'rgb'"},{name:"literal",value:"'hsl'"}]},description:"",defaultValue:{value:"'hex'",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},presets:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},showInput:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},label:{required:!1,tsType:{name:"string"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};export{D as C};
