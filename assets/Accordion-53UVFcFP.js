import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{r as x}from"./iframe-38FCFUQv.js";import{g as c}from"./colors-BnDqA8Th.js";import{g as i}from"./spacing-Bf5iY5pu.js";import{g as d}from"./animations-BabstCnB.js";import{g as b}from"./typography-BGNr2Ph4.js";import{c as $}from"./createLucideIcon-DQdFte_Y.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],v=$("chevron-down",h);function A({items:m,type:p="single",defaultOpen:a,onValueChange:o,className:u=""}){const g=()=>a===void 0?[]:Array.isArray(a)?a:[a],[r,f]=x.useState(g),y=e=>{var s;if((s=m.find(l=>l.id===e))!=null&&s.disabled)return;let n;p==="single"?n=r.includes(e)?[]:[e]:n=r.includes(e)?r.filter(l=>l!==e):[...r,e],f(n),o==null||o(p==="single"?n[0]||"":n)};return t.jsx("div",{className:`space-y-1 ${u}`,children:m.map(e=>{const n=r.includes(e.id),s=e.disabled;return t.jsxs("div",{className:"border border-gray-200 rounded-md overflow-hidden",children:[t.jsxs("button",{type:"button",onClick:()=>y(e.id),disabled:s,className:`
                w-full
                flex
                items-center
                justify-between
                ${i("base","px")}
                ${i("md","py")}
                ${b("label")}
                text-left
                ${c("neutral","dark","text")}
              bg-white
                hover:bg-gray-50
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                ${c("primary","DEFAULT","focus:ring")}
                ${d("base")}
                ${s?"opacity-50 cursor-not-allowed":"cursor-pointer"}
              `,"aria-expanded":n,"aria-controls":`accordion-content-${e.id}`,"aria-disabled":s,children:[t.jsx("span",{children:e.title}),t.jsx(v,{className:`
                  ${i("sm","ml")}
                  ${d("base")}
                  ${n?"transform rotate-180":""}
                  ${s?"opacity-50":""}
                `,"aria-hidden":"true"})]}),t.jsx("div",{id:`accordion-content-${e.id}`,className:`
                overflow-hidden
                ${d("base")}
                ${n?"max-h-[1000px] opacity-100":"max-h-0 opacity-0"}
              `,"aria-hidden":!n,children:t.jsx("div",{className:`
                ${i("base","px")}
                ${i("md","py")}
                ${c("neutral","DEFAULT","text")}
              `,children:e.content})})]},e.id)})})}A.__docgenInfo={description:`Accordion Component

A collapsible content component that can display multiple items.
Supports single and multiple selection modes.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<Accordion
  type="single"
  items={[
    { id: '1', title: 'Item 1', content: 'Content 1' },
    { id: '2', title: 'Item 2', content: 'Content 2' },
  ]}
/>
\`\`\``,methods:[],displayName:"Accordion",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"AccordionItem"}],raw:"AccordionItem[]"},description:""},type:{required:!1,tsType:{name:"union",raw:"'single' | 'multiple'",elements:[{name:"literal",value:"'single'"},{name:"literal",value:"'multiple'"}]},description:"",defaultValue:{value:"'single'",computed:!1}},defaultOpen:{required:!1,tsType:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string | string[]) => void",signature:{arguments:[{type:{name:"union",raw:"string | string[]",elements:[{name:"string"},{name:"Array",elements:[{name:"string"}],raw:"string[]"}]},name:"value"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};export{A};
