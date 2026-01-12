var A=Object.defineProperty,W=Object.defineProperties;var z=Object.getOwnPropertyDescriptors;var g=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var u=(o,r,p)=>r in o?A(o,r,{enumerable:!0,configurable:!0,writable:!0,value:p}):o[r]=p,t=(o,r)=>{for(var p in r||(r={}))D.call(r,p)&&u(o,p,r[p]);if(g)for(var p of g(r))I.call(r,p)&&u(o,p,r[p]);return o},n=(o,r)=>W(o,z(r));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as M}from"./iframe-38FCFUQv.js";import{P as i}from"./Popover-d74k1b_1.js";import{B as s}from"./Button-CioV4BCG.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./shadows-B52VkgOA.js";import"./z-index-DQdti7D9.js";import"./animations-BabstCnB.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./colors-BnDqA8Th.js";import"./Spinner-zwBmS9q3.js";const re={title:"Atoms/Popover",component:i,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{placement:{control:"select",options:["top","top-start","top-end","bottom","bottom-start","bottom-end","left","left-start","left-end","right","right-start","right-end"]}}},a={render:o=>e.jsx(i,n(t({},o),{trigger:e.jsx(s,{children:"Open Popover"}),children:e.jsx("p",{children:"This is popover content. It can contain any React elements."})}))},l={render:o=>e.jsx(i,n(t({},o),{trigger:e.jsx(s,{children:"Open Popover"}),title:"Popover Title",children:e.jsx("p",{children:"This popover has a title and close button."})})),args:{showCloseButton:!0}},c={render:()=>e.jsxs("div",{className:"flex flex-col items-center gap-8 p-16",children:[e.jsx(i,{trigger:e.jsx(s,{children:"Top"}),placement:"top",title:"Top Placement",children:e.jsx("p",{children:"Popover appears above the trigger"})}),e.jsxs("div",{className:"flex gap-8",children:[e.jsx(i,{trigger:e.jsx(s,{children:"Left"}),placement:"left",title:"Left Placement",children:e.jsx("p",{children:"Popover appears to the left"})}),e.jsx(i,{trigger:e.jsx(s,{children:"Right"}),placement:"right",title:"Right Placement",children:e.jsx("p",{children:"Popover appears to the right"})})]}),e.jsx(i,{trigger:e.jsx(s,{children:"Bottom"}),placement:"bottom",title:"Bottom Placement",children:e.jsx("p",{children:"Popover appears below the trigger"})})]})},m={render:()=>e.jsx(i,{trigger:e.jsx(s,{children:"Open Rich Popover"}),title:"Rich Content Example",showCloseButton:!0,children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm",children:"This popover contains rich content:"}),e.jsxs("ul",{className:"list-disc list-inside text-sm space-y-1",children:[e.jsx("li",{children:"Lists"}),e.jsx("li",{children:"Multiple paragraphs"}),e.jsx("li",{children:"Any React components"})]}),e.jsx("div",{className:"mt-4 pt-4 border-t border-gray-200",children:e.jsx(s,{size:"sm",variant:"primary",children:"Action Button"})})]})})},d={render:()=>{const[o,r]=M.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs(i,{trigger:e.jsx(s,{children:"Toggle Popover"}),open:o,onOpenChange:r,title:"Controlled Popover",showCloseButton:!0,children:[e.jsx("p",{children:"This popover is controlled by external state."}),e.jsxs("p",{className:"mt-2 text-sm text-gray-600",children:["Open: ",o?"Yes":"No"]})]}),e.jsx(s,{onClick:()=>r(!o),variant:"outline",children:"External Toggle"})]})}},h={render:()=>e.jsx(i,{trigger:e.jsx(s,{children:"Open"}),title:"No Close Button",showCloseButton:!1,closeOnClickOutside:!0,children:e.jsx("p",{children:"Click outside to close this popover."})})};var v,x,P;a.parameters=n(t({},a.parameters),{docs:n(t({},(v=a.parameters)==null?void 0:v.docs),{source:t({originalSource:`{
  render: args => <Popover {...args} trigger={<Button>Open Popover</Button>}>
      <p>This is popover content. It can contain any React elements.</p>
    </Popover>
}`},(P=(x=a.parameters)==null?void 0:x.docs)==null?void 0:P.source)})});var B,j,f;l.parameters=n(t({},l.parameters),{docs:n(t({},(B=l.parameters)==null?void 0:B.docs),{source:t({originalSource:`{
  render: args => <Popover {...args} trigger={<Button>Open Popover</Button>} title="Popover Title">
      <p>This popover has a title and close button.</p>
    </Popover>,
  args: {
    showCloseButton: true
  }
}`},(f=(j=l.parameters)==null?void 0:j.docs)==null?void 0:f.source)})});var C,O,T;c.parameters=n(t({},c.parameters),{docs:n(t({},(C=c.parameters)==null?void 0:C.docs),{source:t({originalSource:`{
  render: () => {
    return <div className="flex flex-col items-center gap-8 p-16">
        <Popover trigger={<Button>Top</Button>} placement="top" title="Top Placement">
          <p>Popover appears above the trigger</p>
        </Popover>
        <div className="flex gap-8">
          <Popover trigger={<Button>Left</Button>} placement="left" title="Left Placement">
            <p>Popover appears to the left</p>
          </Popover>
          <Popover trigger={<Button>Right</Button>} placement="right" title="Right Placement">
            <p>Popover appears to the right</p>
          </Popover>
        </div>
        <Popover trigger={<Button>Bottom</Button>} placement="bottom" title="Bottom Placement">
          <p>Popover appears below the trigger</p>
        </Popover>
      </div>;
  }
}`},(T=(O=c.parameters)==null?void 0:O.docs)==null?void 0:T.source)})});var y,N,b;m.parameters=n(t({},m.parameters),{docs:n(t({},(y=m.parameters)==null?void 0:y.docs),{source:t({originalSource:`{
  render: () => <Popover trigger={<Button>Open Rich Popover</Button>} title="Rich Content Example" showCloseButton>
      <div className="space-y-2">
        <p className="text-sm">This popover contains rich content:</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Lists</li>
          <li>Multiple paragraphs</li>
          <li>Any React components</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button size="sm" variant="primary">
            Action Button
          </Button>
        </div>
      </div>
    </Popover>
}`},(b=(N=m.parameters)==null?void 0:N.docs)==null?void 0:b.source)})});var R,w,S;d.parameters=n(t({},d.parameters),{docs:n(t({},(R=d.parameters)==null?void 0:R.docs),{source:t({originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <div className="space-y-4">
        <Popover trigger={<Button>Toggle Popover</Button>} open={open} onOpenChange={setOpen} title="Controlled Popover" showCloseButton>
          <p>This popover is controlled by external state.</p>
          <p className="mt-2 text-sm text-gray-600">Open: {open ? 'Yes' : 'No'}</p>
        </Popover>
        <Button onClick={() => setOpen(!open)} variant="outline">
          External Toggle
        </Button>
      </div>;
  }
}`},(S=(w=d.parameters)==null?void 0:w.docs)==null?void 0:S.source)})});var E,k,L;h.parameters=n(t({},h.parameters),{docs:n(t({},(E=h.parameters)==null?void 0:E.docs),{source:t({originalSource:`{
  render: () => <Popover trigger={<Button>Open</Button>} title="No Close Button" showCloseButton={false} closeOnClickOutside>
      <p>Click outside to close this popover.</p>
    </Popover>
}`},(L=(k=h.parameters)==null?void 0:k.docs)==null?void 0:L.source)})});const ne=["Default","WithTitle","Placements","RichContent","Controlled","WithoutCloseButton"];export{d as Controlled,a as Default,c as Placements,m as RichContent,l as WithTitle,h as WithoutCloseButton,ne as __namedExportsOrder,re as default};
