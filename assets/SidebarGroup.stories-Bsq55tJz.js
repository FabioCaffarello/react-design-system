var z=Object.defineProperty,D=Object.defineProperties;var K=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var A=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var S=(o,t,i)=>t in o?z(o,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):o[t]=i,r=(o,t)=>{for(var i in t||(t={}))A.call(t,i)&&S(o,i,t[i]);if(b)for(var i of b(t))O.call(t,i)&&S(o,i,t[i]);return o},a=(o,t)=>D(o,K(t));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as _}from"./iframe-38FCFUQv.js";import{S as u}from"./SidebarGroup-htIdM0Sn.js";import{a as s}from"./SidebarItem-F_v96Oje.js";import"./preload-helper-BDBacUwf.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./Button-CioV4BCG.js";import"./Spinner-zwBmS9q3.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";import"./AvatarGroup-QeYvIKtG.js";import"./chevron-right-B-aA5A0W.js";const Me={title:"Organisms/Sidebar/SidebarGroup",component:u,parameters:{docs:{description:{component:"A group container for sidebar items with optional title. Supports collapsible groups."}}},argTypes:{title:{control:"text",description:"Title text for the group"},collapsible:{control:"boolean",description:"Whether the group can be collapsed"},defaultCollapsed:{control:"boolean",description:"Initial collapsed state (uncontrolled mode)"}}},n={args:{title:"Agile",children:e.jsxs(e.Fragment,{children:[e.jsx(s,{href:"/epics",children:"Epics"}),e.jsx(s,{href:"/stories",children:"Stories"}),e.jsx(s,{href:"/tasks",children:"Tasks"})]})}},l={args:{children:e.jsxs(e.Fragment,{children:[e.jsx(s,{href:"/kanban",children:"Kanban"}),e.jsx(s,{href:"/sprints",children:"Sprints"})]})}},d={args:{title:"Backlog",collapsible:!0,defaultCollapsed:!1,children:e.jsxs(e.Fragment,{children:[e.jsx(s,{href:"/epics",nested:!0,children:"Epics"}),e.jsx(s,{href:"/stories",nested:!0,children:"Stories"}),e.jsx(s,{href:"/tasks",nested:!0,children:"Tasks"})]})}},c={args:{title:"Backlog",collapsible:!0,defaultCollapsed:!0,children:e.jsxs(e.Fragment,{children:[e.jsx(s,{href:"/epics",nested:!0,children:"Epics"}),e.jsx(s,{href:"/stories",nested:!0,children:"Stories"}),e.jsx(s,{href:"/tasks",nested:!0,children:"Tasks"})]})}},p={render:()=>{const[o,t]=_.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("button",{onClick:()=>t(!o),className:"px-4 py-2 bg-gray-100 rounded",children:[o?"Expand":"Collapse"," (External Control)"]}),e.jsxs(u,{title:"Backlog",collapsible:!0,collapsed:o,onCollapseChange:t,children:[e.jsx(s,{href:"/epics",nested:!0,children:"Epics"}),e.jsx(s,{href:"/stories",nested:!0,children:"Stories"}),e.jsx(s,{href:"/tasks",nested:!0,children:"Tasks"})]})]})}},m={args:{title:"Backlog",collapsible:!0,defaultCollapsed:!1,children:e.jsxs(e.Fragment,{children:[e.jsx(s,{href:"/epics",nested:!0,icon:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),children:"Epics"}),e.jsx(s,{href:"/stories",nested:!0,icon:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),children:"Stories"}),e.jsx(s,{href:"/tasks",nested:!0,icon:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"})}),children:"Tasks"})]})}},h={render:()=>e.jsxs("div",{className:"w-64 bg-white border-r border-gray-200 p-4 space-y-4",children:[e.jsxs(u,{title:"Backlog",collapsible:!0,defaultCollapsed:!1,children:[e.jsx(s,{href:"/epics",nested:!0,children:"Epics"}),e.jsx(s,{href:"/stories",nested:!0,children:"Stories"}),e.jsx(s,{href:"/tasks",nested:!0,children:"Tasks"})]}),e.jsxs(u,{children:[e.jsx(s,{href:"/kanban",children:"Kanban"}),e.jsx(s,{href:"/sprints",children:"Sprints"})]})]})};var f,k,g;n.parameters=a(r({},n.parameters),{docs:a(r({},(f=n.parameters)==null?void 0:f.docs),{source:r({originalSource:`{
  args: {
    title: "Agile",
    children: <>
        <SidebarItem href="/epics">Epics</SidebarItem>
        <SidebarItem href="/stories">Stories</SidebarItem>
        <SidebarItem href="/tasks">Tasks</SidebarItem>
      </>
  }
}`},(g=(k=n.parameters)==null?void 0:k.docs)==null?void 0:g.source)})});var x,I,j;l.parameters=a(r({},l.parameters),{docs:a(r({},(x=l.parameters)==null?void 0:x.docs),{source:r({originalSource:`{
  args: {
    children: <>
        <SidebarItem href="/kanban">Kanban</SidebarItem>
        <SidebarItem href="/sprints">Sprints</SidebarItem>
      </>
  }
}`},(j=(I=l.parameters)==null?void 0:I.docs)==null?void 0:j.source)})});var C,v,E;d.parameters=a(r({},d.parameters),{docs:a(r({},(C=d.parameters)==null?void 0:C.docs),{source:r({originalSource:`{
  args: {
    title: "Backlog",
    collapsible: true,
    defaultCollapsed: false,
    children: <>
        <SidebarItem href="/epics" nested={true}>Epics</SidebarItem>
        <SidebarItem href="/stories" nested={true}>Stories</SidebarItem>
        <SidebarItem href="/tasks" nested={true}>Tasks</SidebarItem>
      </>
  }
}`},(E=(v=d.parameters)==null?void 0:v.docs)==null?void 0:E.source)})});var w,B,T;c.parameters=a(r({},c.parameters),{docs:a(r({},(w=c.parameters)==null?void 0:w.docs),{source:r({originalSource:`{
  args: {
    title: "Backlog",
    collapsible: true,
    defaultCollapsed: true,
    children: <>
        <SidebarItem href="/epics" nested={true}>Epics</SidebarItem>
        <SidebarItem href="/stories" nested={true}>Stories</SidebarItem>
        <SidebarItem href="/tasks" nested={true}>Tasks</SidebarItem>
      </>
  }
}`},(T=(B=c.parameters)==null?void 0:B.docs)==null?void 0:T.source)})});var N,L,M;p.parameters=a(r({},p.parameters),{docs:a(r({},(N=p.parameters)==null?void 0:N.docs),{source:r({originalSource:`{
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return <div className="space-y-4">
        <button onClick={() => setCollapsed(!collapsed)} className="px-4 py-2 bg-gray-100 rounded">
          {collapsed ? "Expand" : "Collapse"} (External Control)
        </button>
        <SidebarGroup title="Backlog" collapsible={true} collapsed={collapsed} onCollapseChange={setCollapsed}>
          <SidebarItem href="/epics" nested={true}>Epics</SidebarItem>
          <SidebarItem href="/stories" nested={true}>Stories</SidebarItem>
          <SidebarItem href="/tasks" nested={true}>Tasks</SidebarItem>
        </SidebarGroup>
      </div>;
  }
}`},(M=(L=p.parameters)==null?void 0:L.docs)==null?void 0:M.source)})});var y,W,G;m.parameters=a(r({},m.parameters),{docs:a(r({},(y=m.parameters)==null?void 0:y.docs),{source:r({originalSource:`{
  args: {
    title: "Backlog",
    collapsible: true,
    defaultCollapsed: false,
    children: <>
        <SidebarItem href="/epics" nested={true} icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>}>
          Epics
        </SidebarItem>
        <SidebarItem href="/stories" nested={true} icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>}>
          Stories
        </SidebarItem>
        <SidebarItem href="/tasks" nested={true} icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>}>
          Tasks
        </SidebarItem>
      </>
  }
}`},(G=(W=m.parameters)==null?void 0:W.docs)==null?void 0:G.source)})});var V,H,F;h.parameters=a(r({},h.parameters),{docs:a(r({},(V=h.parameters)==null?void 0:V.docs),{source:r({originalSource:`{
  render: () => <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-4">
      <SidebarGroup title="Backlog" collapsible={true} defaultCollapsed={false}>
        <SidebarItem href="/epics" nested={true}>Epics</SidebarItem>
        <SidebarItem href="/stories" nested={true}>Stories</SidebarItem>
        <SidebarItem href="/tasks" nested={true}>Tasks</SidebarItem>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarItem href="/kanban">Kanban</SidebarItem>
        <SidebarItem href="/sprints">Sprints</SidebarItem>
      </SidebarGroup>
    </div>
}`},(F=(H=h.parameters)==null?void 0:H.docs)==null?void 0:F.source)})});const ye=["Default","WithoutTitle","Collapsible","CollapsibleDefaultCollapsed","ControlledCollapsible","WithNestedItems","MultipleGroups"];export{d as Collapsible,c as CollapsibleDefaultCollapsed,p as ControlledCollapsible,n as Default,h as MultipleGroups,m as WithNestedItems,l as WithoutTitle,ye as __namedExportsOrder,Me as default};
