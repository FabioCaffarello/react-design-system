var o=Object.defineProperty,h=Object.defineProperties;var x=Object.getOwnPropertyDescriptors;var t=Object.getOwnPropertySymbols;var u=Object.prototype.hasOwnProperty,j=Object.prototype.propertyIsEnumerable;var i=(a,e,l)=>e in a?o(a,e,{enumerable:!0,configurable:!0,writable:!0,value:l}):a[e]=l,s=(a,e)=>{for(var l in e||(e={}))u.call(e,l)&&i(a,l,e[l]);if(t)for(var l of t(e))j.call(e,l)&&i(a,l,e[l]);return a},r=(a,e)=>h(a,x(e));import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as c}from"./index-4L7o7Sqz.js";import{M as p}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function d(a){const e=s(s({code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},c()),a.components);return n.jsxs(n.Fragment,{children:[n.jsx(p,{title:"Molecules/DatePicker"}),`
`,n.jsx(e.h1,{id:"datepicker",children:"DatePicker"}),`
`,n.jsx(e.p,{children:"A flexible date picker component with single date and range selection. Supports keyboard navigation, date validation, and basic localization."}),`
`,n.jsx(e.h2,{id:"features",children:"Features"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Single Date Selection"}),": Pick a single date"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Range Selection"}),": Select date ranges"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Keyboard Navigation"}),": Full keyboard support"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Date Validation"}),": Min/max dates and disabled dates"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Custom Formatting"}),": Flexible date format options"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Accessibility"}),": Full ARIA support"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Compound Components"}),": Flexible API"]}),`
`]}),`
`,n.jsx(e.h2,{id:"basic-usage",children:"Basic Usage"}),`
`,n.jsx(e.h3,{id:"single-date",children:"Single Date"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useState } from 'react';
import { DatePicker } from '@fabio.caffarello/react-design-system';

function MyComponent() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePicker
      value={date || undefined}
      onValueChange={(value) => setDate(value as Date | null)}
      placeholder="Select a date"
    />
  );
}
`})}),`
`,n.jsx(e.h3,{id:"date-range",children:"Date Range"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useState } from 'react';
import { DatePicker } from '@fabio.caffarello/react-design-system';

function MyComponent() {
  const [range, setRange] = useState<{ start: Date | null; end: Date | null } | null>(null);

  return (
    <DatePicker
      mode="range"
      value={range || undefined}
      onValueChange={(value) => setRange(value as { start: Date | null; end: Date | null } | null)}
      placeholder="Select date range"
    />
  );
}
`})}),`
`,n.jsx(e.h2,{id:"date-validation",children:"Date Validation"}),`
`,n.jsx(e.h3,{id:"minmax-dates",children:"Min/Max Dates"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<DatePicker
  minDate={new Date()} // Only future dates
  maxDate={new Date(2024, 11, 31)} // Until end of 2024
/>
`})}),`
`,n.jsx(e.h3,{id:"disabled-dates",children:"Disabled Dates"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const disabledDates = [
  new Date(2024, 0, 1), // New Year's Day
  new Date(2024, 6, 4), // Independence Day
];

<DatePicker disabledDates={disabledDates} />
`})}),`
`,n.jsx(e.h2,{id:"custom-formatting",children:"Custom Formatting"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ISO format (default)
<DatePicker format="yyyy-MM-dd" />

// US format
<DatePicker format="MM/dd/yyyy" />

// European format
<DatePicker format="dd/MM/yyyy" />
`})}),`
`,n.jsx(e.h2,{id:"controlled-vs-uncontrolled",children:"Controlled vs Uncontrolled"}),`
`,n.jsx(e.h3,{id:"controlled",children:"Controlled"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const [date, setDate] = useState<Date | null>(null);

<DatePicker
  value={date || undefined}
  onValueChange={(value) => setDate(value as Date | null)}
/>
`})}),`
`,n.jsx(e.h3,{id:"uncontrolled",children:"Uncontrolled"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<DatePicker
  defaultValue={new Date()}
  onValueChange={(value) => console.log(value)}
/>
`})}),`
`,n.jsx(e.h2,{id:"compound-components-api",children:"Compound Components API"}),`
`,n.jsx(e.p,{children:"For more control, use the compound components:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<DatePicker>
  <DatePicker.Input placeholder="Select date" />
  <DatePicker.Calendar />
</DatePicker>
`})}),`
`,n.jsx(e.h2,{id:"keyboard-navigation",children:"Keyboard Navigation"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Arrow Keys"}),": Navigate between dates"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Enter/Space"}),": Select focused date"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Escape"}),": Close calendar"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Tab"}),": Navigate between input and calendar"]}),`
`]}),`
`,n.jsx(e.h2,{id:"accessibility",children:"Accessibility"}),`
`,n.jsx(e.p,{children:"The DatePicker component includes:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:'role="dialog"'})," on calendar popup"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"aria-label"})," on input"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"aria-label"})," on calendar button"]}),`
`,n.jsx(e.li,{children:"Keyboard navigation support"}),`
`,n.jsx(e.li,{children:"Screen reader announcements"}),`
`]}),`
`,n.jsx(e.h3,{id:"best-practices",children:"Best Practices"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Provide aria-label"}),": Always provide an accessible label"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Date validation"}),": Use min/max dates to prevent invalid selections"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Format consistency"}),": Use consistent date formats across your app"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Keyboard support"}),": Ensure all functionality is keyboard accessible"]}),`
`]})]})}function P(a={}){const{wrapper:e}=s(s({},c()),a.components);return e?n.jsx(e,r(s({},a),{children:n.jsx(d,s({},a))})):d(a)}export{P as default};
