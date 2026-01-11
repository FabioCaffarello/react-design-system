import{S as s}from"./Select-C5fpSU2z.js";import"./jsx-runtime-D_zvdyIk.js";const c={title:"UI/Atoms/Select",component:s,parameters:{docs:{description:{component:"A styled select dropdown component for forms. Supports options, placeholder, and error states."}}},argTypes:{options:{control:"object",description:"Array of options to display"},placeholder:{control:"text",description:"Placeholder text for the select"},error:{control:"boolean",description:"Whether the select is in an error state"}}},n=[{value:"1",label:"Option 1"},{value:"2",label:"Option 2"},{value:"3",label:"Option 3"}],e={args:{options:n,placeholder:"Select an option"}},a={args:{options:n,defaultValue:"2"}},o={args:{options:n,placeholder:"Select an option",error:!0}},r={args:{options:[{value:"1",label:"Option 1"},{value:"2",label:"Option 2 (Disabled)",disabled:!0},{value:"3",label:"Option 3"}],placeholder:"Select an option"}},t={args:{options:[{value:"DRAFT",label:"Draft"},{value:"ACTIVE",label:"Active"},{value:"COMPLETED",label:"Completed"},{value:"ARCHIVED",label:"Archived"}],placeholder:"Select status"}},l={args:{options:[{value:"LOW",label:"Low"},{value:"MEDIUM",label:"Medium"},{value:"HIGH",label:"High"},{value:"CRITICAL",label:"Critical"}],placeholder:"Select priority"}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    options: defaultOptions,
    placeholder: "Select an option"
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    options: defaultOptions,
    defaultValue: "2"
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    options: defaultOptions,
    placeholder: "Select an option",
    error: true
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: "1",
      label: "Option 1"
    }, {
      value: "2",
      label: "Option 2 (Disabled)",
      disabled: true
    }, {
      value: "3",
      label: "Option 3"
    }],
    placeholder: "Select an option"
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: "DRAFT",
      label: "Draft"
    }, {
      value: "ACTIVE",
      label: "Active"
    }, {
      value: "COMPLETED",
      label: "Completed"
    }, {
      value: "ARCHIVED",
      label: "Archived"
    }],
    placeholder: "Select status"
  }
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: "LOW",
      label: "Low"
    }, {
      value: "MEDIUM",
      label: "Medium"
    }, {
      value: "HIGH",
      label: "High"
    }, {
      value: "CRITICAL",
      label: "Critical"
    }],
    placeholder: "Select priority"
  }
}`,...l.parameters?.docs?.source}}};const d=["Primary","WithSelectedValue","WithError","WithDisabledOption","StatusOptions","PriorityOptions"];export{e as Primary,l as PriorityOptions,t as StatusOptions,r as WithDisabledOption,o as WithError,a as WithSelectedValue,d as __namedExportsOrder,c as default};
