var R=Object.defineProperty,q=Object.defineProperties;var z=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var A=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var x=(a,e,t)=>e in a?R(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t,r=(a,e)=>{for(var t in e||(e={}))A.call(e,t)&&x(a,t,e[t]);if(v)for(var t of v(e))B.call(e,t)&&x(a,t,e[t]);return a},l=(a,e)=>q(a,z(e));import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as m}from"./iframe-38FCFUQv.js";import{T as o}from"./TimePicker-ECKtr9SN.js";import"./preload-helper-BDBacUwf.js";import"./Input-DlIdFoDR.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./Button-CioV4BCG.js";import"./Spinner-zwBmS9q3.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./Popover-d74k1b_1.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./shadows-B52VkgOA.js";import"./z-index-DQdti7D9.js";import"./animations-BabstCnB.js";const ne={title:"Molecules/TimePicker",component:o,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{format:{control:"select",options:["12h","24h"]}}},i={render:a=>{const[e,t]=m.useState(a.defaultValue||"");return s.jsxs("div",{className:"w-64",children:[s.jsx(o,l(r({},a),{value:e,onChange:t})),s.jsxs("p",{className:"mt-2 text-sm text-gray-600",children:["Selected: ",e||"None"]})]})}},c={render:a=>{const[e,t]=m.useState(a.defaultValue||"14:30");return s.jsxs("div",{className:"w-64",children:[s.jsx(o,l(r({},a),{value:e,onChange:t,format:"24h"})),s.jsxs("p",{className:"mt-2 text-sm text-gray-600",children:["Selected: ",e]})]})}},n={render:a=>{const[e,t]=m.useState(a.defaultValue||"02:30 PM");return s.jsxs("div",{className:"w-64",children:[s.jsx(o,l(r({},a),{value:e,onChange:t,format:"12h"})),s.jsxs("p",{className:"mt-2 text-sm text-gray-600",children:["Selected: ",e]})]})}},u={render:()=>{const[a,e]=m.useState("");return s.jsx("div",{className:"w-64",children:s.jsx(o,{label:"Start Time",value:a,onChange:e})})}},d={render:()=>{const[a,e]=m.useState("");return s.jsx("div",{className:"w-64",children:s.jsx(o,{label:"Time",value:a,onChange:e,error:!0,helperText:"Please select a valid time"})})}},p={render:()=>s.jsx("div",{className:"w-64",children:s.jsx(o,{label:"Time",defaultValue:"09:00",disabled:!0})})},h={render:()=>{const[a,e]=m.useState(""),[t,O]=m.useState("");return s.jsxs("div",{className:"w-96 space-y-4 p-4 border border-gray-200 rounded-lg",children:[s.jsx("h3",{className:"text-lg font-semibold",children:"Schedule"}),s.jsx(o,{label:"Start Time",value:a,onChange:e,format:"12h"}),s.jsx(o,{label:"End Time",value:t,onChange:O,format:"12h"}),a&&t&&s.jsxs("p",{className:"text-sm text-gray-600",children:["Duration: ",a," - ",t]})]})}};var g,T,S;i.parameters=l(r({},i.parameters),{docs:l(r({},(g=i.parameters)==null?void 0:g.docs),{source:r({originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.defaultValue || '');
    return <div className="w-64">
        <TimePicker {...args} value={value} onChange={setValue} />
        <p className="mt-2 text-sm text-gray-600">Selected: {value || 'None'}</p>
      </div>;
  }
}`},(S=(T=i.parameters)==null?void 0:T.docs)==null?void 0:S.source)})});var N,f,V;c.parameters=l(r({},c.parameters),{docs:l(r({},(N=c.parameters)==null?void 0:N.docs),{source:r({originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.defaultValue || '14:30');
    return <div className="w-64">
        <TimePicker {...args} value={value} onChange={setValue} format="24h" />
        <p className="mt-2 text-sm text-gray-600">Selected: {value}</p>
      </div>;
  }
}`},(V=(f=c.parameters)==null?void 0:f.docs)==null?void 0:V.source)})});var b,j,w;n.parameters=l(r({},n.parameters),{docs:l(r({},(b=n.parameters)==null?void 0:b.docs),{source:r({originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.defaultValue || '02:30 PM');
    return <div className="w-64">
        <TimePicker {...args} value={value} onChange={setValue} format="12h" />
        <p className="mt-2 text-sm text-gray-600">Selected: {value}</p>
      </div>;
  }
}`},(w=(j=n.parameters)==null?void 0:j.docs)==null?void 0:w.source)})});var y,C,P;u.parameters=l(r({},u.parameters),{docs:l(r({},(y=u.parameters)==null?void 0:y.docs),{source:r({originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-64">
        <TimePicker label="Start Time" value={value} onChange={setValue} />
      </div>;
  }
}`},(P=(C=u.parameters)==null?void 0:C.docs)==null?void 0:P.source)})});var k,E,D;d.parameters=l(r({},d.parameters),{docs:l(r({},(k=d.parameters)==null?void 0:k.docs),{source:r({originalSource:`{
  render: () => {
    const [value, setValue] = useState('');
    return <div className="w-64">
        <TimePicker label="Time" value={value} onChange={setValue} error helperText="Please select a valid time" />
      </div>;
  }
}`},(D=(E=d.parameters)==null?void 0:E.docs)==null?void 0:D.source)})});var F,W,M;p.parameters=l(r({},p.parameters),{docs:l(r({},(F=p.parameters)==null?void 0:F.docs),{source:r({originalSource:`{
  render: () => <div className="w-64">
      <TimePicker label="Time" defaultValue="09:00" disabled />
    </div>
}`},(M=(W=p.parameters)==null?void 0:W.docs)==null?void 0:M.source)})});var I,L,_;h.parameters=l(r({},h.parameters),{docs:l(r({},(I=h.parameters)==null?void 0:I.docs),{source:r({originalSource:`{
  render: () => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    return <div className="w-96 space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold">Schedule</h3>
        <TimePicker label="Start Time" value={startTime} onChange={setStartTime} format="12h" />
        <TimePicker label="End Time" value={endTime} onChange={setEndTime} format="12h" />
        {startTime && endTime && <p className="text-sm text-gray-600">
            Duration: {startTime} - {endTime}
          </p>}
      </div>;
  }
}`},(_=(L=h.parameters)==null?void 0:L.docs)==null?void 0:_.source)})});const ue=["Default","Format24h","Format12h","WithLabel","WithError","Disabled","InForm"];export{i as Default,p as Disabled,n as Format12h,c as Format24h,h as InForm,d as WithError,u as WithLabel,ue as __namedExportsOrder,ne as default};
