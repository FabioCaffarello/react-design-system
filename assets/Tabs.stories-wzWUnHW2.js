var E=Object.defineProperty,M=Object.defineProperties;var k=Object.getOwnPropertyDescriptors;var T=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var p=(r,t,l)=>t in r?E(r,t,{enumerable:!0,configurable:!0,writable:!0,value:l}):r[t]=l,n=(r,t)=>{for(var l in t||(t={}))D.call(t,l)&&p(r,l,t[l]);if(T)for(var l of T(t))O.call(t,l)&&p(r,l,t[l]);return r},i=(r,t)=>M(r,k(t));import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{R as I}from"./iframe-38FCFUQv.js";import{T as e}from"./Tabs-DSv1xSbq.js";import{C as s}from"./Card-Dt4JI1Iu.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";import"./spacing-Bf5iY5pu.js";import"./typography-BGNr2Ph4.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";const U={title:"Molecules/Tabs",component:e,parameters:{docs:{description:{component:"A flexible tabs component with compound components pattern. Supports horizontal and vertical orientations, automatic and manual activation modes. Fully accessible with ARIA attributes and keyboard navigation."}}},tags:["autodocs"],argTypes:{defaultValue:{control:"text",description:"Default active tab value"},value:{control:"text",description:"Controlled active tab value"},orientation:{control:"select",options:["horizontal","vertical"],description:"Orientation of the tabs"},activationMode:{control:"select",options:["automatic","manual"],description:"Activation mode: automatic (on focus) or manual (on Enter/Space)"}}},o={render:()=>a.jsxs(e,{defaultValue:"tab1",children:[a.jsxs(e.List,{children:[a.jsx(e.Trigger,{value:"tab1",children:"Overview"}),a.jsx(e.Trigger,{value:"tab2",children:"Settings"}),a.jsx(e.Trigger,{value:"tab3",children:"Billing"})]}),a.jsx(e.Content,{value:"tab1",children:a.jsxs(s,{className:"p-4",children:[a.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Overview"}),a.jsx("p",{children:"This is the overview content. Here you can see a summary of your account."})]})}),a.jsx(e.Content,{value:"tab2",children:a.jsxs(s,{className:"p-4",children:[a.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Settings"}),a.jsx("p",{children:"Manage your account settings and preferences here."})]})}),a.jsx(e.Content,{value:"tab3",children:a.jsxs(s,{className:"p-4",children:[a.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Billing"}),a.jsx("p",{children:"View and manage your billing information and subscription."})]})})]})},c={render:()=>a.jsxs("div",{className:"flex gap-4",children:[a.jsx(e,{defaultValue:"tab1",orientation:"vertical",children:a.jsxs(e.List,{children:[a.jsx(e.Trigger,{value:"tab1",children:"Profile"}),a.jsx(e.Trigger,{value:"tab2",children:"Security"}),a.jsx(e.Trigger,{value:"tab3",children:"Notifications"})]})}),a.jsx("div",{className:"flex-1",children:a.jsxs(e,{defaultValue:"tab1",orientation:"vertical",children:[a.jsx(e.Content,{value:"tab1",children:a.jsxs(s,{className:"p-4",children:[a.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Profile"}),a.jsx("p",{children:"Edit your profile information and preferences."})]})}),a.jsx(e.Content,{value:"tab2",children:a.jsxs(s,{className:"p-4",children:[a.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Security"}),a.jsx("p",{children:"Manage your security settings and passwords."})]})}),a.jsx(e.Content,{value:"tab3",children:a.jsxs(s,{className:"p-4",children:[a.jsx("h3",{className:"text-lg font-semibold mb-2",children:"Notifications"}),a.jsx("p",{children:"Configure your notification preferences."})]})})]})})]})},b={render:()=>a.jsxs(e,{defaultValue:"tab1",activationMode:"manual",children:[a.jsxs(e.List,{children:[a.jsx(e.Trigger,{value:"tab1",children:"Tab 1"}),a.jsx(e.Trigger,{value:"tab2",children:"Tab 2"}),a.jsx(e.Trigger,{value:"tab3",children:"Tab 3"})]}),a.jsx(e.Content,{value:"tab1",children:a.jsx(s,{className:"p-4",children:a.jsx("p",{children:"Tab 1 content. In manual mode, tabs only activate on Enter/Space, not on focus."})})}),a.jsx(e.Content,{value:"tab2",children:a.jsx(s,{className:"p-4",children:a.jsx("p",{children:"Tab 2 content."})})}),a.jsx(e.Content,{value:"tab3",children:a.jsx(s,{className:"p-4",children:a.jsx("p",{children:"Tab 3 content."})})})]}),parameters:{docs:{description:{story:"In manual activation mode, tabs only activate when Enter or Space is pressed, not on focus."}}}},d={render:()=>a.jsxs(e,{defaultValue:"tab1",children:[a.jsxs(e.List,{children:[a.jsx(e.Trigger,{value:"tab1",children:"Active"}),a.jsx(e.Trigger,{value:"tab2",disabled:!0,children:"Disabled"}),a.jsx(e.Trigger,{value:"tab3",children:"Available"})]}),a.jsx(e.Content,{value:"tab1",children:a.jsx(s,{className:"p-4",children:a.jsx("p",{children:"This is the active tab content."})})}),a.jsx(e.Content,{value:"tab2",children:a.jsx(s,{className:"p-4",children:a.jsx("p",{children:"This tab is disabled and should not be accessible."})})}),a.jsx(e.Content,{value:"tab3",children:a.jsx(s,{className:"p-4",children:a.jsx("p",{children:"This is another available tab."})})})]})},u={render:()=>{const[r,t]=I.useState("tab1");return a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{className:"flex gap-2",children:[a.jsx("button",{onClick:()=>t("tab1"),className:"px-3 py-1 bg-gray-200 rounded",children:"Set Tab 1"}),a.jsx("button",{onClick:()=>t("tab2"),className:"px-3 py-1 bg-gray-200 rounded",children:"Set Tab 2"}),a.jsx("button",{onClick:()=>t("tab3"),className:"px-3 py-1 bg-gray-200 rounded",children:"Set Tab 3"})]}),a.jsxs(e,{value:r,onValueChange:t,children:[a.jsxs(e.List,{children:[a.jsx(e.Trigger,{value:"tab1",children:"Tab 1"}),a.jsx(e.Trigger,{value:"tab2",children:"Tab 2"}),a.jsx(e.Trigger,{value:"tab3",children:"Tab 3"})]}),a.jsx(e.Content,{value:"tab1",children:a.jsx(s,{className:"p-4",children:a.jsxs("p",{children:["Controlled tab 1 content. Active tab: ",r]})})}),a.jsx(e.Content,{value:"tab2",children:a.jsx(s,{className:"p-4",children:a.jsxs("p",{children:["Controlled tab 2 content. Active tab: ",r]})})}),a.jsx(e.Content,{value:"tab3",children:a.jsx(s,{className:"p-4",children:a.jsxs("p",{children:["Controlled tab 3 content. Active tab: ",r]})})})]})]})},parameters:{docs:{description:{story:"Example of controlled tabs where the active tab is managed externally."}}}};var m,g,v;o.parameters=i(n({},o.parameters),{docs:i(n({},(m=o.parameters)==null?void 0:m.docs),{source:n({originalSource:`{
  render: () => <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Settings</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Overview</h3>
          <p>This is the overview content. Here you can see a summary of your account.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Settings</h3>
          <p>Manage your account settings and preferences here.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Billing</h3>
          <p>View and manage your billing information and subscription.</p>
        </Card>
      </Tabs.Content>
    </Tabs>
}`},(v=(g=o.parameters)==null?void 0:g.docs)==null?void 0:v.source)})});var h,x,C;c.parameters=i(n({},c.parameters),{docs:i(n({},(h=c.parameters)==null?void 0:h.docs),{source:n({originalSource:`{
  render: () => <div className="flex gap-4">
      <Tabs defaultValue="tab1" orientation="vertical">
        <Tabs.List>
          <Tabs.Trigger value="tab1">Profile</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Security</Tabs.Trigger>
          <Tabs.Trigger value="tab3">Notifications</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
      <div className="flex-1">
        <Tabs defaultValue="tab1" orientation="vertical">
          <Tabs.Content value="tab1">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              <p>Edit your profile information and preferences.</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Security</h3>
              <p>Manage your security settings and passwords.</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <p>Configure your notification preferences.</p>
            </Card>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
}`},(C=(x=c.parameters)==null?void 0:x.docs)==null?void 0:C.source)})});var j,f,N;b.parameters=i(n({},b.parameters),{docs:i(n({},(j=b.parameters)==null?void 0:j.docs),{source:n({originalSource:`{
  render: () => <Tabs defaultValue="tab1" activationMode="manual">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <p>Tab 1 content. In manual mode, tabs only activate on Enter/Space, not on focus.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <p>Tab 2 content.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <p>Tab 3 content.</p>
        </Card>
      </Tabs.Content>
    </Tabs>,
  parameters: {
    docs: {
      description: {
        story: 'In manual activation mode, tabs only activate when Enter or Space is pressed, not on focus.'
      }
    }
  }
}`},(N=(f=b.parameters)==null?void 0:f.docs)==null?void 0:N.source)})});var y,S,A;d.parameters=i(n({},d.parameters),{docs:i(n({},(y=d.parameters)==null?void 0:y.docs),{source:n({originalSource:`{
  render: () => <Tabs defaultValue="tab1">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Active</Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled>
          Disabled
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3">Available</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <Card className="p-4">
          <p>This is the active tab content.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <Card className="p-4">
          <p>This tab is disabled and should not be accessible.</p>
        </Card>
      </Tabs.Content>
      <Tabs.Content value="tab3">
        <Card className="p-4">
          <p>This is another available tab.</p>
        </Card>
      </Tabs.Content>
    </Tabs>
}`},(A=(S=d.parameters)==null?void 0:S.docs)==null?void 0:A.source)})});var V,w,L;u.parameters=i(n({},u.parameters),{docs:i(n({},(V=u.parameters)==null?void 0:V.docs),{source:n({originalSource:`{
  render: () => {
    const [activeTab, setActiveTab] = React.useState('tab1');
    return <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('tab1')} className="px-3 py-1 bg-gray-200 rounded">
            Set Tab 1
          </button>
          <button onClick={() => setActiveTab('tab2')} className="px-3 py-1 bg-gray-200 rounded">
            Set Tab 2
          </button>
          <button onClick={() => setActiveTab('tab3')} className="px-3 py-1 bg-gray-200 rounded">
            Set Tab 3
          </button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <Card className="p-4">
              <p>Controlled tab 1 content. Active tab: {activeTab}</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <Card className="p-4">
              <p>Controlled tab 2 content. Active tab: {activeTab}</p>
            </Card>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <Card className="p-4">
              <p>Controlled tab 3 content. Active tab: {activeTab}</p>
            </Card>
          </Tabs.Content>
        </Tabs>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of controlled tabs where the active tab is managed externally.'
      }
    }
  }
}`},(L=(w=u.parameters)==null?void 0:w.docs)==null?void 0:L.source)})});const X=["Default","Vertical","ManualActivation","WithDisabledTab","Controlled"];export{u as Controlled,o as Default,b as ManualActivation,c as Vertical,d as WithDisabledTab,X as __namedExportsOrder,U as default};
