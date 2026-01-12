var K=Object.defineProperty,_=Object.defineProperties;var O=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var q=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var S=(e,c,t)=>c in e?K(e,c,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[c]=t,s=(e,c)=>{for(var t in c||(c={}))q.call(c,t)&&S(e,t,c[t]);if(b)for(var t of b(c))B.call(c,t)&&S(e,t,c[t]);return e},r=(e,c)=>_(e,O(c));import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as o}from"./iframe-38FCFUQv.js";import{S as n}from"./Switch-BUQe_8mj.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";import"./animations-BabstCnB.js";const X={title:"Atoms/Switch",component:n,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{size:{control:"select",options:["sm","md","lg"]},checked:{control:"boolean"},disabled:{control:"boolean"},error:{control:"boolean"}}},i={render:e=>{const[c,t]=o.useState(e.checked||!1);return a.jsx(n,r(s({},e),{checked:c,onChange:h=>t(h.target.checked)}))},args:{checked:!1}},l={render:e=>{const[c,t]=o.useState(e.checked||!1);return a.jsx(n,r(s({},e),{checked:c,onChange:h=>t(h.target.checked)}))},args:{label:"Enable notifications",checked:!1}},k={render:e=>{const[c,t]=o.useState(e.checked||!1);return a.jsx(n,r(s({},e),{checked:c,onChange:h=>t(h.target.checked)}))},args:{label:"Enable notifications",description:"Receive email notifications about your account activity",checked:!1}},g={render:()=>{const[e,c]=o.useState(!1),[t,h]=o.useState(!1),[p,C]=o.useState(!1);return a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsx(n,{size:"sm",label:"Small",checked:e,onChange:d=>c(d.target.checked)}),a.jsx(n,{size:"md",label:"Medium",checked:t,onChange:d=>h(d.target.checked)}),a.jsx(n,{size:"lg",label:"Large",checked:p,onChange:d=>C(d.target.checked)})]})}},u={render:()=>{const[e,c]=o.useState(!0),[t,h]=o.useState(!1),[p,C]=o.useState(!1);return a.jsxs("div",{className:"flex flex-col gap-4",children:[a.jsx(n,{label:"Checked",checked:e,onChange:d=>c(d.target.checked)}),a.jsx(n,{label:"Unchecked",checked:t,onChange:d=>h(d.target.checked)}),a.jsx(n,{label:"Error state",checked:p,onChange:d=>C(d.target.checked),error:!0}),a.jsx(n,{label:"Disabled (checked)",checked:!0,onChange:()=>{},disabled:!0}),a.jsx(n,{label:"Disabled (unchecked)",checked:!1,onChange:()=>{},disabled:!0})]})}},m={render:()=>{const[e,c]=o.useState(!1);return a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{children:[a.jsx("p",{className:"text-sm text-gray-600 mb-2",children:"Switch with proper ARIA attributes and keyboard navigation:"}),a.jsx(n,{label:"Accessible switch",description:"This switch supports keyboard navigation (Enter/Space)",checked:e,onChange:t=>c(t.target.checked)})]}),a.jsxs("div",{className:"text-xs text-gray-500",children:[a.jsx("p",{children:"Keyboard shortcuts:"}),a.jsxs("ul",{className:"list-disc list-inside mt-1",children:[a.jsx("li",{children:"Enter or Space: Toggle switch"}),a.jsx("li",{children:"Tab: Navigate to switch"})]})]})]})}};var f,x,w;i.parameters=r(s({},i.parameters),{docs:r(s({},(f=i.parameters)==null?void 0:f.docs),{source:s({originalSource:`{
  render: args => {
    const [checked, setChecked] = useState(args.checked || false);
    return <Switch {...args} checked={checked} onChange={e => setChecked(e.target.checked)} />;
  },
  args: {
    checked: false
  }
}`},(w=(x=i.parameters)==null?void 0:x.docs)==null?void 0:w.source)})});var v,j,y;l.parameters=r(s({},l.parameters),{docs:r(s({},(v=l.parameters)==null?void 0:v.docs),{source:s({originalSource:`{
  render: args => {
    const [checked, setChecked] = useState(args.checked || false);
    return <Switch {...args} checked={checked} onChange={e => setChecked(e.target.checked)} />;
  },
  args: {
    label: 'Enable notifications',
    checked: false
  }
}`},(y=(j=l.parameters)==null?void 0:j.docs)==null?void 0:y.source)})});var E,N,z;k.parameters=r(s({},k.parameters),{docs:r(s({},(E=k.parameters)==null?void 0:E.docs),{source:s({originalSource:`{
  render: args => {
    const [checked, setChecked] = useState(args.checked || false);
    return <Switch {...args} checked={checked} onChange={e => setChecked(e.target.checked)} />;
  },
  args: {
    label: 'Enable notifications',
    description: 'Receive email notifications about your account activity',
    checked: false
  }
}`},(z=(N=k.parameters)==null?void 0:N.docs)==null?void 0:z.source)})});var A,D,L;g.parameters=r(s({},g.parameters),{docs:r(s({},(A=g.parameters)==null?void 0:A.docs),{source:s({originalSource:`{
  render: () => {
    const [smChecked, setSmChecked] = useState(false);
    const [mdChecked, setMdChecked] = useState(false);
    const [lgChecked, setLgChecked] = useState(false);
    return <div className="flex flex-col gap-4">
        <Switch size="sm" label="Small" checked={smChecked} onChange={e => setSmChecked(e.target.checked)} />
        <Switch size="md" label="Medium" checked={mdChecked} onChange={e => setMdChecked(e.target.checked)} />
        <Switch size="lg" label="Large" checked={lgChecked} onChange={e => setLgChecked(e.target.checked)} />
      </div>;
  }
}`},(L=(D=g.parameters)==null?void 0:D.docs)==null?void 0:L.source)})});var T,M,R;u.parameters=r(s({},u.parameters),{docs:r(s({},(T=u.parameters)==null?void 0:T.docs),{source:s({originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(true);
    const [unchecked, setUnchecked] = useState(false);
    const [errorChecked, setErrorChecked] = useState(false);
    return <div className="flex flex-col gap-4">
        <Switch label="Checked" checked={checked} onChange={e => setChecked(e.target.checked)} />
        <Switch label="Unchecked" checked={unchecked} onChange={e => setUnchecked(e.target.checked)} />
        <Switch label="Error state" checked={errorChecked} onChange={e => setErrorChecked(e.target.checked)} error />
        <Switch label="Disabled (checked)" checked={true} onChange={() => {}} disabled />
        <Switch label="Disabled (unchecked)" checked={false} onChange={() => {}} disabled />
      </div>;
  }
}`},(R=(M=u.parameters)==null?void 0:M.docs)==null?void 0:R.source)})});var U,W,I;m.parameters=r(s({},m.parameters),{docs:r(s({},(U=m.parameters)==null?void 0:U.docs),{source:s({originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Switch with proper ARIA attributes and keyboard navigation:
          </p>
          <Switch label="Accessible switch" description="This switch supports keyboard navigation (Enter/Space)" checked={checked} onChange={e => setChecked(e.target.checked)} />
        </div>
        <div className="text-xs text-gray-500">
          <p>Keyboard shortcuts:</p>
          <ul className="list-disc list-inside mt-1">
            <li>Enter or Space: Toggle switch</li>
            <li>Tab: Navigate to switch</li>
          </ul>
        </div>
      </div>;
  }
}`},(I=(W=m.parameters)==null?void 0:W.docs)==null?void 0:I.source)})});const Y=["Default","WithLabel","WithDescription","Sizes","States","Accessibility"];export{m as Accessibility,i as Default,g as Sizes,u as States,k as WithDescription,l as WithLabel,Y as __namedExportsOrder,X as default};
