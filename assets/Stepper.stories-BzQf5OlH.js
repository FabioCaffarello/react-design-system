var ue=Object.defineProperty,fe=Object.defineProperties;var xe=Object.getOwnPropertyDescriptors;var V=Object.getOwnPropertySymbols;var Se=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable;var z=(s,n,r)=>n in s?ue(s,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):s[n]=r,t=(s,n)=>{for(var r in n||(n={}))Se.call(n,r)&&z(s,r,n[r]);if(V)for(var r of V(n))he.call(n,r)&&z(s,r,n[r]);return s},o=(s,n)=>fe(s,xe(n));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as f}from"./iframe-38FCFUQv.js";import{g as l}from"./colors-BnDqA8Th.js";import{g as h}from"./spacing-Bf5iY5pu.js";import{g as b}from"./radius-CrNLhUJa.js";import{g as _}from"./animations-BabstCnB.js";import{B as N}from"./Button-CioV4BCG.js";import{S as ge}from"./Separator-DxmerWYc.js";import{c as ve}from"./createLucideIcon-DQdFte_Y.js";import{I as S}from"./Input-DlIdFoDR.js";import"./preload-helper-BDBacUwf.js";import"./Spinner-zwBmS9q3.js";import"./typography-BGNr2Ph4.js";import"./x-g6OncSvk.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],Y=ve("check",be);function x({steps:s,currentStep:n,defaultCurrentStep:r=0,onStepChange:c,onComplete:g,allowNavigation:i=!0,showStepNumbers:L=!0,orientation:me="horizontal",className:I=""}){const[de,F]=f.useState(r),v=n!==void 0,d=v?n:de,U=a=>a<d?"completed":a===d?"active":"pending",k=()=>{if(d<s.length-1){const a=d+1;v||F(a),c==null||c(a)}else g==null||g()},W=()=>{if(d>0){const a=d-1;v||F(a),c==null||c(a)}},T=a=>{i&&(s[a].disabled||(v||F(a),c==null||c(a)))},P=s[d],R=d===0,q=d===s.length-1;return me==="vertical"?e.jsxs("div",{className:`flex gap-4 ${I}`,children:[e.jsx("div",{className:"flex flex-col",children:s.map((a,p)=>{const m=a.status||U(p),A=p===d;return e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("button",{type:"button",onClick:()=>T(p),disabled:!i||a.disabled,className:`
                      flex
                      items-center
                      justify-center
                      w-10
                      h-10
                      ${b("full")}
                      border-2
                      ${_("base")}
                      ${m==="completed"?`${l("success","DEFAULT","bg")} ${l("success","DEFAULT","border")} text-white`:m==="active"?`${l("primary","DEFAULT","bg")} ${l("primary","DEFAULT","border")} text-white`:m==="error"?`${l("error","DEFAULT","bg")} ${l("error","DEFAULT","border")} text-white`:"bg-white border-gray-300 text-gray-400"}
                      ${!i||a.disabled?"cursor-not-allowed opacity-50":"cursor-pointer"}
                    `,children:m==="completed"?e.jsx(Y,{className:"h-5 w-5"}):L?p+1:null}),p<s.length-1&&e.jsx("div",{className:`
                        w-0.5
                        h-12
                        mt-2
                        ${m==="completed"?l("success","DEFAULT","bg"):"bg-gray-300"}
                      `})]}),e.jsxs("div",{className:"flex-1 pb-8",children:[e.jsx("button",{type:"button",onClick:()=>T(p),disabled:!i||a.disabled,className:`
                      text-left
                      ${A?"font-semibold":"font-medium"}
                      ${m==="active"?l("primary","DEFAULT","text"):"text-gray-700"}
                      ${!i||a.disabled?"cursor-not-allowed opacity-50":"cursor-pointer"}
                    `,children:a.title}),a.description&&e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:a.description})]})]},a.id)})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("div",{className:`
            ${h("lg","p")}
            border
            border-gray-200
            ${b("lg")}
            bg-white
          `,children:P.content}),e.jsxs("div",{className:`flex justify-between mt-4 ${h("base","gap")}`,children:[e.jsx(N,{variant:"outline",onClick:W,disabled:R,children:"Previous"}),e.jsx(N,{variant:"primary",onClick:k,children:q?"Complete":"Next"})]})]})]}):e.jsxs("div",{className:`space-y-6 ${I}`,children:[e.jsx("div",{className:"flex items-center",children:s.map((a,p)=>{const m=a.status||U(p),A=p===d;return e.jsxs("div",{className:"flex items-center flex-1",children:[e.jsxs("div",{className:"flex flex-col items-center flex-1",children:[e.jsx("button",{type:"button",onClick:()=>T(p),disabled:!i||a.disabled,className:`
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    ${b("full")}
                    border-2
                    ${_("base")}
                    ${m==="completed"?`${l("success","DEFAULT","bg")} ${l("success","DEFAULT","border")} text-white`:m==="active"?`${l("primary","DEFAULT","bg")} ${l("primary","DEFAULT","border")} text-white`:m==="error"?`${l("error","DEFAULT","bg")} ${l("error","DEFAULT","border")} text-white`:"bg-white border-gray-300 text-gray-400"}
                    ${!i||a.disabled?"cursor-not-allowed opacity-50":"cursor-pointer"}
                  `,children:m==="completed"?e.jsx(Y,{className:"h-5 w-5"}):L?p+1:null}),e.jsxs("div",{className:`mt-2 text-center ${h("sm","px")}`,children:[e.jsx("p",{className:`
                      text-sm
                      font-medium
                      ${A?l("primary","DEFAULT","text"):"text-gray-600"}
                    `,children:a.title}),a.description&&e.jsx("p",{className:"text-xs text-gray-500 mt-1",children:a.description})]})]}),p<s.length-1&&e.jsx("div",{className:`flex-1 mx-2 ${h("base","mx")}`,children:e.jsx(ge,{className:`
                      ${m==="completed"?l("success","DEFAULT","border"):"border-gray-300"}
                    `})})]},a.id)})}),e.jsx("div",{className:`
        ${h("lg","p")}
        border
        border-gray-200
        ${b("lg")}
        bg-white
      `,children:P.content}),e.jsxs("div",{className:`flex justify-between ${h("base","gap")}`,children:[e.jsx(N,{variant:"outline",onClick:W,disabled:R,children:"Previous"}),e.jsx(N,{variant:"primary",onClick:k,children:q?"Complete":"Next"})]})]})}x.__docgenInfo={description:`Stepper Component

