var d=Object.defineProperty,h=Object.defineProperties;var x=Object.getOwnPropertyDescriptors;var a=Object.getOwnPropertySymbols;var g=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;var t=(s,n,i)=>n in s?d(s,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[n]=i,l=(s,n)=>{for(var i in n||(n={}))g.call(n,i)&&t(s,i,n[i]);if(a)for(var i of a(n))u.call(n,i)&&t(s,i,n[i]);return s},r=(s,n)=>h(s,x(n));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as c}from"./index-4L7o7Sqz.js";import{M as j}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function o(s){const n=l(l({code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},c()),s.components);return e.jsxs(e.Fragment,{children:[e.jsx(j,{title:"Organisms/Table"}),`
`,e.jsx(n.h1,{id:"table",children:"Table"}),`
`,e.jsx(n.p,{children:"A powerful and flexible table component with sorting, filtering, pagination, and responsive design capabilities."}),`
`,e.jsx(n.h2,{id:"features",children:"Features"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Sorting"}),": Click column headers to sort data"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Loading States"}),": Built-in loading skeleton"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Custom Rendering"}),": Customize cell rendering with render functions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Responsive"}),": Adapts to different screen sizes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Accessible"}),": Full ARIA support and keyboard navigation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Pagination"}),": Built-in pagination support"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Actions"}),": Row-level actions support"]}),`
`]}),`
`,e.jsx(n.h2,{id:"basic-usage",children:"Basic Usage"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Table } from '@fabio.caffarello/react-design-system';

const data = [
  { id: '1', name: 'Item 1', status: 'Active' },
  { id: '2', name: 'Item 2', status: 'Inactive' },
];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
];

<Table columns={columns} data={data} />
`})}),`
`,e.jsx(n.h2,{id:"sorting",children:"Sorting"}),`
`,e.jsxs(n.p,{children:["Enable sorting by providing a ",e.jsx(n.code,{children:"sortable"})," property on columns:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

<Table 
  columns={columns} 
  data={data}
  onSort={(key, direction) => {
    // Handle sorting
  }}
/>
`})}),`
`,e.jsx(n.h2,{id:"custom-cell-rendering",children:"Custom Cell Rendering"}),`
`,e.jsxs(n.p,{children:["Customize how cells are rendered using the ",e.jsx(n.code,{children:"render"})," function:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns = [
  { 
    key: 'status', 
    label: 'Status',
    render: (value, row) => (
      <Badge variant={value === 'Active' ? 'success' : 'default'}>
        {value}
      </Badge>
    )
  },
];
`})}),`
`,e.jsx(n.h2,{id:"loading-state",children:"Loading State"}),`
`,e.jsx(n.p,{children:"Show a loading skeleton while data is being fetched:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Table 
  columns={columns} 
  data={data}
  loading={true}
/>
`})}),`
`,e.jsx(n.h2,{id:"pagination",children:"Pagination"}),`
`,e.jsx(n.p,{children:"Integrate with pagination components:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Table, TablePagination } from '@fabio.caffarello/react-design-system';

<>
  <Table columns={columns} data={currentPageData} />
  <TablePagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={setPage}
  />
</>
`})}),`
`,e.jsx(n.h2,{id:"actions",children:"Actions"}),`
`,e.jsx(n.p,{children:"Add row-level actions:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Table, TableActions } from '@fabio.caffarello/react-design-system';

<Table
  columns={columns}
  data={data}
  actions={(row) => (
    <TableActions
      items={[
        { label: 'Edit', onClick: () => handleEdit(row) },
        { label: 'Delete', onClick: () => handleDelete(row) },
      ]}
    />
  )}
/>
`})}),`
`,e.jsx(n.h2,{id:"accessibility",children:"Accessibility"}),`
`,e.jsx(n.p,{children:"The Table component follows ARIA best practices:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Uses ",e.jsx(n.code,{children:'role="table"'})," for the table element"]}),`
`,e.jsxs(n.li,{children:["Uses ",e.jsx(n.code,{children:'role="columnheader"'})," for sortable headers"]}),`
`,e.jsxs(n.li,{children:["Provides ",e.jsx(n.code,{children:"aria-sort"})," attributes for sort state"]}),`
`,e.jsx(n.li,{children:"Supports keyboard navigation"}),`
`,e.jsxs(n.li,{children:["Associates headers with cells via ",e.jsx(n.code,{children:"aria-labelledby"})]}),`
`]}),`
`,e.jsx(n.h3,{id:"keyboard-navigation",children:"Keyboard Navigation"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tab"}),": Navigate between interactive elements"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Enter/Space"}),": Activate sortable column headers"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Arrow Keys"}),": Navigate between cells (when implemented)"]}),`
`]}),`
`,e.jsx(n.h2,{id:"responsive-design",children:"Responsive Design"}),`
`,e.jsx(n.p,{children:"The table automatically adapts to smaller screens:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"On mobile, consider using a card-based layout"}),`
`,e.jsx(n.li,{children:"Horizontal scrolling is available for wide tables"}),`
`,e.jsx(n.li,{children:"Use responsive column visibility"}),`
`]}),`
`,e.jsx(n.h2,{id:"best-practices",children:"Best Practices"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Column Keys"}),": Always use unique, stable keys for columns"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Data Structure"}),": Keep data structure consistent across rows"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Performance"}),": For large datasets, implement virtual scrolling"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Accessibility"}),": Always provide accessible labels and descriptions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Loading States"}),": Always show loading states for async data"]}),`
`]})]})}function T(s={}){const{wrapper:n}=l(l({},c()),s.components);return n?e.jsx(n,r(l({},s),{children:e.jsx(o,l({},s))})):o(s)}export{T as default};
