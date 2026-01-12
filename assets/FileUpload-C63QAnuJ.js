var X=Object.defineProperty,J=Object.defineProperties;var Q=Object.getOwnPropertyDescriptors;var q=Object.getOwnPropertySymbols;var Y=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var C=(i,a,t)=>a in i?X(i,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[a]=t,L=(i,a)=>{for(var t in a||(a={}))Y.call(a,t)&&C(i,t,a[t]);if(q)for(var t of q(a))Z.call(a,t)&&C(i,t,a[t]);return i},z=(i,a)=>J(i,Q(a));import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as F}from"./iframe-38FCFUQv.js";import{g as c}from"./colors-BnDqA8Th.js";import{g as B}from"./spacing-Bf5iY5pu.js";import{g as w}from"./radius-CrNLhUJa.js";import{g as ee}from"./animations-BabstCnB.js";import{B as se}from"./Button-CioV4BCG.js";import{P as re}from"./Progress-CiRLFMCA.js";import{c as E}from"./createLucideIcon-DQdFte_Y.js";import{C as te}from"./circle-alert-C1QBYRrG.js";import{C as ae}from"./circle-check-DcBi3U0v.js";import{X as ie}from"./x-g6OncSvk.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}]],oe=E("file",ne);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],ce=E("upload",le);function de({accept:i,multiple:a=!1,maxSize:t,maxFiles:D,onFilesChange:l,onFileRemove:u,showPreview:$=!0,showProgress:f=!1,disabled:d=!1,className:I="",label:g,description:x}){const[m,h]=F.useState([]),[y,v]=F.useState(!1),p=F.useRef(null),j=e=>{if(e===0)return"0 Bytes";const r=1024,n=["Bytes","KB","MB","GB"],o=Math.floor(Math.log(e)/Math.log(r));return Math.round(e/Math.pow(r,o)*100)/100+" "+n[o]},V=e=>t&&e.size>t?`File size exceeds ${j(t)}`:null,T=e=>{const r=Array.from(e),n=[];return r.forEach(o=>{const G=V(o),A=`${Date.now()}-${Math.random().toString(36).substr(2,9)}`,H={file:o,id:A,error:G,progress:f?0:void 0};if($&&o.type.startsWith("image/")){const M=new FileReader;M.onload=K=>{h(W=>W.map(N=>{var k;return N.id===A?z(L({},N),{preview:(k=K.target)==null?void 0:k.result}):N}))},M.readAsDataURL(o)}n.push(H)}),n},b=e=>{const r=a?[...m,...e]:e,n=D?r.slice(0,D):r;h(n),l==null||l(n)},_=e=>{if(e.preventDefault(),v(!1),d)return;const r=e.dataTransfer.files;if(r.length>0){const n=T(r);b(n)}},R=e=>{e.preventDefault(),d||v(!0)},S=e=>{e.preventDefault(),v(!1)},O=e=>{if(e.target.files&&e.target.files.length>0){const r=T(e.target.files);b(r)}p.current&&(p.current.value="")},P=e=>{const r=m.filter(n=>n.id!==e);h(r),l==null||l(r),u==null||u(e)},U=()=>{var e;d||(e=p.current)==null||e.click()};return s.jsxs("div",{className:`space-y-4 ${I}`,children:[(g||x)&&s.jsxs("div",{children:[g&&s.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:g}),x&&s.jsx("p",{className:"text-sm text-gray-500",children:x})]}),s.jsxs("div",{onDrop:_,onDragOver:R,onDragLeave:S,onClick:U,className:`
          relative
          border-2
          border-dashed
          ${y?c("primary","DEFAULT","border"):"border-gray-300"}
          ${w("lg")}
          ${B("lg","p")}
          text-center
          cursor-pointer
          ${ee("base")}
          ${d?"opacity-50 cursor-not-allowed":"hover:border-gray-400"}
        `,children:[s.jsx("input",{ref:p,type:"file",accept:i,multiple:a,onChange:O,disabled:d,className:"hidden"}),s.jsxs("div",{className:"flex flex-col items-center gap-2",children:[s.jsx(ce,{className:`
              ${y?c("primary","DEFAULT","text"):"text-gray-400"}
              h-8 w-8
            `}),s.jsxs("div",{children:[s.jsx("span",{className:"text-sm font-medium text-gray-700",children:y?"Drop files here":"Click to upload or drag and drop"}),i&&s.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["Accepted: ",i]}),t&&s.jsxs("p",{className:"text-xs text-gray-500",children:["Max size: ",j(t)]})]})]})]}),m.length>0&&s.jsx("div",{className:"space-y-2",children:m.map(e=>s.jsxs("div",{className:`
                flex
                items-center
                gap-3
                ${B("base","p")}
                border
                border-gray-200
                ${w("md")}
                ${e.error?c("error","light","bg"):"bg-gray-50"}
              `,children:[$&&e.preview?s.jsx("img",{src:e.preview,alt:e.file.name,className:`w-12 h-12 object-cover ${w("md")}`}):s.jsx(oe,{className:"h-8 w-8 text-gray-400"}),s.jsxs("div",{className:"flex-1 min-w-0",children:[s.jsx("p",{className:"text-sm font-medium text-gray-900 truncate",children:e.file.name}),s.jsx("p",{className:"text-xs text-gray-500",children:j(e.file.size)}),e.error&&s.jsxs("div",{className:"flex items-center gap-1 mt-1",children:[s.jsx(te,{className:`h-3 w-3 ${c("error","DEFAULT","text")}`}),s.jsx("span",{className:`text-xs ${c("error","DEFAULT","text")}`,children:e.error})]}),f&&e.progress!==void 0&&s.jsx("div",{className:"mt-2",children:s.jsx(re,{value:e.progress,size:"sm"})})]}),!e.error&&!f&&s.jsx(ae,{className:`h-5 w-5 ${c("success","DEFAULT","text")}`}),s.jsx(se,{variant:"ghost",size:"sm",onClick:r=>{r.stopPropagation(),P(e.id)},className:"h-auto p-1","aria-label":`Remove ${e.file.name}`,children:s.jsx(ie,{className:"h-4 w-4"})})]},e.id))})]})}de.__docgenInfo={description:`FileUpload Component

A file upload component with drag and drop, preview, validation, and progress.
Follows Atomic Design principles as a Molecule component.

@example
\`\`\`tsx
<FileUpload
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  onFilesChange={(files) => console.log(files)}
/>
\`\`\``,methods:[],displayName:"FileUpload",props:{accept:{required:!1,tsType:{name:"string"},description:""},multiple:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},maxSize:{required:!1,tsType:{name:"number"},description:""},maxFiles:{required:!1,tsType:{name:"number"},description:""},onFilesChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(files: FileUploadFile[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"FileUploadFile"}],raw:"FileUploadFile[]"},name:"files"}],return:{name:"void"}}},description:""},onFileRemove:{required:!1,tsType:{name:"signature",type:"function",raw:"(fileId: string) => void",signature:{arguments:[{type:{name:"string"},name:"fileId"}],return:{name:"void"}}},description:""},showPreview:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},showProgress:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}},label:{required:!1,tsType:{name:"string"},description:""},description:{required:!1,tsType:{name:"string"},description:""}}};export{de as F};
