var B=Object.defineProperty,D=Object.defineProperties;var F=Object.getOwnPropertyDescriptors;var x=Object.getOwnPropertySymbols;var G=Object.prototype.hasOwnProperty,H=Object.prototype.propertyIsEnumerable;var h=(i,r,t)=>r in i?B(i,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[r]=t,e=(i,r)=>{for(var t in r||(r={}))G.call(r,t)&&h(i,t,r[t]);if(x)for(var t of x(r))H.call(r,t)&&h(i,t,r[t]);return i},a=(i,r)=>D(i,F(r));import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{S as u}from"./Skeleton-B_1RHiL2.js";const Q={title:"Atoms/Skeleton",component:u,parameters:{layout:"centered",docs:{description:{component:"A skeleton loader component for displaying loading states. Includes proper ARIA attributes (role='status', aria-busy='true') to indicate loading state to screen readers."}}},tags:["autodocs"],argTypes:{variant:{control:"select",options:["text","card","list","circle"],description:"Visual variant of the skeleton"},width:{control:"text",description:"Custom width (e.g., '200px', '50%')"},height:{control:"text",description:"Custom height (e.g., '20px', '100px')"},lines:{control:"number",description:"Number of lines for text variant"},"aria-label":{control:"text",description:"Accessible label describing what is loading"}}},n={args:{variant:"text"}},o={args:{variant:"text",lines:3}},c={args:{variant:"card"}},d={args:{variant:"list"}},l={args:{variant:"circle",width:"48px",height:"48px"}},m={args:{variant:"text",width:"200px",height:"20px"}},p={args:{variant:"card","aria-label":"Loading user profile card"},parameters:{docs:{description:{story:"Skeleton with custom aria-label for better screen reader experience."}}}},g={render:()=>s.jsxs("div",{className:"space-y-4",children:[s.jsxs("div",{children:[s.jsx("h3",{className:"text-sm font-medium mb-2",children:"Loading User List"}),s.jsx(u,{variant:"list","aria-label":"Loading user list"})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"text-sm font-medium mb-2",children:"Loading Content"}),s.jsx(u,{variant:"text",lines:3,"aria-label":"Loading article content"})]}),s.jsxs("div",{children:[s.jsx("h3",{className:"text-sm font-medium mb-2",children:"Loading Avatar"}),s.jsx(u,{variant:"circle",width:"48px",height:"48px","aria-label":"Loading user avatar"})]})]}),parameters:{docs:{description:{story:"Example of using multiple skeleton loaders together to show a loading state."}}}};var v,b,L;n.parameters=a(e({},n.parameters),{docs:a(e({},(v=n.parameters)==null?void 0:v.docs),{source:e({originalSource:`{
  args: {
    variant: "text"
  }
}`},(L=(b=n.parameters)==null?void 0:b.docs)==null?void 0:L.source)})});var S,f,w;o.parameters=a(e({},o.parameters),{docs:a(e({},(S=o.parameters)==null?void 0:S.docs),{source:e({originalSource:`{
  args: {
    variant: "text",
    lines: 3
  }
}`},(w=(f=o.parameters)==null?void 0:f.docs)==null?void 0:w.source)})});var j,k,y;c.parameters=a(e({},c.parameters),{docs:a(e({},(j=c.parameters)==null?void 0:j.docs),{source:e({originalSource:`{
  args: {
    variant: "card"
  }
}`},(y=(k=c.parameters)==null?void 0:k.docs)==null?void 0:y.source)})});var C,A,N;d.parameters=a(e({},d.parameters),{docs:a(e({},(C=d.parameters)==null?void 0:C.docs),{source:e({originalSource:`{
  args: {
    variant: "list"
  }
}`},(N=(A=d.parameters)==null?void 0:A.docs)==null?void 0:N.source)})});var T,E,z;l.parameters=a(e({},l.parameters),{docs:a(e({},(T=l.parameters)==null?void 0:T.docs),{source:e({originalSource:`{
  args: {
    variant: "circle",
    width: "48px",
    height: "48px"
  }
}`},(z=(E=l.parameters)==null?void 0:E.docs)==null?void 0:z.source)})});var I,M,R;m.parameters=a(e({},m.parameters),{docs:a(e({},(I=m.parameters)==null?void 0:I.docs),{source:e({originalSource:`{
  args: {
    variant: "text",
    width: "200px",
    height: "20px"
  }
}`},(R=(M=m.parameters)==null?void 0:M.docs)==null?void 0:R.source)})});var U,W,_;p.parameters=a(e({},p.parameters),{docs:a(e({},(U=p.parameters)==null?void 0:U.docs),{source:e({originalSource:`{
  args: {
    variant: "card",
    'aria-label': "Loading user profile card"
  },
  parameters: {
    docs: {
      description: {
        story: "Skeleton with custom aria-label for better screen reader experience."
      }
    }
  }
}`},(_=(W=p.parameters)==null?void 0:W.docs)==null?void 0:_.source)})});var O,V,q;g.parameters=a(e({},g.parameters),{docs:a(e({},(O=g.parameters)==null?void 0:O.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Loading User List</h3>
        <Skeleton variant="list" aria-label="Loading user list" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Loading Content</h3>
        <Skeleton variant="text" lines={3} aria-label="Loading article content" />
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Loading Avatar</h3>
        <Skeleton variant="circle" width="48px" height="48px" aria-label="Loading user avatar" />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: "Example of using multiple skeleton loaders together to show a loading state."
      }
    }
  }
}`},(q=(V=g.parameters)==null?void 0:V.docs)==null?void 0:q.source)})});const X=["Text","TextMultipleLines","Card","List","Circle","CustomSize","WithAriaLabel","LoadingStates"];export{c as Card,l as Circle,m as CustomSize,d as List,g as LoadingStates,n as Text,o as TextMultipleLines,p as WithAriaLabel,X as __namedExportsOrder,Q as default};
