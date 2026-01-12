var ae=Object.defineProperty,ne=Object.defineProperties;var te=Object.getOwnPropertyDescriptors;var V=Object.getOwnPropertySymbols;var B=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var _=(r,a,t)=>a in r?ae(r,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[a]=t,G=(r,a)=>{for(var t in a||(a={}))B.call(a,t)&&_(r,t,a[t]);if(V)for(var t of V(a))O.call(a,t)&&_(r,t,a[t]);return r},H=(r,a)=>ne(r,te(a));var J=(r,a)=>{var t={};for(var e in r)B.call(r,e)&&a.indexOf(e)<0&&(t[e]=r[e]);if(r!=null&&V)for(var e of V(r))a.indexOf(e)<0&&O.call(r,e)&&(t[e]=r[e]);return t};import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as y}from"./iframe-38FCFUQv.js";import{g as w}from"./colors-BnDqA8Th.js";import{g as j}from"./animations-BabstCnB.js";const K=y.forwardRef(function(se,C){var L=se,{value:a,defaultValue:t,min:e=0,max:o=100,step:k=1,variant:l="single",size:Q="md",disabled:x=!1,showValue:E=!1,marks:W=[],onChange:f,onValueChange:p,label:h,className:Y=""}=L,Z=J(L,["value","defaultValue","min","max","step","variant","size","disabled","showValue","marks","onChange","onValueChange","label","className"]);const $=y.useRef(null),[ee,F]=y.useState(t||(l==="range"?[e,o]:e)),[P,R]=y.useState(!1),[U,z]=y.useState(null),q=a!==void 0,m=q?a:ee,M=n=>(n-e)/(o-e)*100,I=n=>{if(!$.current)return e;const u=$.current.getBoundingClientRect(),i=Math.max(0,Math.min(1,(n-u.left)/u.width)),d=e+i*(o-e);return Math.round(d/k)*k},N=(n,u="min")=>{if(x)return;n.preventDefault(),R(!0),z(u);const i=A=>{if(!$.current)return;const c=I(A.clientX);X(c,u)},d=()=>{R(!1),z(null),document.removeEventListener("mousemove",i),document.removeEventListener("mouseup",d)};document.addEventListener("mousemove",i),document.addEventListener("mouseup",d)},X=(n,u="min")=>{const i=Math.max(e,Math.min(o,n));if(l==="range"){const[d,A]=Array.isArray(m)?m:[e,o];let c;u==="min"?c=[Math.min(i,A),A]:c=[d,Math.max(i,d)],q||F(c),f==null||f(c),p==null||p(c)}else q||F(i),f==null||f(i),p==null||p(i)},re=n=>{if(x||P)return;const u=I(n.clientX);X(u)},b={sm:{track:"h-1",thumb:"w-3 h-3"},md:{track:"h-2",thumb:"w-4 h-4"},lg:{track:"h-3",thumb:"w-5 h-5"}}[Q],T=typeof m=="number"?m:m[0],g=Array.isArray(m)?m[0]:e,v=Array.isArray(m)?m[1]:T,D=M(g),S=M(v);return s.jsxs("div",H(G({ref:C,className:`w-full ${Y}`},Z),{children:[h&&s.jsxs("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:[h,E&&s.jsx("span",{className:"ml-2 text-gray-500",children:l==="range"?`${g} - ${v}`:T})]}),s.jsxs("div",{ref:$,className:`
          relative
          ${b.track}
          ${w("neutral","light","bg")}
          rounded-full
          cursor-pointer
          ${x?"opacity-50 cursor-not-allowed":""}
        `,onClick:re,role:l==="range"?void 0:"slider","aria-valuemin":l==="range"?void 0:e,"aria-valuemax":l==="range"?void 0:o,"aria-valuenow":l==="range"?void 0:T,"aria-disabled":l==="range"?void 0:x,"aria-label":l==="range"?void 0:h,children:[s.jsx("div",{className:`
            absolute
            ${b.track}
            ${w("primary","DEFAULT","bg")}
            rounded-full
            ${j("base")}
          `,style:{left:`${D}%`,width:`${S-D}%`}}),W.map(n=>{const u=M(n);return s.jsx("div",{className:"absolute w-1 h-1 bg-gray-400 rounded-full -translate-x-1/2",style:{left:`${u}%`,top:"50%",transform:"translate(-50%, -50%)"}},n)}),l==="range"?s.jsxs(s.Fragment,{children:[s.jsx("div",{className:`
                absolute
                ${b.thumb}
                ${w("primary","DEFAULT","bg")}
                rounded-full
                border-2
                border-white
                shadow-md
                cursor-grab
                active:cursor-grabbing
                ${j("base")}
                ${U==="min"?"ring-2 ring-offset-2 ring-indigo-500":""}
                -translate-x-1/2
                -translate-y-1/2
                top-1/2
              `,style:{left:`${D}%`},onMouseDown:n=>N(n,"min"),role:"slider","aria-valuemin":e,"aria-valuemax":v,"aria-valuenow":g}),s.jsx("div",{className:`
                absolute
                ${b.thumb}
                ${w("primary","DEFAULT","bg")}
                rounded-full
                border-2
                border-white
                shadow-md
                cursor-grab
                active:cursor-grabbing
                ${j("base")}
                ${U==="max"?"ring-2 ring-offset-2 ring-indigo-500":""}
                -translate-x-1/2
                -translate-y-1/2
                top-1/2
              `,style:{left:`${S}%`},onMouseDown:n=>N(n,"max"),role:"slider","aria-valuemin":g,"aria-valuemax":o,"aria-valuenow":v})]}):s.jsx("div",{className:`
              absolute
              ${b.thumb}
              ${w("primary","DEFAULT","bg")}
              rounded-full
              border-2
              border-white
              shadow-md
              cursor-grab
              active:cursor-grabbing
              ${j("base")}
              ${P?"ring-2 ring-offset-2 ring-indigo-500":""}
              -translate-x-1/2
              -translate-y-1/2
              top-1/2
            `,style:{left:`${S}%`},onMouseDown:n=>N(n)}),E&&!h&&s.jsx("div",{className:"absolute -top-6 left-0 right-0 flex justify-center",children:s.jsx("span",{className:"text-xs text-gray-600 bg-white px-2 py-1 rounded shadow",children:l==="range"?`${g} - ${v}`:T})})]})]}))});K.displayName="Slider";K.__docgenInfo={description:`Slider Component

A range input component for selecting numeric values.
Supports single and dual thumb (range) modes.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<Slider
  value={50}
  min={0}
  max={100}
  onChange={(value) => console.log(value)}
/>

<Slider
  variant="range"
  value={[20, 80]}
  min={0}
  max={100}
  onChange={(value) => console.log(value)}
/>
\`\`\``,methods:[],displayName:"Slider",props:{value:{required:!1,tsType:{name:"union",raw:"number | [number, number]",elements:[{name:"number"},{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]}]},description:""},defaultValue:{required:!1,tsType:{name:"union",raw:"number | [number, number]",elements:[{name:"number"},{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]}]},description:""},min:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},max:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"100",computed:!1}},step:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'single' | 'range'",elements:[{name:"literal",value:"'single'"},{name:"literal",value:"'range'"}]},description:"",defaultValue:{value:"'single'",computed:!1}},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md' | 'lg'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"},{name:"literal",value:"'lg'"}]},description:"",defaultValue:{value:"'md'",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},showValue:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},marks:{required:!1,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:"",defaultValue:{value:"[]",computed:!1}},onChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number | [number, number]) => void",signature:{arguments:[{type:{name:"union",raw:"number | [number, number]",elements:[{name:"number"},{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]}]},name:"value"}],return:{name:"void"}}},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: number | [number, number]) => void",signature:{arguments:[{type:{name:"union",raw:"number | [number, number]",elements:[{name:"number"},{name:"tuple",raw:"[number, number]",elements:[{name:"number"},{name:"number"}]}]},name:"value"}],return:{name:"void"}}},description:""},label:{required:!1,tsType:{name:"string"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};export{K as S};
