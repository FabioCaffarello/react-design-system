var V=Object.defineProperty,R=Object.defineProperties;var X=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var B=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable;var j=(i,c,n)=>c in i?V(i,c,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[c]=n,t=(i,c)=>{for(var n in c||(c={}))B.call(c,n)&&j(i,n,c[n]);if(b)for(var n of b(c))G.call(c,n)&&j(i,n,c[n]);return i},a=(i,c)=>R(i,X(c));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{g as r}from"./colors-BnDqA8Th.js";import{g as J}from"./spacing-Bf5iY5pu.js";import{g as N}from"./radius-CrNLhUJa.js";import{C as K}from"./circle-check-DcBi3U0v.js";import{c as v}from"./createLucideIcon-DQdFte_Y.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],ee=v("circle-check-big",Z);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],se=v("circle-x",te);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]],ae=v("package",ie);/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]],ce=v("truck",re);function W({items:i,orientation:c="vertical",className:n=""}){return c==="horizontal"?e.jsx("div",{className:`flex items-start ${n}`,children:i.map((s,l)=>{const o=s.status||(l===0?"active":l<i.findIndex(f=>f.status==="active")?"completed":"default"),y=l===i.length-1;return e.jsx("div",{className:"flex items-start flex-1",children:e.jsxs("div",{className:"flex flex-col items-center flex-1",children:[e.jsx("div",{className:`
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  ${N("full")}
                  border-2
                  ${o==="completed"?`${r("success","DEFAULT","bg")} ${r("success","DEFAULT","border")} text-white`:o==="active"?`${r("primary","DEFAULT","bg")} ${r("primary","DEFAULT","border")} text-white`:o==="error"?`${r("error","DEFAULT","bg")} ${r("error","DEFAULT","border")} text-white`:"bg-white border-gray-300 text-gray-400"}
                `,children:s.icon||(o==="completed"?"✓":l+1)}),!y&&e.jsx("div",{className:`
                      w-full
                      h-0.5
                      mt-2
                      ${o==="completed"?r("success","DEFAULT","bg"):"bg-gray-300"}
                    `}),e.jsxs("div",{className:`mt-4 text-center ${J("base","px")}`,children:[s.timestamp&&e.jsx("p",{className:"text-xs text-gray-500 mb-1",children:s.timestamp}),e.jsx("h3",{className:"text-sm font-semibold text-gray-900",children:s.title}),s.description&&e.jsx("p",{className:"text-xs text-gray-600 mt-1",children:s.description}),s.content&&e.jsx("div",{className:"mt-2",children:s.content})]})]})},s.id)})}):e.jsx("div",{className:`space-y-0 ${n}`,children:i.map((s,l)=>{const o=s.status||(l===0?"active":l<i.findIndex(f=>f.status==="active")?"completed":"default"),y=l===i.length-1;return e.jsxs("div",{className:"flex items-start gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("div",{className:`
                flex
                items-center
                justify-center
                w-10
                h-10
                ${N("full")}
                border-2
                ${o==="completed"?`${r("success","DEFAULT","bg")} ${r("success","DEFAULT","border")} text-white`:o==="active"?`${r("primary","DEFAULT","bg")} ${r("primary","DEFAULT","border")} text-white`:o==="error"?`${r("error","DEFAULT","bg")} ${r("error","DEFAULT","border")} text-white`:"bg-white border-gray-300 text-gray-400"}
              `,children:s.icon||(o==="completed"?"✓":l+1)}),!y&&e.jsx("div",{className:`
                    w-0.5
                    flex-1
                    min-h-[60px]
                    mt-2
                    ${o==="completed"?r("success","DEFAULT","bg"):"bg-gray-300"}
                  `})]}),e.jsxs("div",{className:"flex-1 pb-8",children:[s.timestamp&&e.jsx("p",{className:"text-xs text-gray-500 mb-1",children:s.timestamp}),e.jsx("h3",{className:`
                text-base
                font-semibold
                ${o==="active"?r("primary","DEFAULT","text"):"text-gray-900"}
              `,children:s.title}),s.description&&e.jsx("p",{className:"text-sm text-gray-600 mt-1",children:s.description}),s.content&&e.jsx("div",{className:"mt-3",children:s.content})]})]},s.id)})})}W.__docgenInfo={description:`Timeline Component

A timeline component for displaying events in chronological order.
Supports horizontal and vertical orientations.
Follows Atomic Design principles as an Organism component.

@example
\`\`\`tsx
<Timeline
  items={[
    { id: '1', title: 'Event 1', description: 'Description 1', timestamp: '2024-01-01' },
    { id: '2', title: 'Event 2', description: 'Description 2', timestamp: '2024-01-02' },
  ]}
/>
\`\`\``,methods:[],displayName:"Timeline",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"TimelineItem"}],raw:"TimelineItem[]"},description:""},orientation:{required:!1,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:"",defaultValue:{value:"'vertical'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const xe={title:"Organisms/Timeline",component:W,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{orientation:{control:"select",options:["horizontal","vertical"]}}},H=[{id:"1",title:"Order Placed",description:"Your order has been placed successfully",timestamp:"2024-01-15 10:30 AM",status:"completed"},{id:"2",title:"Processing",description:"Your order is being processed",timestamp:"2024-01-15 11:00 AM",status:"active"},{id:"3",title:"Shipped",description:"Your order has been shipped",timestamp:"2024-01-16",status:"default"},{id:"4",title:"Delivered",description:"Your order has been delivered",timestamp:"2024-01-18",status:"default"}],d={args:{items:H}},m={args:{items:H,orientation:"horizontal"}},p={args:{items:[{id:"1",title:"Order Placed",description:"Your order has been placed",timestamp:"2024-01-15",icon:e.jsx(K,{className:"h-5 w-5"}),status:"completed"},{id:"2",title:"Processing",description:"Your order is being processed",timestamp:"2024-01-16",icon:e.jsx(ae,{className:"h-5 w-5"}),status:"active"},{id:"3",title:"Shipped",description:"Your order has been shipped",timestamp:"2024-01-17",icon:e.jsx(ce,{className:"h-5 w-5"}),status:"default"},{id:"4",title:"Delivered",description:"Your order has been delivered",timestamp:"2024-01-18",icon:e.jsx(ee,{className:"h-5 w-5"}),status:"default"}]}},u={args:{items:[{id:"1",title:"Project Started",description:"Initial project setup completed",timestamp:"2024-01-01",status:"completed",content:e.jsx("div",{className:"mt-2 p-3 bg-gray-50 rounded-md",children:e.jsx("p",{className:"text-sm text-gray-700",children:"Repository created, initial dependencies installed, and project structure established."})})},{id:"2",title:"Design Phase",description:"UI/UX design completed",timestamp:"2024-01-15",status:"active",content:e.jsx("div",{className:"mt-2 p-3 bg-blue-50 rounded-md",children:e.jsx("p",{className:"text-sm text-blue-700",children:"Design mockups approved, component library created, and style guide finalized."})})},{id:"3",title:"Development",description:"Core features in development",timestamp:"2024-02-01",status:"default"}]}},h={args:{items:[{id:"1",title:"Step 1",description:"Completed successfully",timestamp:"2024-01-01",status:"completed"},{id:"2",title:"Step 2",description:"Failed with error",timestamp:"2024-01-02",status:"error",icon:e.jsx(se,{className:"h-5 w-5"})},{id:"3",title:"Step 3",description:"Pending",timestamp:"2024-01-03",status:"default"}]}},g={args:{items:[{id:"1",title:"Event 1"},{id:"2",title:"Event 2"},{id:"3",title:"Event 3"}]}},x={args:{items:[{id:"1",title:"Milestone 1",description:"First major milestone achieved",timestamp:"Q1 2024",status:"completed",content:e.jsx("div",{className:"mt-3 space-y-2",children:e.jsxs("ul",{className:"list-disc list-inside text-sm text-gray-600 space-y-1",children:[e.jsx("li",{children:"Feature A implemented"}),e.jsx("li",{children:"Feature B implemented"}),e.jsx("li",{children:"Testing completed"})]})})},{id:"2",title:"Milestone 2",description:"Second major milestone in progress",timestamp:"Q2 2024",status:"active",content:e.jsx("div",{className:"mt-3 space-y-2",children:e.jsxs("ul",{className:"list-disc list-inside text-sm text-gray-600 space-y-1",children:[e.jsx("li",{children:"Feature C in development"}),e.jsx("li",{children:"Feature D planned"})]})})},{id:"3",title:"Milestone 3",description:"Third major milestone planned",timestamp:"Q3 2024",status:"default"}]}};var T,w,D;d.parameters=a(t({},d.parameters),{docs:a(t({},(T=d.parameters)==null?void 0:T.docs),{source:t({originalSource:`{
  args: {
    items: basicItems
  }
}`},(D=(w=d.parameters)==null?void 0:w.docs)==null?void 0:D.source)})});var F,k,E;m.parameters=a(t({},m.parameters),{docs:a(t({},(F=m.parameters)==null?void 0:F.docs),{source:t({originalSource:`{
  args: {
    items: basicItems,
    orientation: 'horizontal'
  }
}`},(E=(k=m.parameters)==null?void 0:k.docs)==null?void 0:E.source)})});var A,C,$;p.parameters=a(t({},p.parameters),{docs:a(t({},(A=p.parameters)==null?void 0:A.docs),{source:t({originalSource:`{
  args: {
    items: [{
      id: '1',
      title: 'Order Placed',
      description: 'Your order has been placed',
      timestamp: '2024-01-15',
      icon: <CheckCircle2 className="h-5 w-5" />,
      status: 'completed'
    }, {
      id: '2',
      title: 'Processing',
      description: 'Your order is being processed',
      timestamp: '2024-01-16',
      icon: <Package className="h-5 w-5" />,
      status: 'active'
    }, {
      id: '3',
      title: 'Shipped',
      description: 'Your order has been shipped',
      timestamp: '2024-01-17',
      icon: <Truck className="h-5 w-5" />,
      status: 'default'
    }, {
      id: '4',
      title: 'Delivered',
      description: 'Your order has been delivered',
      timestamp: '2024-01-18',
      icon: <CheckCircle className="h-5 w-5" />,
      status: 'default'
    }]
  }
}`},($=(C=p.parameters)==null?void 0:C.docs)==null?void 0:$.source)})});var S,L,U;u.parameters=a(t({},u.parameters),{docs:a(t({},(S=u.parameters)==null?void 0:S.docs),{source:t({originalSource:`{
  args: {
    items: [{
      id: '1',
      title: 'Project Started',
      description: 'Initial project setup completed',
      timestamp: '2024-01-01',
      status: 'completed',
      content: <div className="mt-2 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              Repository created, initial dependencies installed, and project structure established.
            </p>
          </div>
    }, {
      id: '2',
      title: 'Design Phase',
      description: 'UI/UX design completed',
      timestamp: '2024-01-15',
      status: 'active',
      content: <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Design mockups approved, component library created, and style guide finalized.
            </p>
          </div>
    }, {
      id: '3',
      title: 'Development',
      description: 'Core features in development',
      timestamp: '2024-02-01',
      status: 'default'
    }]
  }
}`},(U=(L=u.parameters)==null?void 0:L.docs)==null?void 0:U.source)})});var z,I,M;h.parameters=a(t({},h.parameters),{docs:a(t({},(z=h.parameters)==null?void 0:z.docs),{source:t({originalSource:`{
  args: {
    items: [{
      id: '1',
      title: 'Step 1',
      description: 'Completed successfully',
      timestamp: '2024-01-01',
      status: 'completed'
    }, {
      id: '2',
      title: 'Step 2',
      description: 'Failed with error',
      timestamp: '2024-01-02',
      status: 'error',
      icon: <XCircle className="h-5 w-5" />
    }, {
      id: '3',
      title: 'Step 3',
      description: 'Pending',
      timestamp: '2024-01-03',
      status: 'default'
    }]
  }
}`},(M=(I=h.parameters)==null?void 0:I.docs)==null?void 0:M.source)})});var P,Y,_;g.parameters=a(t({},g.parameters),{docs:a(t({},(P=g.parameters)==null?void 0:P.docs),{source:t({originalSource:`{
  args: {
    items: [{
      id: '1',
      title: 'Event 1'
    }, {
      id: '2',
      title: 'Event 2'
    }, {
      id: '3',
      title: 'Event 3'
    }]
  }
}`},(_=(Y=g.parameters)==null?void 0:Y.docs)==null?void 0:_.source)})});var q,O,Q;x.parameters=a(t({},x.parameters),{docs:a(t({},(q=x.parameters)==null?void 0:q.docs),{source:t({originalSource:`{
  args: {
    items: [{
      id: '1',
      title: 'Milestone 1',
      description: 'First major milestone achieved',
      timestamp: 'Q1 2024',
      status: 'completed',
      content: <div className="mt-3 space-y-2">
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Feature A implemented</li>
              <li>Feature B implemented</li>
              <li>Testing completed</li>
            </ul>
          </div>
    }, {
      id: '2',
      title: 'Milestone 2',
      description: 'Second major milestone in progress',
      timestamp: 'Q2 2024',
      status: 'active',
      content: <div className="mt-3 space-y-2">
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Feature C in development</li>
              <li>Feature D planned</li>
            </ul>
          </div>
    }, {
      id: '3',
      title: 'Milestone 3',
      description: 'Third major milestone planned',
      timestamp: 'Q3 2024',
      status: 'default'
    }]
  }
}`},(Q=(O=x.parameters)==null?void 0:O.docs)==null?void 0:Q.source)})});const ve=["Default","Horizontal","WithIcons","WithContent","WithErrors","Simple","LongContent"];export{d as Default,m as Horizontal,x as LongContent,g as Simple,u as WithContent,h as WithErrors,p as WithIcons,ve as __namedExportsOrder,xe as default};
