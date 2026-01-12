var q=Object.defineProperty,z=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var g=Object.getOwnPropertySymbols;var J=Object.prototype.hasOwnProperty,M=Object.prototype.propertyIsEnumerable;var b=(n,e,r)=>e in n?q(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r,o=(n,e)=>{for(var r in e||(e={}))J.call(e,r)&&b(n,r,e[r]);if(g)for(var r of g(e))M.call(e,r)&&b(n,r,e[r]);return n},t=(n,e)=>z(n,G(e));import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{T as N}from"./Tooltip-DOeWFYwV.js";import{B as a}from"./Button-CioV4BCG.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";import"./Spinner-zwBmS9q3.js";const to={title:"Atoms/Tooltip",component:N,parameters:{layout:"centered",docs:{description:{component:"A tooltip component that displays additional information on hover or focus. Supports keyboard navigation and includes proper ARIA attributes. Tooltips appear immediately on focus (no delay) for better keyboard accessibility."}}},tags:["autodocs"],argTypes:{position:{control:"select",options:["top","bottom","left","right"],description:"Position of the tooltip relative to the trigger element"},delay:{control:"number",description:"Delay in milliseconds before showing tooltip on hover (not applied on focus)"},"aria-label":{control:"text",description:"Accessible label for screen readers"}}},i={args:{content:"This is a tooltip",children:s.jsx(a,{children:"Hover me"})}},c={args:{content:"Tooltip on top",children:s.jsx(a,{children:"Hover me"}),position:"top"}},l={args:{content:"Tooltip on bottom",children:s.jsx(a,{children:"Hover me"}),position:"bottom"}},p={args:{content:"Tooltip on left",children:s.jsx(a,{children:"Hover me"}),position:"left"}},d={args:{content:"Tooltip on right",children:s.jsx(a,{children:"Hover me"}),position:"right"}},m={args:{content:"This tooltip has a 500ms delay",children:s.jsx(a,{children:"Hover me (wait 500ms)"}),delay:500}},u={args:{content:"Press Tab to focus and see tooltip immediately",children:s.jsx(a,{children:"Focus me with Tab"})},parameters:{docs:{description:{story:"Tab to focus the button. The tooltip appears immediately without delay for keyboard users."}}}},h={args:{content:"Additional information",children:s.jsx(a,{children:"Button with tooltip"}),"aria-label":"Button that shows additional information on hover"}};var f,y,T;i.parameters=t(o({},i.parameters),{docs:t(o({},(f=i.parameters)==null?void 0:f.docs),{source:o({originalSource:`{
  args: {
    content: "This is a tooltip",
    children: <Button>Hover me</Button>
  }
}`},(T=(y=i.parameters)==null?void 0:y.docs)==null?void 0:T.source)})});var B,v,x;c.parameters=t(o({},c.parameters),{docs:t(o({},(B=c.parameters)==null?void 0:B.docs),{source:o({originalSource:`{
  args: {
    content: "Tooltip on top",
    children: <Button>Hover me</Button>,
    position: "top"
  }
}`},(x=(v=c.parameters)==null?void 0:v.docs)==null?void 0:x.source)})});var H,w,A;l.parameters=t(o({},l.parameters),{docs:t(o({},(H=l.parameters)==null?void 0:H.docs),{source:o({originalSource:`{
  args: {
    content: "Tooltip on bottom",
    children: <Button>Hover me</Button>,
    position: "bottom"
  }
}`},(A=(w=l.parameters)==null?void 0:w.docs)==null?void 0:A.source)})});var j,S,D;p.parameters=t(o({},p.parameters),{docs:t(o({},(j=p.parameters)==null?void 0:j.docs),{source:o({originalSource:`{
  args: {
    content: "Tooltip on left",
    children: <Button>Hover me</Button>,
    position: "left"
  }
}`},(D=(S=p.parameters)==null?void 0:S.docs)==null?void 0:D.source)})});var k,L,R;d.parameters=t(o({},d.parameters),{docs:t(o({},(k=d.parameters)==null?void 0:k.docs),{source:o({originalSource:`{
  args: {
    content: "Tooltip on right",
    children: <Button>Hover me</Button>,
    position: "right"
  }
}`},(R=(L=d.parameters)==null?void 0:L.docs)==null?void 0:R.source)})});var W,P,C;m.parameters=t(o({},m.parameters),{docs:t(o({},(W=m.parameters)==null?void 0:W.docs),{source:o({originalSource:`{
  args: {
    content: "This tooltip has a 500ms delay",
    children: <Button>Hover me (wait 500ms)</Button>,
    delay: 500
  }
}`},(C=(P=m.parameters)==null?void 0:P.docs)==null?void 0:C.source)})});var E,F,K;u.parameters=t(o({},u.parameters),{docs:t(o({},(E=u.parameters)==null?void 0:E.docs),{source:o({originalSource:`{
  args: {
    content: "Press Tab to focus and see tooltip immediately",
    children: <Button>Focus me with Tab</Button>
  },
  parameters: {
    docs: {
      description: {
        story: "Tab to focus the button. The tooltip appears immediately without delay for keyboard users."
      }
    }
  }
}`},(K=(F=u.parameters)==null?void 0:F.docs)==null?void 0:K.source)})});var _,I,O;h.parameters=t(o({},h.parameters),{docs:t(o({},(_=h.parameters)==null?void 0:_.docs),{source:o({originalSource:`{
  args: {
    content: "Additional information",
    children: <Button>Button with tooltip</Button>,
    'aria-label': "Button that shows additional information on hover"
  }
}`},(O=(I=h.parameters)==null?void 0:I.docs)==null?void 0:O.source)})});const eo=["Default","Top","Bottom","Left","Right","WithCustomDelay","KeyboardAccessible","WithAriaLabel"];export{l as Bottom,i as Default,u as KeyboardAccessible,p as Left,d as Right,c as Top,h as WithAriaLabel,m as WithCustomDelay,eo as __namedExportsOrder,to as default};
