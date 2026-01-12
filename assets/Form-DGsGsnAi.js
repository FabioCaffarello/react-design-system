var w=Object.defineProperty,I=Object.defineProperties;var B=Object.getOwnPropertyDescriptors;var c=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,N=Object.prototype.propertyIsEnumerable;var j=(e,o,r)=>o in e?w(e,o,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[o]=r,x=(e,o)=>{for(var r in o||(o={}))y.call(o,r)&&j(e,r,o[r]);if(c)for(var r of c(o))N.call(o,r)&&j(e,r,o[r]);return e},h=(e,o)=>I(e,B(o));var f=(e,o)=>{var r={};for(var t in e)y.call(e,t)&&o.indexOf(t)<0&&(r[t]=e[t]);if(e!=null&&c)for(var t of c(e))o.indexOf(t)<0&&N.call(e,t)&&(r[t]=e[t]);return r};var V=(e,o,r)=>new Promise((t,s)=>{var p=n=>{try{d(r.next(n))}catch(u){s(u)}},l=n=>{try{d(r.throw(n))}catch(u){s(u)}},d=n=>n.done?t(n.value):Promise.resolve(n.value).then(p,l);d((r=r.apply(e,o)).next())});import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as U}from"./iframe-38FCFUQv.js";const D=U.createContext(void 0);function k({form:e,loading:o=!1,children:r}){const t={form:e,loading:o};return a.jsx(D.Provider,{value:t,children:r})}k.__docgenInfo={description:`FormProvider Component

Provides react-hook-form context to form children.
Used internally by Form component when react-hook-form is integrated.`,methods:[],displayName:"FormProvider",props:{form:{required:!1,tsType:{name:"UseFormReturn",elements:[{name:"TFieldValues"}],raw:"UseFormReturn<TFieldValues>"},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};function H(d){var n=d,{children:e,onSubmit:o,loading:r=!1,error:t=null,success:s=null,className:p=""}=n,l=f(n,["children","onSubmit","loading","error","success","className"]);const F=[...["space-y-4"],p].filter(Boolean).join(" ");if("form"in l&&l.form!==void 0){const v=l,{form:i,onSubmit:R,onSubmitError:m}=v,C=f(v,["form","onSubmit","onSubmitError"]),T=i.handleSubmit(b=>V(null,null,function*(){try{yield R(b)}catch(_){m==null||m(_)}}),b=>{m==null||m(b)});return a.jsx(k,{form:i,loading:r,children:a.jsxs("form",h(x({className:F,onSubmit:T,noValidate:!0},C),{children:[e,t&&a.jsx("div",{role:"alert",className:"p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded",children:t}),s&&a.jsx("div",{role:"alert",className:"p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded",children:s})]}))})}const g=l.onSubmit||o,S=l,{onSubmit:z}=S,q=f(S,["onSubmit"]),P=i=>{i.preventDefault(),g&&!r&&g(i)};return a.jsxs("form",h(x({className:F,onSubmit:P,noValidate:!0},q),{children:[e,t&&a.jsx("div",{role:"alert",className:"p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded",children:t}),s&&a.jsx("div",{role:"alert",className:"p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded",children:s})]}))}H.__docgenInfo={description:`Form Component

A flexible form component that supports both simple forms and react-hook-form integration.

@example
\`\`\`tsx
// Simple form (backward compatible)
<Form onSubmit={handleSubmit} loading={isSubmitting}>
  <Input name="email" />
  <Button type="submit">Submit</Button>
</Form>

// With react-hook-form
const form = useForm({ resolver: zodResolver(schema) });
<Form form={form} onSubmit={handleSubmit}>
  <FormField name="email">
    {({ register, error }) => (
      <>
        <Input {...register('email')} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </>
    )}
  </FormField>
</Form>
\`\`\``,methods:[],displayName:"Form",props:{loading:{defaultValue:{value:"false",computed:!1},required:!1},error:{defaultValue:{value:"null",computed:!1},required:!1},success:{defaultValue:{value:"null",computed:!1},required:!1},className:{defaultValue:{value:'""',computed:!1},required:!1}}};export{H as F};
