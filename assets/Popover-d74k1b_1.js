import{j as l}from"./jsx-runtime-D_zvdyIk.js";import{r as d}from"./iframe-38FCFUQv.js";import{r as B}from"./index-CpssgTzR.js";import{g}from"./spacing-Bf5iY5pu.js";import{g as W}from"./radius-CrNLhUJa.js";import{g as z}from"./shadows-B52VkgOA.js";import{g as A}from"./z-index-DQdti7D9.js";import{g as M}from"./animations-BabstCnB.js";import{B as I}from"./Button-CioV4BCG.js";import{X}from"./x-g6OncSvk.js";function D({trigger:N,children:q,open:w,defaultOpen:R=!1,onOpenChange:h,placement:o="bottom",showCloseButton:v=!1,title:m,closeOnClickOutside:y=!0,closeOnEscape:x=!0,className:P="",triggerClassName:$="",contentClassName:j=""}){const[k,L]=d.useState(R),p=d.useRef(null),u=d.useRef(null),[E,V]=d.useState({top:0,left:0}),T=w!==void 0,s=T?w:k,f=()=>{if(!p.current||!u.current)return;const e=p.current.getBoundingClientRect(),t=u.current.getBoundingClientRect(),a=window.scrollY,i=window.scrollX;let n=0,r=0;o.startsWith("top")?(n=e.top+a-t.height-8,o==="top-start"?r=e.left+i:o==="top-end"?r=e.right+i-t.width:r=e.left+i+(e.width-t.width)/2):o.startsWith("bottom")?(n=e.bottom+a+8,o==="bottom-start"?r=e.left+i:o==="bottom-end"?r=e.right+i-t.width:r=e.left+i+(e.width-t.width)/2):o.startsWith("left")?(r=e.left+i-t.width-8,o==="left-start"?n=e.top+a:o==="left-end"?n=e.bottom+a-t.height:n=e.top+a+(e.height-t.height)/2):o.startsWith("right")&&(r=e.right+i+8,o==="right-start"?n=e.top+a:o==="right-end"?n=e.bottom+a-t.height:n=e.top+a+(e.height-t.height)/2);const c=8;n=Math.max(c,Math.min(n,window.innerHeight+a-t.height-c)),r=Math.max(c,Math.min(r,window.innerWidth+i-t.width-c)),V({top:n,left:r})};d.useEffect(()=>{if(s){f();const e=()=>f(),t=()=>f();return window.addEventListener("resize",e),window.addEventListener("scroll",t,!0),()=>{window.removeEventListener("resize",e),window.removeEventListener("scroll",t,!0)}}},[s,o]),d.useEffect(()=>{s&&u.current&&setTimeout(f,0)},[s]);const C=e=>{T||L(e),h==null||h(e)},b=()=>{C(!1)};d.useEffect(()=>{if(s&&x){const e=t=>{t.key==="Escape"&&b()};return document.addEventListener("keydown",e),()=>document.removeEventListener("keydown",e)}},[s,x]),d.useEffect(()=>{if(s&&y){const e=t=>{u.current&&p.current&&!u.current.contains(t.target)&&!p.current.contains(t.target)&&b()};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)}},[s,y]);const S=s?l.jsxs("div",{ref:u,className:`
        absolute
        ${A("popover")}
        bg-white
        ${W("lg")}
        ${z("lg")}
        border
        border-gray-200
        min-w-[200px]
        max-w-[400px]
        ${M("base")}
        ${j}
      `,style:{top:`${E.top}px`,left:`${E.left}px`},role:"dialog","aria-modal":"false",children:[(m||v)&&l.jsxs("div",{className:`
          flex
          items-center
          justify-between
          ${g("base","px")}
          ${g("md","py")}
          border-b
          border-gray-200
        `,children:[m&&l.jsx("h3",{className:"text-sm font-semibold text-gray-900",children:m}),v&&l.jsx(I,{variant:"ghost",size:"sm",onClick:b,className:"h-auto p-1","aria-label":"Close popover",children:l.jsx(X,{className:"h-4 w-4"})})]}),l.jsx("div",{className:`
        ${g("base","p")}
        ${m||v?"":g("md","p")}
      `,children:q})]}):null;return l.jsxs("div",{className:`inline-block ${P}`,children:[l.jsx("div",{ref:p,className:$,onClick:()=>C(!s),children:N}),typeof window!="undefined"&&B.createPortal(S,document.body)]})}D.__docgenInfo={description:`Popover Component

A popover component that displays content in a floating panel.
Supports positioning, portal rendering, and keyboard navigation.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<Popover
  trigger={<Button>Open Popover</Button>}
  title="Popover Title"
>
  <p>Popover content goes here</p>
</Popover>
\`\`\``,methods:[],displayName:"Popover",props:{trigger:{required:!0,tsType:{name:"ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},open:{required:!1,tsType:{name:"boolean"},description:""},defaultOpen:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},placement:{required:!1,tsType:{name:"union",raw:`| 'top' 
| 'top-start' 
| 'top-end'
| 'bottom' 
| 'bottom-start' 
| 'bottom-end'
| 'left' 
| 'left-start' 
| 'left-end'
| 'right' 
| 'right-start' 
| 'right-end'`,elements:[{name:"literal",value:"'top'"},{name:"literal",value:"'top-start'"},{name:"literal",value:"'top-end'"},{name:"literal",value:"'bottom'"},{name:"literal",value:"'bottom-start'"},{name:"literal",value:"'bottom-end'"},{name:"literal",value:"'left'"},{name:"literal",value:"'left-start'"},{name:"literal",value:"'left-end'"},{name:"literal",value:"'right'"},{name:"literal",value:"'right-start'"},{name:"literal",value:"'right-end'"}]},description:"",defaultValue:{value:"'bottom'",computed:!1}},showCloseButton:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},title:{required:!1,tsType:{name:"string"},description:""},closeOnClickOutside:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},closeOnEscape:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},triggerClassName:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},contentClassName:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};export{D as P};
