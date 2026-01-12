var _=Object.defineProperty,j=Object.defineProperties;var z=Object.getOwnPropertyDescriptors;var C=Object.getOwnPropertySymbols;var q=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var N=(e,n,t)=>n in e?_(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t,T=(e,n)=>{for(var t in n||(n={}))q.call(n,t)&&N(e,t,n[t]);if(C)for(var t of C(n))$.call(n,t)&&N(e,t,n[t]);return e},g=(e,n)=>j(e,z(n));var v=(e,n)=>{var t={};for(var a in e)q.call(e,a)&&n.indexOf(a)<0&&(t[a]=e[a]);if(e!=null&&C)for(var a of C(e))n.indexOf(a)<0&&$.call(e,a)&&(t[a]=e[a]);return t};import{j as y}from"./jsx-runtime-D_zvdyIk.js";import{r as b}from"./iframe-38FCFUQv.js";import{g as w}from"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./typography-BGNr2Ph4.js";import{g as P}from"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";const M=b.createContext(void 0);function A(){const e=b.useContext(M);if(e===void 0)throw new Error("useTabsContext must be used within a Tabs component");return e}function E({defaultValue:e,value:n,onValueChange:t,orientation:a="horizontal",activationMode:m="automatic",children:d}){const[u,p]=b.useState(e||""),r=n!==void 0,f=r?n:u,o=b.useCallback(s=>{r||p(s),t==null||t(s)},[r,t]),c={value:f,onValueChange:o,orientation:a,activationMode:m};return y.jsx(M.Provider,{value:c,children:d})}E.__docgenInfo={description:`TabsProvider Component

Provides Tabs context to children.
Manages active tab state and handles controlled/uncontrolled modes.`,methods:[],displayName:"TabsProvider",props:{defaultValue:{required:!1,tsType:{name:"string"},description:""},value:{required:!1,tsType:{name:"string"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},orientation:{required:!1,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:"",defaultValue:{value:"'horizontal'",computed:!1}},activationMode:{required:!1,tsType:{name:"union",raw:"'automatic' | 'manual'",elements:[{name:"literal",value:"'automatic'"},{name:"literal",value:"'manual'"}]},description:"",defaultValue:{value:"'automatic'",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function R(a){var m=a,{children:e,className:n=""}=m,t=v(m,["children","className"]);const{orientation:d}=A(),u=b.useRef(null);b.useEffect(()=>{const r=u.current;if(!r)return;const f=o=>{var x;const c=Array.from(r.querySelectorAll('[role="tab"]:not([disabled])')),s=c.findIndex(k=>k===document.activeElement);if(s===-1)return;let i=s;d==="horizontal"?o.key==="ArrowRight"?(o.preventDefault(),i=(s+1)%c.length):o.key==="ArrowLeft"&&(o.preventDefault(),i=(s-1+c.length)%c.length):o.key==="ArrowDown"?(o.preventDefault(),i=(s+1)%c.length):o.key==="ArrowUp"&&(o.preventDefault(),i=(s-1+c.length)%c.length),o.key==="Home"?(o.preventDefault(),i=0):o.key==="End"&&(o.preventDefault(),i=c.length-1),i!==s&&((x=c[i])==null||x.focus())};return r.addEventListener("keydown",f),()=>r.removeEventListener("keydown",f)},[d]);const p=d==="vertical"?"flex-col space-y-1":"flex-row space-x-1";return y.jsx("div",g(T({ref:u,role:"tablist","aria-orientation":d,className:`
        inline-flex
        ${p}
        p-1
        bg-gray-100
        ${P("md")}
        ${n}
      `},t),{children:e}))}R.__docgenInfo={description:`TabsList Component

Container for tab triggers.
Manages keyboard navigation between tabs.
Must be used within a Tabs component.`,methods:[],displayName:"TabsList",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};function D(p){var r=p,{value:e,children:n,disabled:t=!1,className:a="",onClick:m,onKeyDown:d}=r,u=v(r,["value","children","disabled","className","onClick","onKeyDown"]);const{value:f,onValueChange:o,orientation:c,activationMode:s}=A(),i=f===e,x=l=>{t||((s==="automatic"||i)&&o(e),m==null||m(l))},k=l=>{var L;s==="automatic"&&!t&&!i&&o(e),(L=u.onFocus)==null||L.call(u,l)},V=l=>{if(!t&&!(l.key==="ArrowRight"||l.key==="ArrowLeft"||l.key==="ArrowDown"||l.key==="ArrowUp"||l.key==="Home"||l.key==="End")){if(s==="manual"&&(l.key==="Enter"||l.key===" ")){l.preventDefault(),o(e);return}d==null||d(l)}};return y.jsx("button",g(T({type:"button",role:"tab","aria-selected":i,"aria-controls":`tabpanel-${e}`,id:`tab-${e}`,tabIndex:t?-1:i?0:-1,disabled:t,onClick:x,onFocus:k,onKeyDown:V,className:`
        inline-flex
        items-center
        justify-center
        px-3
        py-1.5
        text-sm
        font-medium
        transition-colors
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        ${P("sm")}
        ${i?`${w("primary","DEFAULT","bg")} ${w("primary","contrast","text")}`:`${w("neutral","light","text")} hover:${w("neutral","DEFAULT","bg")}`}
        ${t?"opacity-50 cursor-not-allowed":"cursor-pointer"}
        ${a}
      `},u),{children:n}))}D.__docgenInfo={description:`TabsTrigger Component

Individual tab trigger button.
Must be used within a TabsList component.`,methods:[],displayName:"TabsTrigger",props:{value:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};function I(d){var u=d,{value:e,children:n,forceMount:t=!1,className:a=""}=u,m=v(u,["value","children","forceMount","className"]);const{value:p}=A(),r=p===e;return!r&&!t?null:y.jsx("div",g(T({role:"tabpanel",id:`tabpanel-${e}`,"aria-labelledby":`tab-${e}`,hidden:!r,className:`
        mt-2
        focus:outline-none
        ${a}
      `},m),{children:n}))}I.__docgenInfo={description:`TabsContent Component

Content panel for a tab.
Only renders when the tab is active (unless forceMount is true).
Must be used within a Tabs component.`,methods:[],displayName:"TabsContent",props:{value:{required:!0,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},forceMount:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1}},composes:["HTMLAttributes"]};function h(t){var a=t,{children:e}=a,n=v(a,["children"]);return y.jsx(E,g(T({},n),{children:e}))}h.List=R;h.Trigger=D;h.Content=I;const W=h;h.__docgenInfo={description:`Tabs Component

A flexible tabs component with compound components pattern.
Supports horizontal and vertical orientations, automatic and manual activation modes.
Fully accessible with ARIA attributes and keyboard navigation.

@example
\`\`\`tsx
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>
\`\`\``,methods:[{name:"List",docblock:null,modifiers:["static"],params:[{name:`{
  children,
  className = '',
  ...props
}: TabsListProps`,optional:!1,type:{name:"TabsListProps",alias:"TabsListProps"}}],returns:null},{name:"Trigger",docblock:null,modifiers:["static"],params:[{name:`{
  value,
  children,
  disabled = false,
  className = '',
  onClick,
  onKeyDown,
  ...props
}: TabsTriggerProps`,optional:!1,type:{name:"TabsTriggerProps",alias:"TabsTriggerProps"}}],returns:null},{name:"Content",docblock:null,modifiers:["static"],params:[{name:`{
  value,
  children,
  forceMount = false,
  className = '',
  ...props
}: TabsContentProps`,optional:!1,type:{name:"TabsContentProps",alias:"TabsContentProps"}}],returns:null}],displayName:"TabsComponent",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""}},composes:["Omit"]};export{W as T};
