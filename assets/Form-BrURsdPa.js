var c=Object.defineProperty,m=Object.defineProperties;var h=Object.getOwnPropertyDescriptors;var l=Object.getOwnPropertySymbols;var u=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var t=(s,e,i)=>e in s?c(s,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[e]=i,r=(s,e)=>{for(var i in e||(e={}))u.call(e,i)&&t(s,i,e[i]);if(l)for(var i of l(e))x.call(e,i)&&t(s,i,e[i]);return s},a=(s,e)=>m(s,h(e));import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as d}from"./index-4L7o7Sqz.js";import{M as p}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function o(s){const e=r(r({code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},d()),s.components);return n.jsxs(n.Fragment,{children:[n.jsx(p,{title:"Molecules/Form"}),`
`,n.jsx(e.h1,{id:"form",children:"Form"}),`
`,n.jsx(e.p,{children:"A comprehensive form wrapper component that provides validation states, error handling, success messages, and consistent layout."}),`
`,n.jsx(e.h2,{id:"features",children:"Features"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Validation States"}),": Visual feedback for error, success, and loading states"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Error Handling"}),": Global and field-level error messages"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Accessibility"}),": Full ARIA support and keyboard navigation"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Layout"}),": Consistent spacing and structure"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Loading States"}),": Built-in loading indicator support"]}),`
`]}),`
`,n.jsx(e.h2,{id:"basic-usage",children:"Basic Usage"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Form, Input, Label, Button } from '@fabio.caffarello/react-design-system';

<Form onSubmit={handleSubmit}>
  <div className="space-y-2">
    <Label htmlFor="email" variant="required">Email</Label>
    <Input id="email" name="email" type="email" required />
  </div>
  <Button type="submit">Submit</Button>
</Form>
`})}),`
`,n.jsx(e.h2,{id:"validation-states",children:"Validation States"}),`
`,n.jsx(e.h3,{id:"error-state",children:"Error State"}),`
`,n.jsx(e.p,{children:"Display global or field-level errors:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Form error="Please fix the errors below">
  {/* Form fields */}
</Form>
`})}),`
`,n.jsx(e.h3,{id:"success-state",children:"Success State"}),`
`,n.jsx(e.p,{children:"Show success messages:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Form success="Form submitted successfully!">
  {/* Form fields */}
</Form>
`})}),`
`,n.jsx(e.h3,{id:"loading-state",children:"Loading State"}),`
`,n.jsx(e.p,{children:"Indicate form submission in progress:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Form loading={isSubmitting}>
  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </Button>
</Form>
`})}),`
`,n.jsx(e.h2,{id:"field-level-validation",children:"Field-Level Validation"}),`
`,n.jsx(e.p,{children:"Use individual field components with error states:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Input, ErrorMessage } from '@fabio.caffarello/react-design-system';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    error={!!errors.email}
    helperText={errors.email}
  />
  {errors.email && (
    <ErrorMessage>{errors.email}</ErrorMessage>
  )}
</div>
`})}),`
`,n.jsx(e.h2,{id:"form-layout",children:"Form Layout"}),`
`,n.jsx(e.p,{children:"The Form component provides consistent spacing:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Form className="max-w-md space-y-4">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>
  <Button type="submit">Submit</Button>
</Form>
`})}),`
`,n.jsx(e.h2,{id:"integration-with-react-hook-form",children:"Integration with React Hook Form"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useForm } from 'react-hook-form';
import { Form, Input, Label, Button } from '@fabio.caffarello/react-design-system';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          {...register('email', { required: 'Email is required' })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </div>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"accessibility",children:"Accessibility"}),`
`,n.jsx(e.p,{children:"The Form component ensures accessibility:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Proper form structure with ",n.jsx(e.code,{children:'role="form"'})]}),`
`,n.jsx(e.li,{children:"ARIA labels and descriptions"}),`
`,n.jsxs(e.li,{children:["Error messages associated with fields via ",n.jsx(e.code,{children:"aria-describedby"})]}),`
`,n.jsx(e.li,{children:"Keyboard navigation support"}),`
`,n.jsx(e.li,{children:"Focus management"}),`
`]}),`
`,n.jsx(e.h3,{id:"best-practices",children:"Best Practices"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Labels"}),": Always provide labels for form fields"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Error Messages"}),": Associate error messages with fields"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Required Fields"}),": Clearly indicate required fields"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Loading States"}),": Provide feedback during submission"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Validation"}),": Validate on both client and server side"]}),`
`]})]})}function L(s={}){const{wrapper:e}=r(r({},d()),s.components);return e?n.jsx(e,a(r({},s),{children:n.jsx(o,r({},s))})):o(s)}export{L as default};
