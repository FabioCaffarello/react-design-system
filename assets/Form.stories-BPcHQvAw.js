var K=Object.defineProperty,Y=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var g=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var j=(a,n,l)=>n in a?K(a,n,{enumerable:!0,configurable:!0,writable:!0,value:l}):a[n]=l,r=(a,n)=>{for(var l in n||(n={}))k.call(n,l)&&j(a,l,n[l]);if(g)for(var l of g(n))z.call(n,l)&&j(a,l,n[l]);return a},s=(a,n)=>Y(a,G(n));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{F as o}from"./Form-DGsGsnAi.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import{I as i}from"./Input-DlIdFoDR.js";import{B as m}from"./Button-CioV4BCG.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import{S as y}from"./Select-DlyDBWSl.js";import{T as x}from"./Textarea-DdmeGXU2.js";import{L as t,E as J}from"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";const Me={title:"Molecules/Form",component:o,parameters:{docs:{description:{component:"A wrapper component for forms with validation states, error/success messages, and layout."}}},argTypes:{loading:{control:"boolean",description:"Whether the form is in a loading state"},error:{control:"text",description:"Global error message to display"},success:{control:"text",description:"Success message to display"}}},d={args:{onSubmit:a=>{a.preventDefault(),alert("Form submitted!")}},render:a=>e.jsxs(o,s(r({},a),{className:"max-w-md",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"name",variant:"required",children:"Name"}),e.jsx(i,{id:"name",name:"name",placeholder:"Enter your name",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"email",variant:"required",children:"Email"}),e.jsx(i,{id:"email",name:"email",type:"email",placeholder:"Enter your email",required:!0})]}),e.jsx(m,{type:"submit",variant:"regular",children:"Submit"})]}))},c={args:{error:"Please fix the errors below and try again.",onSubmit:a=>{a.preventDefault()}},render:a=>e.jsxs(o,s(r({},a),{className:"max-w-md",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"email",variant:"required",children:"Email"}),e.jsx(i,{id:"email",name:"email",type:"email","aria-invalid":"true","aria-describedby":"email-error"}),e.jsx(J,{message:"Please enter a valid email address",id:"email-error"})]}),e.jsx(m,{type:"submit",variant:"regular",children:"Submit"})]}))},u={args:{success:"Form submitted successfully!",onSubmit:a=>{a.preventDefault()}},render:a=>e.jsxs(o,s(r({},a),{className:"max-w-md",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"name",variant:"required",children:"Name"}),e.jsx(i,{id:"name",name:"name"})]}),e.jsx(m,{type:"submit",variant:"regular",children:"Submit"})]}))},p={args:{loading:!0,onSubmit:a=>{a.preventDefault()}},render:a=>e.jsxs(o,s(r({},a),{className:"max-w-md",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"name",variant:"required",children:"Name"}),e.jsx(i,{id:"name",name:"name",disabled:!0})]}),e.jsx(m,{type:"submit",variant:"regular",disabled:!0,children:"Submitting..."})]}))},v={args:{onSubmit:a=>{a.preventDefault(),alert("Form submitted!")}},render:a=>e.jsxs(o,s(r({},a),{className:"max-w-md space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"title",variant:"required",children:"Title"}),e.jsx(i,{id:"title",name:"title",placeholder:"Enter title",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"description",variant:"required",children:"Description"}),e.jsx(x,{id:"description",name:"description",rows:4,placeholder:"Enter description",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"status",variant:"required",children:"Status"}),e.jsx(y,{id:"status",name:"status",options:[{value:"DRAFT",label:"Draft"},{value:"ACTIVE",label:"Active"},{value:"COMPLETED",label:"Completed"}],placeholder:"Select status"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"priority",variant:"optional",children:"Priority"}),e.jsx(y,{id:"priority",name:"priority",options:[{value:"LOW",label:"Low"},{value:"MEDIUM",label:"Medium"},{value:"HIGH",label:"High"}],placeholder:"Select priority"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(m,{type:"submit",variant:"regular",children:"Submit"}),e.jsx(m,{type:"button",variant:"secondary",children:"Cancel"})]})]}))},h={args:{onSubmit:a=>{a.preventDefault(),alert("Registration submitted!")}},render:a=>e.jsxs(o,s(r({},a),{className:"max-w-lg space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"firstName",variant:"required",children:"First Name"}),e.jsx(i,{id:"firstName",name:"firstName",placeholder:"John",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"lastName",variant:"required",children:"Last Name"}),e.jsx(i,{id:"lastName",name:"lastName",placeholder:"Doe",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"email",variant:"required",children:"Email"}),e.jsx(i,{id:"email",name:"email",type:"email",placeholder:"john.doe@example.com",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"password",variant:"required",children:"Password"}),e.jsx(i,{id:"password",name:"password",type:"password",placeholder:"Enter password",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"country",variant:"optional",children:"Country"}),e.jsx(y,{id:"country",name:"country",options:[{value:"US",label:"United States"},{value:"BR",label:"Brazil"},{value:"UK",label:"United Kingdom"}],placeholder:"Select country"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"bio",variant:"optional",children:"Bio"}),e.jsx(x,{id:"bio",name:"bio",rows:4,placeholder:"Tell us about yourself"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(m,{type:"submit",variant:"regular",children:"Register"}),e.jsx(m,{type:"button",variant:"secondary",children:"Cancel"})]})]})),parameters:{docs:{description:{story:"Complete registration form showing multiple form fields working together."}}}},b={args:{onSubmit:a=>{a.preventDefault(),alert("Message sent!")}},render:a=>e.jsxs(o,s(r({},a),{className:"max-w-md space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"contactName",variant:"required",children:"Name"}),e.jsx(i,{id:"contactName",name:"name",placeholder:"Your name",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"contactEmail",variant:"required",children:"Email"}),e.jsx(i,{id:"contactEmail",name:"email",type:"email",placeholder:"your.email@example.com",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"subject",variant:"required",children:"Subject"}),e.jsx(i,{id:"subject",name:"subject",placeholder:"Message subject",required:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(t,{htmlFor:"message",variant:"required",children:"Message"}),e.jsx(x,{id:"message",name:"message",rows:6,placeholder:"Your message",required:!0})]}),e.jsx(m,{type:"submit",variant:"regular",fullWidth:!0,children:"Send Message"})]})),parameters:{docs:{description:{story:"Contact form example showing a real-world use case."}}}};var N,F,q;d.parameters=s(r({},d.parameters),{docs:s(r({},(N=d.parameters)==null?void 0:N.docs),{source:r({originalSource:`{
  args: {
    onSubmit: e => {
      e.preventDefault();
      alert("Form submitted!");
    }
  },
  render: args => <Form {...args} className="max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Name
        </Label>
        <Input id="name" name="name" placeholder="Enter your name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          Email
        </Label>
        <Input id="email" name="email" type="email" placeholder="Enter your email" required />
      </div>
      <Button type="submit" variant="regular">
        Submit
      </Button>
    </Form>
}`},(q=(F=d.parameters)==null?void 0:F.docs)==null?void 0:q.source)})});var f,S,L;c.parameters=s(r({},c.parameters),{docs:s(r({},(f=c.parameters)==null?void 0:f.docs),{source:r({originalSource:`{
  args: {
    error: "Please fix the errors below and try again.",
    onSubmit: e => {
      e.preventDefault();
    }
  },
  render: args => <Form {...args} className="max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          Email
        </Label>
        <Input id="email" name="email" type="email" aria-invalid="true" aria-describedby="email-error" />
        <ErrorMessage message="Please enter a valid email address" id="email-error" />
      </div>
      <Button type="submit" variant="regular">
        Submit
      </Button>
    </Form>
}`},(L=(S=c.parameters)==null?void 0:S.docs)==null?void 0:L.source)})});var w,E,D;u.parameters=s(r({},u.parameters),{docs:s(r({},(w=u.parameters)==null?void 0:w.docs),{source:r({originalSource:`{
  args: {
    success: "Form submitted successfully!",
    onSubmit: e => {
      e.preventDefault();
    }
  },
  render: args => <Form {...args} className="max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Name
        </Label>
        <Input id="name" name="name" />
      </div>
      <Button type="submit" variant="regular">
        Submit
      </Button>
    </Form>
}`},(D=(E=u.parameters)==null?void 0:E.docs)==null?void 0:D.source)})});var B,I,C;p.parameters=s(r({},p.parameters),{docs:s(r({},(B=p.parameters)==null?void 0:B.docs),{source:r({originalSource:`{
  args: {
    loading: true,
    onSubmit: e => {
      e.preventDefault();
    }
  },
  render: args => <Form {...args} className="max-w-md">
      <div className="space-y-2">
        <Label htmlFor="name" variant="required">
          Name
        </Label>
        <Input id="name" name="name" disabled />
      </div>
      <Button type="submit" variant="regular" disabled>
        Submitting...
      </Button>
    </Form>
}`},(C=(I=p.parameters)==null?void 0:I.docs)==null?void 0:C.source)})});var M,T,R;v.parameters=s(r({},v.parameters),{docs:s(r({},(M=v.parameters)==null?void 0:M.docs),{source:r({originalSource:`{
  args: {
    onSubmit: e => {
      e.preventDefault();
      alert("Form submitted!");
    }
  },
  render: args => <Form {...args} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title" variant="required">
          Title
        </Label>
        <Input id="title" name="title" placeholder="Enter title" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" variant="required">
          Description
        </Label>
        <Textarea id="description" name="description" rows={4} placeholder="Enter description" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status" variant="required">
          Status
        </Label>
        <Select id="status" name="status" options={[{
        value: "DRAFT",
        label: "Draft"
      }, {
        value: "ACTIVE",
        label: "Active"
      }, {
        value: "COMPLETED",
        label: "Completed"
      }]} placeholder="Select status" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority" variant="optional">
          Priority
        </Label>
        <Select id="priority" name="priority" options={[{
        value: "LOW",
        label: "Low"
      }, {
        value: "MEDIUM",
        label: "Medium"
      }, {
        value: "HIGH",
        label: "High"
      }]} placeholder="Select priority" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="regular">
          Submit
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </Form>
}`},(R=(T=v.parameters)==null?void 0:T.docs)==null?void 0:R.source)})});var P,U,W;h.parameters=s(r({},h.parameters),{docs:s(r({},(P=h.parameters)==null?void 0:P.docs),{source:r({originalSource:`{
  args: {
    onSubmit: e => {
      e.preventDefault();
      alert("Registration submitted!");
    }
  },
  render: args => <Form {...args} className="max-w-lg space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName" variant="required">
          First Name
        </Label>
        <Input id="firstName" name="firstName" placeholder="John" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName" variant="required">
          Last Name
        </Label>
        <Input id="lastName" name="lastName" placeholder="Doe" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" variant="required">
          Email
        </Label>
        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" variant="required">
          Password
        </Label>
        <Input id="password" name="password" type="password" placeholder="Enter password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country" variant="optional">
          Country
        </Label>
        <Select id="country" name="country" options={[{
        value: "US",
        label: "United States"
      }, {
        value: "BR",
        label: "Brazil"
      }, {
        value: "UK",
        label: "United Kingdom"
      }]} placeholder="Select country" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio" variant="optional">
          Bio
        </Label>
        <Textarea id="bio" name="bio" rows={4} placeholder="Tell us about yourself" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" variant="regular">
          Register
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </Form>,
  parameters: {
    docs: {
      description: {
        story: 'Complete registration form showing multiple form fields working together.'
      }
    }
  }
}`},(W=(U=h.parameters)==null?void 0:U.docs)==null?void 0:W.source)})});var A,H,O;b.parameters=s(r({},b.parameters),{docs:s(r({},(A=b.parameters)==null?void 0:A.docs),{source:r({originalSource:`{
  args: {
    onSubmit: e => {
      e.preventDefault();
      alert("Message sent!");
    }
  },
  render: args => <Form {...args} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contactName" variant="required">
          Name
        </Label>
        <Input id="contactName" name="name" placeholder="Your name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contactEmail" variant="required">
          Email
        </Label>
        <Input id="contactEmail" name="email" type="email" placeholder="your.email@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject" variant="required">
          Subject
        </Label>
        <Input id="subject" name="subject" placeholder="Message subject" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" variant="required">
          Message
        </Label>
        <Textarea id="message" name="message" rows={6} placeholder="Your message" required />
      </div>
      <Button type="submit" variant="regular" fullWidth>
        Send Message
      </Button>
    </Form>,
  parameters: {
    docs: {
      description: {
        story: 'Contact form example showing a real-world use case.'
      }
    }
  }
}`},(O=(H=b.parameters)==null?void 0:H.docs)==null?void 0:O.source)})});const Te=["Default","WithError","WithSuccess","Loading","CompleteForm","RegistrationForm","ContactForm"];export{v as CompleteForm,b as ContactForm,d as Default,p as Loading,h as RegistrationForm,c as WithError,u as WithSuccess,Te as __namedExportsOrder,Me as default};
