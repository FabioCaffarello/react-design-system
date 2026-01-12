var R=Object.defineProperty,_=Object.defineProperties;var z=Object.getOwnPropertyDescriptors;var d=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,k=Object.prototype.propertyIsEnumerable;var w=(i,r,t)=>r in i?R(i,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[r]=t,s=(i,r)=>{for(var t in r||(r={}))y.call(r,t)&&w(i,t,r[t]);if(d)for(var t of d(r))k.call(r,t)&&w(i,t,r[t]);return i},n=(i,r)=>_(i,z(r));var g=(i,r)=>{var t={};for(var o in i)y.call(i,o)&&r.indexOf(o)<0&&(t[o]=i[o]);if(i!=null&&d)for(var o of d(i))r.indexOf(o)<0&&k.call(i,o)&&(t[o]=i[o]);return t};import{j as e}from"./jsx-runtime-D_zvdyIk.js";import"./Info-Cv2nzaKC.js";import{T as F}from"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import{B as K}from"./Button-CioV4BCG.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import{S as O}from"./SidebarGroup-htIdM0Sn.js";import{a as U}from"./SidebarItem-F_v96Oje.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";import"./chevron-right-B-aA5A0W.js";function v(x){var l=x,{title:i,onClose:r,showCloseButton:t=!1,children:o,className:h=""}=l,f=g(l,["title","onClose","showCloseButton","children","className"]);const b=[...["flex","items-center","justify-between","px-4","py-4","border-b","border-gray-200"],h].filter(Boolean).join(" ");return e.jsxs("div",n(s({className:b},f),{children:[e.jsx(F,{as:"h2",className:"text-lg font-semibold text-gray-900",children:i}),e.jsxs("div",{className:"flex items-center space-x-2",children:[o,t&&r&&e.jsx(K,{variant:"secondary",onClick:r,className:"p-1","aria-label":"Close sidebar",children:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})})})]})]}))}v.__docgenInfo={description:`SidebarHeader Component

Header section of a sidebar with title and optional close button.
Follows Atomic Design principles as a Molecule component.

@example
\`\`\`tsx
<SidebarHeader title="Navigation" onClose={handleClose} />
\`\`\``,methods:[],displayName:"SidebarHeader",props:{title:{required:!0,tsType:{name:"string"},description:""},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},showCloseButton:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactNode"},description:""},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["HTMLAttributes"]};function a($){var j=$,{variant:i="default",title:r,showHeader:t=!0,onClose:o,children:h,className:f="","aria-label":x,"aria-labelledby":l,role:I="navigation"}=j,b=g(j,["variant","title","showHeader","onClose","children","className","aria-label","aria-labelledby","role"]);const W=["flex","flex-col","bg-white","h-full","w-full"],P={default:"",collapsed:""},D=[...W,P[i],f].filter(Boolean).join(" "),S=r&&!l?`sidebar-title-${Math.random().toString(36).substr(2,9)}`:void 0;return e.jsxs("nav",n(s({className:D,role:I,"aria-label":x||(r?void 0:"Sidebar navigation"),"aria-labelledby":l||S||void 0},b),{children:[t&&r&&e.jsx("div",{className:"flex-shrink-0",id:S,children:e.jsx(v,{title:r,onClose:o,showCloseButton:!!o})}),e.jsx("div",{className:"flex-1 overflow-y-auto py-4 min-h-0",children:h})]}))}a.Group=O;a.Item=U;a.Header=v;a.__docgenInfo={description:`Sidebar Component

A sidebar navigation component with header, groups, and items.
Follows Atomic Design principles as an Organism component.
Uses Compound Components pattern.

@example
\`\`\`tsx
<Sidebar title="Navigation" variant="default">
  <Sidebar.Group title="Agile">
    <Sidebar.Item href="/epics" isActive>Epics</Sidebar.Item>
    <Sidebar.Item href="/stories">Stories</Sidebar.Item>
  </Sidebar.Group>
</Sidebar>
\`\`\``,methods:[{name:"Group",docblock:null,modifiers:["static"],params:[{name:`{
  title,
  titleIcon,
  children,
  collapsible = false,
  defaultCollapsed = false,
  collapsed,
  onCollapseChange,
  storageKey,
  showChevron = true,
  className = "",
  ...props
}: SidebarGroupProps`,optional:!1,type:{name:"SidebarGroupProps",alias:"SidebarGroupProps"}}],returns:null},{name:"Item",docblock:null,modifiers:["static"],params:[{name:`{
  href,
  isActive = false,
  icon,
  nested = false,
  iconSize = 'md',
  children,
  className = "",
  ...props
}: SidebarItemProps`,optional:!1,type:{name:"SidebarItemProps",alias:"SidebarItemProps"}}],returns:null},{name:"Header",docblock:null,modifiers:["static"],params:[{name:`{
  title,
  onClose,
  showCloseButton = false,
  children,
  className = "",
  ...props
}: SidebarHeaderProps`,optional:!1,type:{name:"SidebarHeaderProps",alias:"SidebarHeaderProps"}}],returns:null}],displayName:"SidebarComponent",props:{variant:{required:!1,tsType:{name:"union",raw:'"default" | "collapsed"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"collapsed"'}]},description:"",defaultValue:{value:'"default"',computed:!1}},title:{required:!1,tsType:{name:"string"},description:""},showHeader:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},onClose:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},"aria-label":{required:!1,tsType:{name:"string"},description:""},"aria-labelledby":{required:!1,tsType:{name:"string"},description:""},role:{required:!1,tsType:{name:"union",raw:"'navigation' | 'complementary'",elements:[{name:"literal",value:"'navigation'"},{name:"literal",value:"'complementary'"}]},description:"",defaultValue:{value:"'navigation'",computed:!1}},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["HTMLAttributes"]};const Ee={title:"Organisms/Sidebar",component:a,parameters:{docs:{description:{component:"A sidebar navigation component with header, groups, and items. Uses Compound Components pattern."}}},argTypes:{variant:{control:"select",options:["default","collapsed"],description:"Visual variant of the sidebar"},title:{control:"text",description:"Title displayed in the header"},showHeader:{control:"boolean",description:"Whether to show the header"}}},p={args:{title:"Navigation",showHeader:!0,children:e.jsxs(e.Fragment,{children:[e.jsxs(a.Group,{title:"Agile",children:[e.jsx(a.Item,{href:"/epics",isActive:!0,children:"Epics"}),e.jsx(a.Item,{href:"/stories",children:"Stories"}),e.jsx(a.Item,{href:"/backlog",children:"Backlog"}),e.jsx(a.Item,{href:"/kanban",children:"Kanban"}),e.jsx(a.Item,{href:"/sprints",children:"Sprints"})]}),e.jsxs(a.Group,{title:"Documentation",children:[e.jsx(a.Item,{href:"/adrs",children:"ADRs"}),e.jsx(a.Item,{href:"/roadmap",children:"Roadmap"})]})]})}},m={args:{title:"Navigation",showHeader:!0,children:e.jsxs(a.Group,{title:"Agile",children:[e.jsx(a.Item,{href:"/epics",isActive:!0,icon:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),children:"Epics"}),e.jsx(a.Item,{href:"/stories",icon:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),children:"Stories"})]})}},c={args:{title:"Navigation",variant:"collapsed",showHeader:!0,children:e.jsxs(a.Group,{children:[e.jsx(a.Item,{href:"/epics",isActive:!0,children:"Epics"}),e.jsx(a.Item,{href:"/stories",children:"Stories"})]})}},u={args:{showHeader:!1,children:e.jsxs(a.Group,{children:[e.jsx(a.Item,{href:"/epics",isActive:!0,children:"Epics"}),e.jsx(a.Item,{href:"/stories",children:"Stories"})]})}};var C,N,H;p.parameters=n(s({},p.parameters),{docs:n(s({},(C=p.parameters)==null?void 0:C.docs),{source:s({originalSource:`{
  args: {
    title: "Navigation",
    showHeader: true,
    children: <>
        <Sidebar.Group title="Agile">
          <Sidebar.Item href="/epics" isActive>
            Epics
          </Sidebar.Item>
          <Sidebar.Item href="/stories">Stories</Sidebar.Item>
          <Sidebar.Item href="/backlog">Backlog</Sidebar.Item>
          <Sidebar.Item href="/kanban">Kanban</Sidebar.Item>
          <Sidebar.Item href="/sprints">Sprints</Sidebar.Item>
        </Sidebar.Group>
        <Sidebar.Group title="Documentation">
          <Sidebar.Item href="/adrs">ADRs</Sidebar.Item>
          <Sidebar.Item href="/roadmap">Roadmap</Sidebar.Item>
        </Sidebar.Group>
      </>
  }
}`},(H=(N=p.parameters)==null?void 0:N.docs)==null?void 0:H.source)})});var A,G,T;m.parameters=n(s({},m.parameters),{docs:n(s({},(A=m.parameters)==null?void 0:A.docs),{source:s({originalSource:`{
  args: {
    title: "Navigation",
    showHeader: true,
    children: <Sidebar.Group title="Agile">
        <Sidebar.Item href="/epics" isActive icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>}>
          Epics
        </Sidebar.Item>
        <Sidebar.Item href="/stories" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>}>
          Stories
        </Sidebar.Item>
      </Sidebar.Group>
  }
}`},(T=(G=m.parameters)==null?void 0:G.docs)==null?void 0:T.source)})});var V,q,B;c.parameters=n(s({},c.parameters),{docs:n(s({},(V=c.parameters)==null?void 0:V.docs),{source:s({originalSource:`{
  args: {
    title: "Navigation",
    variant: "collapsed",
    showHeader: true,
    children: <Sidebar.Group>
        <Sidebar.Item href="/epics" isActive>
          Epics
        </Sidebar.Item>
        <Sidebar.Item href="/stories">Stories</Sidebar.Item>
      </Sidebar.Group>
  }
}`},(B=(q=c.parameters)==null?void 0:q.docs)==null?void 0:B.source)})});var L,E,M;u.parameters=n(s({},u.parameters),{docs:n(s({},(L=u.parameters)==null?void 0:L.docs),{source:s({originalSource:`{
  args: {
    showHeader: false,
    children: <Sidebar.Group>
        <Sidebar.Item href="/epics" isActive>
          Epics
        </Sidebar.Item>
        <Sidebar.Item href="/stories">Stories</Sidebar.Item>
      </Sidebar.Group>
  }
}`},(M=(E=u.parameters)==null?void 0:E.docs)==null?void 0:M.source)})});const Me=["Default","WithIcons","Collapsed","WithoutHeader"];export{c as Collapsed,p as Default,m as WithIcons,u as WithoutHeader,Me as __namedExportsOrder,Ee as default};
