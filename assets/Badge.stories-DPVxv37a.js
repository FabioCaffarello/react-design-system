import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{B as a}from"./Badge-B3jnsIqK.js";const g={title:"UI/Atoms/Badge",component:a,parameters:{docs:{description:{component:"A versatile badge component for displaying status, priority, and other labels. Supports multiple variants: success, warning, error, info, and neutral."}}},argTypes:{variant:{control:"select",options:["success","warning","error","info","neutral"],description:"Visual variant of the badge"},children:{control:"text",description:"Content to display inside the badge"}}},e={args:{children:"Success",variant:"success"}},n={args:{children:"Warning",variant:"warning"}},s={args:{children:"Error",variant:"error"}},t={args:{children:"Info",variant:"info"}},i={args:{children:"Neutral",variant:"neutral"}},o={render:()=>r.jsxs("div",{className:"flex gap-2 flex-wrap",children:[r.jsx(a,{variant:"success",children:"Success"}),r.jsx(a,{variant:"warning",children:"Warning"}),r.jsx(a,{variant:"error",children:"Error"}),r.jsx(a,{variant:"info",children:"Info"}),r.jsx(a,{variant:"neutral",children:"Neutral"})]})},c={render:()=>r.jsxs("div",{className:"flex gap-2 flex-wrap",children:[r.jsx(a,{variant:"success",children:"Active"}),r.jsx(a,{variant:"error",children:"Critical"}),r.jsx(a,{variant:"warning",children:"Pending"}),r.jsx(a,{variant:"info",children:"New"}),r.jsx(a,{variant:"neutral",children:"Draft"})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Success",
    variant: "success"
  }
}`,...e.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Warning",
    variant: "warning"
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Error",
    variant: "error"
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Info",
    variant: "info"
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Neutral",
    variant: "neutral"
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2 flex-wrap">
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2 flex-wrap">
      <Badge variant="success">Active</Badge>
      <Badge variant="error">Critical</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="info">New</Badge>
      <Badge variant="neutral">Draft</Badge>
    </div>
}`,...c.parameters?.docs?.source}}};const u=["Success","Warning","Error","Info","Neutral","AllVariants","WithCustomContent"];export{o as AllVariants,s as Error,t as Info,i as Neutral,e as Success,n as Warning,c as WithCustomContent,u as __namedExportsOrder,g as default};
