var W=Object.defineProperty,A=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var u=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,$=Object.prototype.propertyIsEnumerable;var h=(n,i,a)=>i in n?W(n,i,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[i]=a,s=(n,i)=>{for(var a in i||(i={}))L.call(i,a)&&h(n,a,i[a]);if(u)for(var a of u(i))$.call(i,a)&&h(n,a,i[a]);return n},t=(n,i)=>A(n,E(i));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{A as k}from"./Accordion-53UVFcFP.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./animations-BabstCnB.js";import"./typography-BGNr2Ph4.js";import"./createLucideIcon-DQdFte_Y.js";const Q={title:"Atoms/Accordion",component:k,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{type:{control:"select",options:["single","multiple"]}}},p=[{id:"1",title:"What is this?",content:"This is a frequently asked question with a detailed answer that explains the concept clearly."},{id:"2",title:"How does it work?",content:"The system works by processing input data through a series of algorithms and returning the results."},{id:"3",title:"Is it free?",content:"Yes, the basic version is free. Premium features are available with a subscription."}],r={args:{items:p,type:"single"}},o={args:{items:p,type:"multiple"}},l={args:{items:p,type:"single",defaultOpen:"1"}},c={args:{items:[...p,{id:"4",title:"Disabled Item",content:"This item is disabled",disabled:!0}],type:"single"}},d={args:{items:[{id:"1",title:"Features",content:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Key Features:"}),e.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[e.jsx("li",{children:"Feature 1: Description of feature 1"}),e.jsx("li",{children:"Feature 2: Description of feature 2"}),e.jsx("li",{children:"Feature 3: Description of feature 3"})]})]})},{id:"2",title:"Pricing",content:e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm",children:"Our pricing is simple and transparent:"}),e.jsxs("div",{className:"space-y-1 text-sm",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Basic Plan"}),e.jsx("span",{className:"font-semibold",children:"$9/month"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Pro Plan"}),e.jsx("span",{className:"font-semibold",children:"$29/month"})]})]})]})}],type:"single"}},m={args:{items:[{id:"1",title:"Long Content Example",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("p",{children:"This is a longer content example to demonstrate how the accordion handles substantial amounts of text and content. The accordion should expand smoothly and provide a good user experience even with lengthy content."}),e.jsx("p",{children:"You can include multiple paragraphs, lists, images, or any other React components within the accordion content area. The component will handle the animation and layout automatically."}),e.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[e.jsx("li",{children:"First item in a list"}),e.jsx("li",{children:"Second item in a list"}),e.jsx("li",{children:"Third item in a list"})]})]})}],type:"single"}};var g,x,y;r.parameters=t(s({},r.parameters),{docs:t(s({},(g=r.parameters)==null?void 0:g.docs),{source:s({originalSource:`{
  args: {
    items: basicItems,
    type: 'single'
  }
}`},(y=(x=r.parameters)==null?void 0:x.docs)==null?void 0:y.source)})});var f,b,j;o.parameters=t(s({},o.parameters),{docs:t(s({},(f=o.parameters)==null?void 0:f.docs),{source:s({originalSource:`{
  args: {
    items: basicItems,
    type: 'multiple'
  }
}`},(j=(b=o.parameters)==null?void 0:b.docs)==null?void 0:j.source)})});var v,N,w;l.parameters=t(s({},l.parameters),{docs:t(s({},(v=l.parameters)==null?void 0:v.docs),{source:s({originalSource:`{
  args: {
    items: basicItems,
    type: 'single',
    defaultOpen: '1'
  }
}`},(w=(N=l.parameters)==null?void 0:N.docs)==null?void 0:w.source)})});var D,T,F;c.parameters=t(s({},c.parameters),{docs:t(s({},(D=c.parameters)==null?void 0:D.docs),{source:s({originalSource:`{
  args: {
    items: [...basicItems, {
      id: '4',
      title: 'Disabled Item',
      content: 'This item is disabled',
      disabled: true
    }],
    type: 'single'
  }
}`},(F=(T=c.parameters)==null?void 0:T.docs)==null?void 0:F.source)})});var I,P,S;d.parameters=t(s({},d.parameters),{docs:t(s({},(I=d.parameters)==null?void 0:I.docs),{source:s({originalSource:`{
  args: {
    items: [{
      id: '1',
      title: 'Features',
      content: <div className="space-y-2">
            <h4 className="font-semibold">Key Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Feature 1: Description of feature 1</li>
              <li>Feature 2: Description of feature 2</li>
              <li>Feature 3: Description of feature 3</li>
            </ul>
          </div>
    }, {
      id: '2',
      title: 'Pricing',
      content: <div className="space-y-2">
            <p className="text-sm">Our pricing is simple and transparent:</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Basic Plan</span>
                <span className="font-semibold">$9/month</span>
              </div>
              <div className="flex justify-between">
                <span>Pro Plan</span>
                <span className="font-semibold">$29/month</span>
              </div>
            </div>
          </div>
    }],
    type: 'single'
  }
}`},(S=(P=d.parameters)==null?void 0:P.docs)==null?void 0:S.source)})});var O,C,R;m.parameters=t(s({},m.parameters),{docs:t(s({},(O=m.parameters)==null?void 0:O.docs),{source:s({originalSource:`{
  args: {
    items: [{
      id: '1',
      title: 'Long Content Example',
      content: <div className="space-y-4">
            <p>
              This is a longer content example to demonstrate how the accordion handles
              substantial amounts of text and content. The accordion should expand smoothly
              and provide a good user experience even with lengthy content.
            </p>
            <p>
              You can include multiple paragraphs, lists, images, or any other React components
              within the accordion content area. The component will handle the animation and
              layout automatically.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>First item in a list</li>
              <li>Second item in a list</li>
              <li>Third item in a list</li>
            </ul>
          </div>
    }],
    type: 'single'
  }
}`},(R=(C=m.parameters)==null?void 0:C.docs)==null?void 0:R.source)})});const U=["Default","Multiple","WithDefaultOpen","WithDisabledItems","RichContent","LongContent"];export{r as Default,m as LongContent,o as Multiple,d as RichContent,l as WithDefaultOpen,c as WithDisabledItems,U as __namedExportsOrder,Q as default};
