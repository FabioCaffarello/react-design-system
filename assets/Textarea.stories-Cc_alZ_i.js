import{T as t}from"./Textarea-lHY0thNE.js";import"./jsx-runtime-D_zvdyIk.js";const i={title:"UI/Atoms/Textarea",component:t,parameters:{docs:{description:{component:"A styled textarea component for longer text input. Supports error states and resize options."}}},argTypes:{placeholder:{control:"text",description:"Placeholder text"},rows:{control:"number",description:"Number of visible rows"},error:{control:"boolean",description:"Whether the textarea is in an error state"},resize:{control:"select",options:["none","both","horizontal","vertical"],description:"Resize behavior"}}},e={args:{placeholder:"Enter description...",rows:4}},r={args:{defaultValue:"This is a default value",rows:4}},o={args:{placeholder:"Enter description...",rows:4,error:!0}},a={args:{placeholder:"Fixed size textarea",rows:4,resize:"none"}},s={args:{placeholder:"Enter a longer description...",rows:8}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter description...",
    rows: 4
  }
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "This is a default value",
    rows: 4
  }
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter description...",
    rows: 4,
    error: true
  }
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Fixed size textarea",
    rows: 4,
    resize: "none"
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: "Enter a longer description...",
    rows: 8
  }
}`,...s.parameters?.docs?.source}}};const p=["Primary","WithDefaultValue","WithError","NoResize","LargeTextarea"];export{s as LargeTextarea,a as NoResize,e as Primary,r as WithDefaultValue,o as WithError,p as __namedExportsOrder,i as default};