A multi-step wizard component for guided workflows.
Supports validation, navigation, and completion callbacks.
Follows Atomic Design principles as an Organism component.

@example
\`\`\`tsx
<Stepper
  steps={[
    { id: '1', title: 'Step 1', content: <div>Content 1</div> },
    { id: '2', title: 'Step 2', content: <div>Content 2</div> },
  ]}
  onComplete={() => console.log('Completed!')}
/>
\`\`\``,methods:[],displayName:"Stepper",props:{steps:{required:!0,tsType:{name:"Array",elements:[{name:"StepperStep"}],raw:"StepperStep[]"},description:""},currentStep:{required:!1,tsType:{name:"number"},description:""},defaultCurrentStep:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},onStepChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(stepIndex: number) => void",signature:{arguments:[{type:{name:"number"},name:"stepIndex"}],return:{name:"void"}}},description:""},onComplete:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},allowNavigation:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},showStepNumbers:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},orientation:{required:!1,tsType:{name:"union",raw:"'horizontal' | 'vertical'",elements:[{name:"literal",value:"'horizontal'"},{name:"literal",value:"'vertical'"}]},description:"",defaultValue:{value:"'horizontal'",computed:!1}},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const We={title:"Organisms/Stepper",component:x,tags:["autodocs"],parameters:{layout:"padded"},argTypes:{orientation:{control:"select",options:["horizontal","vertical"]}}},u=[{id:"1",title:"Account",description:"Create your account",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Create Account"}),e.jsx(S,{label:"Email",type:"email",placeholder:"your@email.com"}),e.jsx(S,{label:"Password",type:"password",placeholder:"••••••••"})]})},{id:"2",title:"Profile",description:"Complete your profile",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Profile Information"}),e.jsx(S,{label:"First Name",placeholder:"John"}),e.jsx(S,{label:"Last Name",placeholder:"Doe"})]})},{id:"3",title:"Review",description:"Review and submit",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Review Your Information"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Please review all the information you've entered and click Complete to finish."})]})}],C={render:s=>{const[n,r]=f.useState(0);return e.jsx(x,o(t({},s),{steps:u,currentStep:n,onStepChange:r,onComplete:()=>alert("Completed!")}))}},y={render:()=>{const[s,n]=f.useState(0);return e.jsx(x,{steps:u,currentStep:s,onStepChange:n,orientation:"vertical",onComplete:()=>alert("Completed!")})}},j={render:()=>{const[s,n]=f.useState(0);return e.jsx(x,{steps:u,currentStep:s,onStepChange:n,showStepNumbers:!1,onComplete:()=>alert("Completed!")})}},w={render:()=>{const[s,n]=f.useState(1),r=[o(t({},u[0]),{status:"completed"}),o(t({},u[1]),{status:"active"}),o(t({},u[2]),{status:"pending"})];return e.jsx(x,{steps:r,currentStep:s,onStepChange:n,onComplete:()=>alert("Completed!")})}},D={render:()=>{const[s,n]=f.useState(1),r=[o(t({},u[0]),{status:"completed"}),o(t({},u[1]),{status:"error"}),o(t({},u[2]),{status:"pending"})];return e.jsx(x,{steps:r,currentStep:s,onStepChange:n,onComplete:()=>alert("Completed!")})}},$={render:()=>{const[s,n]=f.useState(0);return e.jsx(x,{steps:u,currentStep:s,onStepChange:n,allowNavigation:!1,onComplete:()=>alert("Completed!")})}},E={render:()=>{const[s,n]=f.useState(0),[r,c]=f.useState({email:"",password:"",firstName:"",lastName:""}),g=[{id:"1",title:"Sign Up",description:"Create your account",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Create Your Account"}),e.jsx(S,{label:"Email",type:"email",value:r.email,onChange:i=>c(o(t({},r),{email:i.target.value}))}),e.jsx(S,{label:"Password",type:"password",value:r.password,onChange:i=>c(o(t({},r),{password:i.target.value}))})]})},{id:"2",title:"Personal Info",description:"Tell us about yourself",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Personal Information"}),e.jsx(S,{label:"First Name",value:r.firstName,onChange:i=>c(o(t({},r),{firstName:i.target.value}))}),e.jsx(S,{label:"Last Name",value:r.lastName,onChange:i=>c(o(t({},r),{lastName:i.target.value}))})]})},{id:"3",title:"Review",description:"Review your information",content:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Review Your Information"}),e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Email:"}),e.jsx("span",{className:"font-medium",children:r.email||"Not provided"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{className:"text-gray-600",children:"Name:"}),e.jsxs("span",{className:"font-medium",children:[r.firstName," ",r.lastName||"Not provided"]})]})]})]})}];return e.jsx(x,{steps:g,currentStep:s,onStepChange:n,onComplete:()=>{alert("Registration Complete!"),console.log("Form Data:",r)}})}};var O,B,J;C.parameters=o(t({},C.parameters),{docs:o(t({},(O=C.parameters)==null?void 0:O.docs),{source:t({originalSource:`{
  render: args => {
    const [currentStep, setCurrentStep] = useState(0);
    return <Stepper {...args} steps={basicSteps} currentStep={currentStep} onStepChange={setCurrentStep} onComplete={() => alert('Completed!')} />;
  }
}`},(J=(B=C.parameters)==null?void 0:B.docs)==null?void 0:J.source)})});var M,G,H;y.parameters=o(t({},y.parameters),{docs:o(t({},(M=y.parameters)==null?void 0:M.docs),{source:t({originalSource:`{
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    return <Stepper steps={basicSteps} currentStep={currentStep} onStepChange={setCurrentStep} orientation="vertical" onComplete={() => alert('Completed!')} />;
  }
}`},(H=(G=y.parameters)==null?void 0:G.docs)==null?void 0:H.source)})});var K,Q,X;j.parameters=o(t({},j.parameters),{docs:o(t({},(K=j.parameters)==null?void 0:K.docs),{source:t({originalSource:`{
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    return <Stepper steps={basicSteps} currentStep={currentStep} onStepChange={setCurrentStep} showStepNumbers={false} onComplete={() => alert('Completed!')} />;
  }
}`},(X=(Q=j.parameters)==null?void 0:Q.docs)==null?void 0:X.source)})});var Z,ee,te;w.parameters=o(t({},w.parameters),{docs:o(t({},(Z=w.parameters)==null?void 0:Z.docs),{source:t({originalSource:`{
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const stepsWithStatus = [{
      ...basicSteps[0],
      status: 'completed' as const
    }, {
      ...basicSteps[1],
      status: 'active' as const
    }, {
      ...basicSteps[2],
      status: 'pending' as const
    }];
    return <Stepper steps={stepsWithStatus} currentStep={currentStep} onStepChange={setCurrentStep} onComplete={() => alert('Completed!')} />;
  }
}`},(te=(ee=w.parameters)==null?void 0:ee.docs)==null?void 0:te.source)})});var se,re,ae;D.parameters=o(t({},D.parameters),{docs:o(t({},(se=D.parameters)==null?void 0:se.docs),{source:t({originalSource:`{
  render: () => {
    const [currentStep, setCurrentStep] = useState(1);
    const stepsWithError = [{
      ...basicSteps[0],
      status: 'completed' as const
    }, {
      ...basicSteps[1],
      status: 'error' as const
    }, {
      ...basicSteps[2],
      status: 'pending' as const
    }];
    return <Stepper steps={stepsWithError} currentStep={currentStep} onStepChange={setCurrentStep} onComplete={() => alert('Completed!')} />;
  }
}`},(ae=(re=D.parameters)==null?void 0:re.docs)==null?void 0:ae.source)})});var ne,oe,le;$.parameters=o(t({},$.parameters),{docs:o(t({},(ne=$.parameters)==null?void 0:ne.docs),{source:t({originalSource:`{
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    return <Stepper steps={basicSteps} currentStep={currentStep} onStepChange={setCurrentStep} allowNavigation={false} onComplete={() => alert('Completed!')} />;
  }
}`},(le=(oe=$.parameters)==null?void 0:oe.docs)==null?void 0:le.source)})});var ie,ce,pe;E.parameters=o(t({},E.parameters),{docs:o(t({},(ie=E.parameters)==null?void 0:ie.docs),{source:t({originalSource:`{
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    });
    const complexSteps = [{
      id: '1',
      title: 'Sign Up',
      description: 'Create your account',
      content: <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create Your Account</h3>
            <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({
          ...formData,
          email: e.target.value
        })} />
            <Input label="Password" type="password" value={formData.password} onChange={e => setFormData({
          ...formData,
          password: e.target.value
        })} />
          </div>
    }, {
      id: '2',
      title: 'Personal Info',
      description: 'Tell us about yourself',
      content: <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <Input label="First Name" value={formData.firstName} onChange={e => setFormData({
          ...formData,
          firstName: e.target.value
        })} />
            <Input label="Last Name" value={formData.lastName} onChange={e => setFormData({
          ...formData,
          lastName: e.target.value
        })} />
          </div>
    }, {
      id: '3',
      title: 'Review',
      description: 'Review your information',
      content: <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">
                  {formData.firstName} {formData.lastName || 'Not provided'}
                </span>
              </div>
            </div>
          </div>
    }];
    return <Stepper steps={complexSteps} currentStep={currentStep} onStepChange={setCurrentStep} onComplete={() => {
      alert('Registration Complete!');
      console.log('Form Data:', formData);
    }} />;
  }
}`},(pe=(ce=E.parameters)==null?void 0:ce.docs)==null?void 0:pe.source)})});const Pe=["Default","Vertical","WithoutStepNumbers","WithStatus","WithError","WithoutNavigation","ComplexWorkflow"];export{E as ComplexWorkflow,C as Default,y as Vertical,D as WithError,w as WithStatus,$ as WithoutNavigation,j as WithoutStepNumbers,Pe as __namedExportsOrder,We as default};
