var V=Object.defineProperty,_=Object.defineProperties;var F=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,k=Object.prototype.propertyIsEnumerable;var g=(l,t,o)=>t in l?V(l,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):l[t]=o,e=(l,t)=>{for(var o in t||(t={}))T.call(t,o)&&g(l,o,t[o]);if(v)for(var o of v(t))k.call(t,o)&&g(l,o,t[o]);return l},s=(l,t)=>_(l,F(t));import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{R as w}from"./iframe-38FCFUQv.js";import{P as a}from"./Progress-CiRLFMCA.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./typography-BGNr2Ph4.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";const ae={title:"Atoms/Progress",component:a,parameters:{docs:{description:{component:"A progress bar component for displaying progress or loading states. Supports both determinate (with value) and indeterminate (without value) modes. Fully accessible with ARIA attributes."}}},tags:["autodocs"],argTypes:{value:{control:{type:"range",min:0,max:100,step:1},description:"Progress value (0-100). Omit for indeterminate mode."},max:{control:"number",description:"Maximum value (default: 100)"},variant:{control:"select",options:["primary","secondary","success","error","warning","info"],description:"Color variant of the progress bar"},size:{control:"select",options:["sm","md","lg"],description:"Size of the progress bar"},showLabel:{control:"boolean",description:"Whether to show the label and percentage"},label:{control:"text",description:"Custom label text"}}},n={args:{value:50,variant:"primary",size:"md"}},i={args:{value:75,variant:"primary",showLabel:!0,label:"Upload Progress"}},m={args:{variant:"primary",size:"md"},parameters:{docs:{description:{story:"Indeterminate progress bar for loading states where progress cannot be determined."}}}},c={render:()=>r.jsxs("div",{className:"space-y-4 w-full max-w-md",children:[r.jsx(a,{value:60,variant:"primary",showLabel:!0,label:"Primary"}),r.jsx(a,{value:60,variant:"secondary",showLabel:!0,label:"Secondary"}),r.jsx(a,{value:60,variant:"success",showLabel:!0,label:"Success"}),r.jsx(a,{value:60,variant:"error",showLabel:!0,label:"Error"}),r.jsx(a,{value:60,variant:"warning",showLabel:!0,label:"Warning"}),r.jsx(a,{value:60,variant:"info",showLabel:!0,label:"Info"})]}),parameters:{docs:{description:{story:"All available color variants of the progress bar."}}}},d={render:()=>r.jsxs("div",{className:"space-y-4 w-full max-w-md",children:[r.jsx(a,{value:50,size:"sm",showLabel:!0,label:"Small"}),r.jsx(a,{value:50,size:"md",showLabel:!0,label:"Medium"}),r.jsx(a,{value:50,size:"lg",showLabel:!0,label:"Large"})]}),parameters:{docs:{description:{story:"Different sizes of the progress bar."}}}},p={render:()=>r.jsxs("div",{className:"space-y-4 w-full max-w-md",children:[r.jsx(a,{value:0,showLabel:!0,label:"Not Started (0%)"}),r.jsx(a,{value:25,showLabel:!0,label:"In Progress (25%)"}),r.jsx(a,{value:50,showLabel:!0,label:"Halfway (50%)"}),r.jsx(a,{value:75,showLabel:!0,label:"Almost Done (75%)"}),r.jsx(a,{value:100,showLabel:!0,label:"Complete (100%)"}),r.jsx(a,{variant:"primary",showLabel:!0,label:"Indeterminate"})]}),parameters:{docs:{description:{story:"Different progress states from 0% to 100%, plus indeterminate mode."}}}},u={render:()=>{const[l,t]=w.useState(0);return w.useEffect(()=>{const o=setInterval(()=>{t(b=>b>=100?0:b+10)},500);return()=>clearInterval(o)},[]),r.jsxs("div",{className:"space-y-4 w-full max-w-md",children:[r.jsx(a,{value:l,showLabel:!0,label:"Animated Progress"}),r.jsx("p",{className:"text-sm text-gray-600",children:"Progress automatically updates every 500ms"})]})},parameters:{docs:{description:{story:"Animated progress bar that updates automatically."}}}};var h,y,f;n.parameters=s(e({},n.parameters),{docs:s(e({},(h=n.parameters)==null?void 0:h.docs),{source:e({originalSource:`{
  args: {
    value: 50,
    variant: 'primary',
    size: 'md'
  }
}`},(f=(y=n.parameters)==null?void 0:y.docs)==null?void 0:f.source)})});var x,L,P;i.parameters=s(e({},i.parameters),{docs:s(e({},(x=i.parameters)==null?void 0:x.docs),{source:e({originalSource:`{
  args: {
    value: 75,
    variant: 'primary',
    showLabel: true,
    label: 'Upload Progress'
  }
}`},(P=(L=i.parameters)==null?void 0:L.docs)==null?void 0:P.source)})});var j,S,z;m.parameters=s(e({},m.parameters),{docs:s(e({},(j=m.parameters)==null?void 0:j.docs),{source:e({originalSource:`{
  args: {
    variant: 'primary',
    size: 'md'
  },
  parameters: {
    docs: {
      description: {
        story: 'Indeterminate progress bar for loading states where progress cannot be determined.'
      }
    }
  }
}`},(z=(S=m.parameters)==null?void 0:S.docs)==null?void 0:z.source)})});var I,A,N;c.parameters=s(e({},c.parameters),{docs:s(e({},(I=c.parameters)==null?void 0:I.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-4 w-full max-w-md">
      <Progress value={60} variant="primary" showLabel label="Primary" />
      <Progress value={60} variant="secondary" showLabel label="Secondary" />
      <Progress value={60} variant="success" showLabel label="Success" />
      <Progress value={60} variant="error" showLabel label="Error" />
      <Progress value={60} variant="warning" showLabel label="Warning" />
      <Progress value={60} variant="info" showLabel label="Info" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available color variants of the progress bar.'
      }
    }
  }
}`},(N=(A=c.parameters)==null?void 0:A.docs)==null?void 0:N.source)})});var D,E,R;d.parameters=s(e({},d.parameters),{docs:s(e({},(D=d.parameters)==null?void 0:D.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-4 w-full max-w-md">
      <Progress value={50} size="sm" showLabel label="Small" />
      <Progress value={50} size="md" showLabel label="Medium" />
      <Progress value={50} size="lg" showLabel label="Large" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Different sizes of the progress bar.'
      }
    }
  }
}`},(R=(E=d.parameters)==null?void 0:E.docs)==null?void 0:R.source)})});var W,C,M;p.parameters=s(e({},p.parameters),{docs:s(e({},(W=p.parameters)==null?void 0:W.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-4 w-full max-w-md">
      <Progress value={0} showLabel label="Not Started (0%)" />
      <Progress value={25} showLabel label="In Progress (25%)" />
      <Progress value={50} showLabel label="Halfway (50%)" />
      <Progress value={75} showLabel label="Almost Done (75%)" />
      <Progress value={100} showLabel label="Complete (100%)" />
      <Progress variant="primary" showLabel label="Indeterminate" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Different progress states from 0% to 100%, plus indeterminate mode.'
      }
    }
  }
}`},(M=(C=p.parameters)==null?void 0:C.docs)==null?void 0:M.source)})});var H,O,U;u.parameters=s(e({},u.parameters),{docs:s(e({},(H=u.parameters)==null?void 0:H.docs),{source:e({originalSource:`{
  render: () => {
    const [progress, setProgress] = React.useState(0);
    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(timer);
    }, []);
    return <div className="space-y-4 w-full max-w-md">
        <Progress value={progress} showLabel label="Animated Progress" />
        <p className="text-sm text-gray-600">
          Progress automatically updates every 500ms
        </p>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated progress bar that updates automatically.'
      }
    }
  }
}`},(U=(O=u.parameters)==null?void 0:O.docs)==null?void 0:U.source)})});const se=["Default","WithLabel","Indeterminate","Variants","Sizes","States","Animated"];export{u as Animated,n as Default,m as Indeterminate,d as Sizes,p as States,c as Variants,i as WithLabel,se as __namedExportsOrder,ae as default};
