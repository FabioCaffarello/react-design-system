var O=Object.defineProperty,R=Object.defineProperties;var q=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var z=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable;var C=(e,r,o)=>r in e?O(e,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[r]=o,a=(e,r)=>{for(var o in r||(r={}))z.call(r,o)&&C(e,o,r[o]);if(v)for(var o of v(r))A.call(r,o)&&C(e,o,r[o]);return e},t=(e,r)=>R(e,q(r));import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{r as c}from"./iframe-38FCFUQv.js";import{C as l}from"./ColorPicker-B847UTu1.js";import"./preload-helper-BDBacUwf.js";import"./radius-CrNLhUJa.js";import"./shadows-B52VkgOA.js";import"./spacing-Bf5iY5pu.js";import"./Input-DlIdFoDR.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./Button-CioV4BCG.js";import"./Spinner-zwBmS9q3.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./Popover-d74k1b_1.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./z-index-DQdti7D9.js";import"./animations-BabstCnB.js";const ue={title:"Molecules/ColorPicker",component:l,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{format:{control:"select",options:["hex","rgb","hsl"]}}},d={render:e=>{const[r,o]=c.useState(e.defaultValue||"#3b82f6");return s.jsxs("div",{children:[s.jsx(l,t(a({},e),{value:r,onChange:o})),s.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["Selected: ",r]})]})}},n={render:()=>{const[e,r]=c.useState("#3b82f6");return s.jsxs("div",{children:[s.jsx(l,{label:"Background Color",value:e,onChange:r}),s.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["Selected: ",e]})]})}},u={render:()=>{const[e,r]=c.useState("#3b82f6");return s.jsxs("div",{children:[s.jsx(l,{label:"Color",value:e,onChange:r,showInput:!0}),s.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["Selected: ",e]})]})}},m={render:()=>{const[e,r]=c.useState("#3b82f6"),o=["#ef4444","#f59e0b","#10b981","#3b82f6","#8b5cf6","#ec4899","#06b6d4","#84cc16","#f97316","#6366f1"];return s.jsxs("div",{children:[s.jsx(l,{label:"Brand Color",value:e,onChange:r,presets:o}),s.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["Selected: ",e]})]})}},i={render:()=>{const[e,r]=c.useState("#3b82f6");return s.jsxs("div",{children:[s.jsx(l,{label:"Color",value:e,onChange:r,showInput:!1}),s.jsxs("p",{className:"mt-4 text-sm text-gray-600",children:["Selected: ",e]})]})}},p={render:()=>s.jsx("div",{children:s.jsx(l,{label:"Color",value:"#3b82f6",disabled:!0})})},b={render:()=>{const[e,r]=c.useState("#3b82f6"),[o,M]=c.useState("#8b5cf6");return s.jsxs("div",{className:"w-96 space-y-4 p-4 border border-gray-200 rounded-lg",children:[s.jsx("h3",{className:"text-lg font-semibold",children:"Theme Colors"}),s.jsx(l,{label:"Primary Color",value:e,onChange:r}),s.jsx(l,{label:"Secondary Color",value:o,onChange:M}),s.jsx("div",{className:"pt-4 border-t border-gray-200",children:s.jsxs("div",{className:"flex gap-2",children:[s.jsx("div",{className:"w-16 h-16 rounded-md border border-gray-200",style:{backgroundColor:e}}),s.jsx("div",{className:"w-16 h-16 rounded-md border border-gray-200",style:{backgroundColor:o}})]})})]})}};var g,x,h;d.parameters=t(a({},d.parameters),{docs:t(a({},(g=d.parameters)==null?void 0:g.docs),{source:a({originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.defaultValue || '#3b82f6');
    return <div>
        <ColorPicker {...args} value={value} onChange={setValue} />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>;
  }
}`},(h=(x=d.parameters)==null?void 0:x.docs)==null?void 0:h.source)})});var y,f,S;n.parameters=t(a({},n.parameters),{docs:t(a({},(y=n.parameters)==null?void 0:y.docs),{source:a({originalSource:`{
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return <div>
        <ColorPicker label="Background Color" value={value} onChange={setValue} />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>;
  }
}`},(S=(f=n.parameters)==null?void 0:f.docs)==null?void 0:S.source)})});var j,N,P;u.parameters=t(a({},u.parameters),{docs:t(a({},(j=u.parameters)==null?void 0:j.docs),{source:a({originalSource:`{
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return <div>
        <ColorPicker label="Color" value={value} onChange={setValue} showInput />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>;
  }
}`},(P=(N=u.parameters)==null?void 0:N.docs)==null?void 0:P.source)})});var V,k,w;m.parameters=t(a({},m.parameters),{docs:t(a({},(V=m.parameters)==null?void 0:V.docs),{source:a({originalSource:`{
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    const customPresets = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];
    return <div>
        <ColorPicker label="Brand Color" value={value} onChange={setValue} presets={customPresets} />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>;
  }
}`},(w=(k=m.parameters)==null?void 0:k.docs)==null?void 0:w.source)})});var I,W,B;i.parameters=t(a({},i.parameters),{docs:t(a({},(I=i.parameters)==null?void 0:I.docs),{source:a({originalSource:`{
  render: () => {
    const [value, setValue] = useState('#3b82f6');
    return <div>
        <ColorPicker label="Color" value={value} onChange={setValue} showInput={false} />
        <p className="mt-4 text-sm text-gray-600">Selected: {value}</p>
      </div>;
  }
}`},(B=(W=i.parameters)==null?void 0:W.docs)==null?void 0:B.source)})});var D,E,T;p.parameters=t(a({},p.parameters),{docs:t(a({},(D=p.parameters)==null?void 0:D.docs),{source:a({originalSource:`{
  render: () => <div>
      <ColorPicker label="Color" value="#3b82f6" disabled />
    </div>
}`},(T=(E=p.parameters)==null?void 0:E.docs)==null?void 0:T.source)})});var F,L,_;b.parameters=t(a({},b.parameters),{docs:t(a({},(F=b.parameters)==null?void 0:F.docs),{source:a({originalSource:`{
  render: () => {
    const [primaryColor, setPrimaryColor] = useState('#3b82f6');
    const [secondaryColor, setSecondaryColor] = useState('#8b5cf6');
    return <div className="w-96 space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold">Theme Colors</h3>
        <ColorPicker label="Primary Color" value={primaryColor} onChange={setPrimaryColor} />
        <ColorPicker label="Secondary Color" value={secondaryColor} onChange={setSecondaryColor} />
        <div className="pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <div className="w-16 h-16 rounded-md border border-gray-200" style={{
            backgroundColor: primaryColor
          }} />
            <div className="w-16 h-16 rounded-md border border-gray-200" style={{
            backgroundColor: secondaryColor
          }} />
          </div>
        </div>
      </div>;
  }
}`},(_=(L=b.parameters)==null?void 0:L.docs)==null?void 0:_.source)})});const me=["Default","WithLabel","WithInput","CustomPresets","WithoutInput","Disabled","InForm"];export{m as CustomPresets,d as Default,p as Disabled,b as InForm,u as WithInput,n as WithLabel,i as WithoutInput,me as __namedExportsOrder,ue as default};
