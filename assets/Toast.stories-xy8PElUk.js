var gt=Object.defineProperty,xt=Object.defineProperties;var Ct=Object.getOwnPropertyDescriptors;var w=Object.getOwnPropertySymbols;var q=Object.prototype.hasOwnProperty,M=Object.prototype.propertyIsEnumerable;var V=(t,o,i)=>o in t?gt(t,o,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[o]=i,s=(t,o)=>{for(var i in o||(o={}))q.call(o,i)&&V(t,i,o[i]);if(w)for(var i of w(o))M.call(o,i)&&V(t,i,o[i]);return t},a=(t,o)=>xt(t,Ct(o));var P=(t,o)=>{var i={};for(var r in t)q.call(t,r)&&o.indexOf(r)<0&&(i[r]=t[r]);if(t!=null&&w)for(var r of w(t))o.indexOf(r)<0&&M.call(t,r)&&(i[r]=t[r]);return i};import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as u}from"./iframe-38FCFUQv.js";import{r as bt}from"./index-CpssgTzR.js";import{g as j}from"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./typography-BGNr2Ph4.js";import{g as wt}from"./shadows-B52VkgOA.js";import{g as jt}from"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import{B as m}from"./Button-CioV4BCG.js";import{c as ft}from"./createLucideIcon-DQdFte_Y.js";import{C as kt}from"./circle-alert-C1QBYRrG.js";import{C as yt}from"./circle-check-DcBi3U0v.js";import{X as St}from"./x-g6OncSvk.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import"./preload-helper-BDBacUwf.js";import"./index-ZYLuXEVB.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nt=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],Dt=ft("info",Nt);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const At=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],Bt=ft("triangle-alert",At),ht=u.createContext(void 0);function Tt(){const t=u.useContext(ht);if(!t)throw new Error("Toast components must be used within a ToastProvider");return t}function _({children:t,defaultDuration:o=5e3,maxToasts:i=5}){const[r,d]=u.useState([]),p=u.useCallback(c=>{var C;const l=`toast-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,T=a(s({},c),{id:l,duration:(C=c.duration)!=null?C:o});return d(b=>[T,...b].slice(0,i)),l},[o,i]),h=u.useCallback(c=>{d(l=>l.filter(T=>T.id!==c))},[]),f=u.useCallback(()=>{d([])},[]),n={toasts:r,addToast:p,removeToast:h,clearAll:f};return e.jsx(ht.Provider,{value:n,children:t})}_.__docgenInfo={description:"",methods:[],displayName:"ToastProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},defaultDuration:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5000",computed:!1}},maxToasts:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5",computed:!1}}}};const Et={success:yt,error:kt,warning:Bt,info:Dt},$t={success:"success",error:"error",warning:"warning",info:"info"};function vt(h){var f=h,{toast:t,onDismiss:o,position:i="top-right",className:r="",style:d}=f,p=P(f,["toast","onDismiss","position","className","style"]);const[n,c]=u.useState(!1),[l,T]=u.useState(!1),C=Et[t.variant],b=$t[t.variant];u.useEffect(()=>{if(t.duration===void 0)return;c(!0);const v=setTimeout(()=>{T(!0),setTimeout(()=>{o(t.id)},300)},t.duration);return()=>clearTimeout(v)},[t.duration,t.id,o]),u.useEffect(()=>{const v=setTimeout(()=>c(!0),10);return()=>clearTimeout(v)},[]);const F={"top-right":"top-4 right-4","top-left":"top-4 left-4","bottom-right":"bottom-4 right-4","bottom-left":"bottom-4 left-4","top-center":"top-4 left-1/2 -translate-x-1/2","bottom-center":"bottom-4 left-1/2 -translate-x-1/2"},I=()=>{T(!0),setTimeout(()=>{o(t.id)},300)};return e.jsx("div",a(s({className:`
        fixed ${F[i]} z-50
        w-full max-w-sm
        transition-all duration-300 ease-in-out
        ${n&&!l?"opacity-100 translate-y-0":"opacity-0 -translate-y-2"}
        ${l?"opacity-0 translate-y-2":""}
        ${r}
      `,style:d,role:"alert","aria-live":t.variant==="error"?"assertive":"polite","aria-atomic":"true"},p),{children:e.jsxs("div",{className:`
          flex items-start gap-3
          p-4
          bg-white
          ${jt("lg")}
          ${wt("lg")}
          border
          ${j(b,"DEFAULT","border")}
        `,children:[e.jsx("div",{className:`flex-shrink-0 ${j(b,"DEFAULT","text")}`,children:e.jsx(C,{className:"h-5 w-5","aria-hidden":"true"})}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsx("div",{className:`font-medium ${j("neutral","dark","text")}`,children:t.title}),t.description&&e.jsx("div",{className:`mt-1 text-sm ${j("neutral","DEFAULT","text")}`,children:t.description}),t.action&&e.jsx("div",{className:"mt-3",children:e.jsx(m,{variant:"outline",size:"sm",onClick:()=>{var v;(v=t.action)==null||v.onClick(),I()},children:t.action.label})})]}),e.jsx(m,{variant:"iconOnly",size:"sm",onClick:I,className:"flex-shrink-0","aria-label":"Dismiss notification",children:e.jsx(St,{className:"h-4 w-4"})})]})}))}vt.__docgenInfo={description:"",methods:[],displayName:"Toast",props:{toast:{required:!0,tsType:{name:"ToastType"},description:""},onDismiss:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string) => void",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"void"}}},description:""},position:{required:!1,tsType:{name:"union",raw:"'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'",elements:[{name:"literal",value:"'top-right'"},{name:"literal",value:"'top-left'"},{name:"literal",value:"'bottom-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'top-center'"},{name:"literal",value:"'bottom-center'"}]},description:"",defaultValue:{value:"'top-right'",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["Omit"]};function x({position:t="top-right",maxToasts:o}){const{toasts:i,removeToast:r}=Tt(),d=o?i.slice(0,o):i;if(d.length===0)return null;const p=e.jsx("div",{className:"fixed inset-0 pointer-events-none z-50","aria-live":"polite","aria-label":"Notifications",children:d.map((h,f)=>{const n=t.includes("top"),c=1+f*5;return e.jsx(vt,{toast:h,onDismiss:r,position:t,style:{[n?"top":"bottom"]:`${c}rem`}},h.id)})});return typeof window!="undefined"?bt.createPortal(p,document.body):p}x.__docgenInfo={description:"",methods:[],displayName:"ToastContainer",props:{position:{required:!1,tsType:{name:"union",raw:"'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'",elements:[{name:"literal",value:"'top-right'"},{name:"literal",value:"'top-left'"},{name:"literal",value:"'bottom-right'"},{name:"literal",value:"'bottom-left'"},{name:"literal",value:"'top-center'"},{name:"literal",value:"'bottom-center'"}]},description:"",defaultValue:{value:"'top-right'",computed:!1}},maxToasts:{required:!1,tsType:{name:"number"},description:""}}};function L(){const{addToast:t,removeToast:o,clearAll:i}=Tt(),r=u.useCallback(n=>t({title:n.title,description:n.description,variant:n.variant||"info",duration:n.duration,action:n.action}),[t]),d=u.useCallback((n,c,l)=>r(s({title:n,description:c,variant:"success"},l)),[r]),p=u.useCallback((n,c,l)=>r(s({title:n,description:c,variant:"error"},l)),[r]),h=u.useCallback((n,c,l)=>r(s({title:n,description:c,variant:"warning"},l)),[r]),f=u.useCallback((n,c,l)=>r(s({title:n,description:c,variant:"info"},l)),[r]);return{show:r,success:d,error:p,warning:h,info:f,dismiss:o,clearAll:i}}function g({position:t="top-right"}){const o=L();return e.jsxs("div",{className:"space-y-4 p-8",children:[e.jsxs("div",{className:"space-x-2",children:[e.jsx(m,{onClick:()=>o.success("Success!","Operation completed successfully"),children:"Show Success"}),e.jsx(m,{variant:"error",onClick:()=>o.error("Error!","Something went wrong"),children:"Show Error"}),e.jsx(m,{variant:"secondary",onClick:()=>o.warning("Warning!","Please be careful"),children:"Show Warning"}),e.jsx(m,{variant:"outline",onClick:()=>o.info("Info","Here is some information"),children:"Show Info"})]}),e.jsxs("div",{className:"space-x-2",children:[e.jsx(m,{variant:"outline",onClick:()=>o.success("With Action","Click the action button",{action:{label:"View Details",onClick:()=>alert("Action clicked!")}}),children:"Toast with Action"}),e.jsx(m,{variant:"outline",onClick:()=>o.info("Persistent","This toast will not auto-dismiss",{duration:void 0}),children:"Persistent Toast"}),e.jsx(m,{variant:"outline",onClick:()=>o.clearAll(),children:"Clear All"})]}),e.jsx(x,{position:t})]})}const xe={title:"Organisms/Toast",component:_,parameters:{docs:{description:{component:"A toast notification system with provider, hook, and container. Supports multiple variants, auto-dismiss, actions, and customizable positioning."}}},tags:["autodocs"],decorators:[t=>e.jsx(_,{children:e.jsx(t,{})})]},k={render:()=>e.jsx(g,{})},y={render:()=>e.jsx(g,{position:"top-left"})},S={render:()=>e.jsx(g,{position:"bottom-right"})},N={render:()=>e.jsx(g,{position:"bottom-left"})},D={render:()=>e.jsx(g,{position:"top-center"})},A={render:()=>e.jsx(g,{position:"bottom-center"})},B={render:()=>{const t=L();return e.jsxs("div",{className:"space-y-4 p-8",children:[e.jsx(m,{onClick:()=>{t.success("First Toast","This is the first notification"),setTimeout(()=>t.info("Second Toast","This is the second notification"),200),setTimeout(()=>t.warning("Third Toast","This is the third notification"),400),setTimeout(()=>t.error("Fourth Toast","This is the fourth notification"),600)},children:"Show Multiple Toasts"}),e.jsx(x,{})]})}},E={render:()=>{const t=L();return e.jsxs("div",{className:"space-y-4 p-8",children:[e.jsx(m,{onClick:()=>t.success("File Uploaded","Your file has been uploaded successfully",{action:{label:"View File",onClick:()=>alert("Opening file...")}}),children:"Toast with Action"}),e.jsx(x,{})]})}},$={render:()=>{const t=L();return e.jsxs("div",{className:"space-y-4 p-8",children:[e.jsx(m,{onClick:()=>t.info("Quick Toast","This will disappear in 2 seconds",{duration:2e3}),children:"Short Duration (2s)"}),e.jsx(m,{onClick:()=>t.info("Long Toast","This will disappear in 10 seconds",{duration:1e4}),children:"Long Duration (10s)"}),e.jsx(x,{})]})}};var O,z,R;k.parameters=a(s({},k.parameters),{docs:a(s({},(O=k.parameters)==null?void 0:O.docs),{source:s({originalSource:`{
  render: () => <ToastDemo />
}`},(R=(z=k.parameters)==null?void 0:z.docs)==null?void 0:R.source)})});var U,W,Q;y.parameters=a(s({},y.parameters),{docs:a(s({},(U=y.parameters)==null?void 0:U.docs),{source:s({originalSource:`{
  render: () => <ToastDemo position="top-left" />
}`},(Q=(W=y.parameters)==null?void 0:W.docs)==null?void 0:Q.source)})});var Y,H,X;S.parameters=a(s({},S.parameters),{docs:a(s({},(Y=S.parameters)==null?void 0:Y.docs),{source:s({originalSource:`{
  render: () => <ToastDemo position="bottom-right" />
}`},(X=(H=S.parameters)==null?void 0:H.docs)==null?void 0:X.source)})});var G,J,K;N.parameters=a(s({},N.parameters),{docs:a(s({},(G=N.parameters)==null?void 0:G.docs),{source:s({originalSource:`{
  render: () => <ToastDemo position="bottom-left" />
}`},(K=(J=N.parameters)==null?void 0:J.docs)==null?void 0:K.source)})});var Z,tt,et;D.parameters=a(s({},D.parameters),{docs:a(s({},(Z=D.parameters)==null?void 0:Z.docs),{source:s({originalSource:`{
  render: () => <ToastDemo position="top-center" />
}`},(et=(tt=D.parameters)==null?void 0:tt.docs)==null?void 0:et.source)})});var ot,st,rt;A.parameters=a(s({},A.parameters),{docs:a(s({},(ot=A.parameters)==null?void 0:ot.docs),{source:s({originalSource:`{
  render: () => <ToastDemo position="bottom-center" />
}`},(rt=(st=A.parameters)==null?void 0:st.docs)==null?void 0:rt.source)})});var it,at,nt;B.parameters=a(s({},B.parameters),{docs:a(s({},(it=B.parameters)==null?void 0:it.docs),{source:s({originalSource:`{
  render: () => {
    const toast = useToast();
    return <div className="space-y-4 p-8">
        <Button onClick={() => {
        toast.success('First Toast', 'This is the first notification');
        setTimeout(() => toast.info('Second Toast', 'This is the second notification'), 200);
        setTimeout(() => toast.warning('Third Toast', 'This is the third notification'), 400);
        setTimeout(() => toast.error('Fourth Toast', 'This is the fourth notification'), 600);
      }}>
          Show Multiple Toasts
        </Button>
        <ToastContainer />
      </div>;
  }
}`},(nt=(at=B.parameters)==null?void 0:at.docs)==null?void 0:nt.source)})});var ct,lt,ut;E.parameters=a(s({},E.parameters),{docs:a(s({},(ct=E.parameters)==null?void 0:ct.docs),{source:s({originalSource:`{
  render: () => {
    const toast = useToast();
    return <div className="space-y-4 p-8">
        <Button onClick={() => toast.success('File Uploaded', 'Your file has been uploaded successfully', {
        action: {
          label: 'View File',
          onClick: () => alert('Opening file...')
        }
      })}>
          Toast with Action
        </Button>
        <ToastContainer />
      </div>;
  }
}`},(ut=(lt=E.parameters)==null?void 0:lt.docs)==null?void 0:ut.source)})});var mt,dt,pt;$.parameters=a(s({},$.parameters),{docs:a(s({},(mt=$.parameters)==null?void 0:mt.docs),{source:s({originalSource:`{
  render: () => {
    const toast = useToast();
    return <div className="space-y-4 p-8">
        <Button onClick={() => toast.info('Quick Toast', 'This will disappear in 2 seconds', {
        duration: 2000
      })}>
          Short Duration (2s)
        </Button>
        <Button onClick={() => toast.info('Long Toast', 'This will disappear in 10 seconds', {
        duration: 10000
      })}>
          Long Duration (10s)
        </Button>
        <ToastContainer />
      </div>;
  }
}`},(pt=(dt=$.parameters)==null?void 0:dt.docs)==null?void 0:pt.source)})});const Ce=["Default","TopLeft","BottomRight","BottomLeft","TopCenter","BottomCenter","MultipleToasts","WithActions","CustomDuration"];export{A as BottomCenter,N as BottomLeft,S as BottomRight,$ as CustomDuration,k as Default,B as MultipleToasts,D as TopCenter,y as TopLeft,E as WithActions,Ce as __namedExportsOrder,xe as default};
