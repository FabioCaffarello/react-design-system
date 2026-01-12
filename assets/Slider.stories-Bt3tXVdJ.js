var H=Object.defineProperty,I=Object.defineProperties;var J=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var K=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var x=(e,a,t)=>a in e?H(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t,s=(e,a)=>{for(var t in a||(a={}))K.call(a,t)&&x(e,t,a[t]);if(v)for(var t of v(a))Q.call(a,t)&&x(e,t,a[t]);return e},l=(e,a)=>I(e,J(a));import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{r as n}from"./iframe-38FCFUQv.js";import{S as u}from"./Slider-DxbBfhkb.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";import"./animations-BabstCnB.js";const re={title:"Atoms/Slider",component:u,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{variant:{control:"select",options:["single","range"]},size:{control:"select",options:["sm","md","lg"]},min:{control:"number"},max:{control:"number"},step:{control:"number"}}},o={render:e=>{const[a,t]=n.useState(e.defaultValue||50);return r.jsxs("div",{className:"w-64",children:[r.jsx(u,l(s({},e),{value:a,onChange:t})),r.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["Value: ",a]})]})},args:{min:0,max:100,step:1,defaultValue:50}},d={render:e=>{const[a,t]=n.useState(e.defaultValue||50);return r.jsx("div",{className:"w-64",children:r.jsx(u,l(s({},e),{value:a,onChange:t}))})},args:{label:"Volume",min:0,max:100,defaultValue:50,showValue:!0}},m={render:e=>{const[a,t]=n.useState(e.defaultValue||[20,80]);return r.jsxs("div",{className:"w-64",children:[r.jsx(u,l(s({},e),{value:a,onChange:t})),r.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["Range: ",a[0]," - ",a[1]]})]})},args:{variant:"range",min:0,max:100,defaultValue:[20,80],showValue:!0}},i={render:()=>{const[e,a]=n.useState(50),[t,B]=n.useState(50),[F,G]=n.useState(50);return r.jsxs("div",{className:"w-64 space-y-6",children:[r.jsx("div",{children:r.jsx(u,{size:"sm",label:"Small",value:e,onChange:a,showValue:!0})}),r.jsx("div",{children:r.jsx(u,{size:"md",label:"Medium",value:t,onChange:B,showValue:!0})}),r.jsx("div",{children:r.jsx(u,{size:"lg",label:"Large",value:F,onChange:G,showValue:!0})})]})}},c={render:e=>{const[a,t]=n.useState(e.defaultValue||50);return r.jsx("div",{className:"w-64",children:r.jsx(u,l(s({},e),{value:a,onChange:t}))})},args:{label:"Temperature",min:0,max:100,step:10,defaultValue:50,marks:[0,25,50,75,100],showValue:!0}},g={render:e=>{const[a,t]=n.useState(e.defaultValue||2);return r.jsxs("div",{className:"w-64",children:[r.jsx(u,l(s({},e),{value:a,onChange:t})),r.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["Value: ",a]})]})},args:{label:"Rating",min:0,max:5,step:.5,defaultValue:2.5,showValue:!0}},V={render:()=>r.jsxs("div",{className:"w-64 space-y-4",children:[r.jsx(u,{label:"Disabled",defaultValue:50,disabled:!0}),r.jsx(u,{label:"Disabled Range",variant:"range",defaultValue:[20,80],disabled:!0})]})},p={render:()=>{const[e,a]=n.useState([1e3,5e3]);return r.jsxs("div",{className:"w-64",children:[r.jsx(u,{label:"Price Range",variant:"range",min:0,max:1e4,step:100,value:e,onChange:a,showValue:!0}),r.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["$",e[0].toLocaleString()," - $",e[1].toLocaleString()]})]})}};var h,S,b;o.parameters=l(s({},o.parameters),{docs:l(s({},(h=o.parameters)==null?void 0:h.docs),{source:s({originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.defaultValue || 50);
    return <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
        <p className="mt-4 text-sm text-gray-600">Value: {value}</p>
      </div>;
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 50
  }
}`},(b=(S=o.parameters)==null?void 0:S.docs)==null?void 0:b.source)})});var w,f,j;d.parameters=l(s({},d.parameters),{docs:l(s({},(w=d.parameters)==null?void 0:w.docs),{source:s({originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.defaultValue || 50);
    return <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
      </div>;
  },
  args: {
    label: 'Volume',
    min: 0,
    max: 100,
    defaultValue: 50,
    showValue: true
  }
}`},(j=(f=d.parameters)==null?void 0:f.docs)==null?void 0:j.source)})});var N,C,y;m.parameters=l(s({},m.parameters),{docs:l(s({},(N=m.parameters)==null?void 0:N.docs),{source:s({originalSource:`{
  render: args => {
    const [value, setValue] = useState<[number, number]>(args.defaultValue as [number, number] || [20, 80]);
    return <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
        <p className="mt-4 text-sm text-gray-600">
          Range: {value[0]} - {value[1]}
        </p>
      </div>;
  },
  args: {
    variant: 'range',
    min: 0,
    max: 100,
    defaultValue: [20, 80],
    showValue: true
  }
}`},(y=(C=m.parameters)==null?void 0:C.docs)==null?void 0:y.source)})});var R,L,z;i.parameters=l(s({},i.parameters),{docs:l(s({},(R=i.parameters)==null?void 0:R.docs),{source:s({originalSource:`{
  render: () => {
    const [smValue, setSmValue] = useState(50);
    const [mdValue, setMdValue] = useState(50);
    const [lgValue, setLgValue] = useState(50);
    return <div className="w-64 space-y-6">
        <div>
          <Slider size="sm" label="Small" value={smValue} onChange={setSmValue} showValue />
        </div>
        <div>
          <Slider size="md" label="Medium" value={mdValue} onChange={setMdValue} showValue />
        </div>
        <div>
          <Slider size="lg" label="Large" value={lgValue} onChange={setLgValue} showValue />
        </div>
      </div>;
  }
}`},(z=(L=i.parameters)==null?void 0:L.docs)==null?void 0:z.source)})});var D,M,W;c.parameters=l(s({},c.parameters),{docs:l(s({},(D=c.parameters)==null?void 0:D.docs),{source:s({originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.defaultValue || 50);
    return <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
      </div>;
  },
  args: {
    label: 'Temperature',
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 50,
    marks: [0, 25, 50, 75, 100],
    showValue: true
  }
}`},(W=(M=c.parameters)==null?void 0:M.docs)==null?void 0:W.source)})});var k,$,E;g.parameters=l(s({},g.parameters),{docs:l(s({},(k=g.parameters)==null?void 0:k.docs),{source:s({originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.defaultValue || 2);
    return <div className="w-64">
        <Slider {...args} value={value} onChange={setValue} />
        <p className="mt-4 text-sm text-gray-600">Value: {value}</p>
      </div>;
  },
  args: {
    label: 'Rating',
    min: 0,
    max: 5,
    step: 0.5,
    defaultValue: 2.5,
    showValue: true
  }
}`},(E=($=g.parameters)==null?void 0:$.docs)==null?void 0:E.source)})});var T,P,_;V.parameters=l(s({},V.parameters),{docs:l(s({},(T=V.parameters)==null?void 0:T.docs),{source:s({originalSource:`{
  render: () => {
    return <div className="w-64 space-y-4">
        <Slider label="Disabled" defaultValue={50} disabled />
        <Slider label="Disabled Range" variant="range" defaultValue={[20, 80]} disabled />
      </div>;
  }
}`},(_=(P=V.parameters)==null?void 0:P.docs)==null?void 0:_.source)})});var A,O,q;p.parameters=l(s({},p.parameters),{docs:l(s({},(A=p.parameters)==null?void 0:A.docs),{source:s({originalSource:`{
  render: () => {
    const [value, setValue] = useState<[number, number]>([1000, 5000]);
    return <div className="w-64">
        <Slider label="Price Range" variant="range" min={0} max={10000} step={100} value={value} onChange={setValue} showValue />
        <p className="mt-4 text-sm text-gray-600">
          \${value[0].toLocaleString()} - \${value[1].toLocaleString()}
        </p>
      </div>;
  }
}`},(q=(O=p.parameters)==null?void 0:O.docs)==null?void 0:q.source)})});const te=["Default","WithLabel","Range","Sizes","WithMarks","WithSteps","Disabled","CustomRange"];export{p as CustomRange,o as Default,V as Disabled,m as Range,i as Sizes,d as WithLabel,c as WithMarks,g as WithSteps,te as __namedExportsOrder,re as default};
