"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7162],{6443:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var r=n(5893),o=n(1151);const s={id:"getting-started",sidebar_label:"Getting Started",title:"Getting Started"},i=void 0,a={id:"getting-started",title:"Getting Started",description:"Clone from Sources",source:"@site/docs/getting-started.md",sourceDirName:".",slug:"/getting-started",permalink:"/docs/getting-started",draft:!1,unlisted:!1,editUrl:"https://github.com/microsoft/Garnet/tree/main/website/docs/getting-started.md",tags:[],version:"current",frontMatter:{id:"getting-started",sidebar_label:"Getting Started",title:"Getting Started"},sidebar:"garnetDocSidebar",previous:{title:"About Us",permalink:"/docs/welcome/about-us"},next:{title:"Overview",permalink:"/docs/commands/overview"}},d={},l=[{value:"Clone from Sources",id:"clone-from-sources",level:2},{value:"Build the Project",id:"build-the-project",level:2},{value:"Connect using a Redis Client",id:"connect-using-a-redis-client",level:2}];function c(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...(0,o.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h2,{id:"clone-from-sources",children:"Clone from Sources"}),"\n",(0,r.jsx)(t.p,{children:"Clone the Garnet repo. Garnet is located on the main branch of that repo."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"git clone git@github.com:microsoft/Garnet.git\n"})}),"\n",(0,r.jsx)(t.h2,{id:"build-the-project",children:"Build the Project"}),"\n",(0,r.jsxs)(t.p,{children:["Make sure .NET 8 is installed, following instructions ",(0,r.jsx)(t.a,{href:"https://dotnet.microsoft.com/en-us/download",children:"here"}),". You can use either Linux or Windows; Garnet works equally well on both platforms."]}),"\n",(0,r.jsx)(t.p,{children:"Go to the root folder of the repo and build using dotnet, or open Garnet.sln and build using Visual Studio 2022 (we recommend the Preview version for the latest features). Make sure Visual Studio is up to date by checking for updates."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"cd Garnet\ndotnet restore\ndotnet build -c Release\n"})}),"\n",(0,r.jsx)(t.h1,{id:"run-our-test-suite",children:"Run our Test Suite"}),"\n",(0,r.jsx)(t.p,{children:"As a sanity check, you can run our test suite. The command to run tests in Release mode is shown below (make sure you are in the root folder of the repo)."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:'dotnet test -c Release -l "console;verbosity=detailed"\n'})}),"\n",(0,r.jsx)(t.admonition,{type:"tip",children:(0,r.jsx)(t.p,{children:"Tests that use cloud storage are skipped, unless you provide an Azure storage connection string."})}),"\n",(0,r.jsx)(t.h1,{id:"deploy-garnet-server",children:"Deploy Garnet Server"}),"\n",(0,r.jsx)(t.p,{children:"Now, you are ready to deploy the Garnet server. This is simple, run the below::"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"cd main/GarnetServer\ndotnet run -c Release --framework net8.0\n"})}),"\n",(0,r.jsx)(t.admonition,{type:"tip",children:(0,r.jsx)(t.p,{children:"By default, Garnet listens to TCP port 3278, make sure to adjust your firewall settings when you need to access the server from remote machines."})}),"\n",(0,r.jsx)(t.p,{children:"To see the configurable options and their defaults, run the below command. You can configure index size, memory size, page size, data file paths and checkpoint paths, IP address to bind to, port number to run on, etc."}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"dotnet run -c Release --framework net8.0 -- --help\n"})}),"\n",(0,r.jsxs)(t.admonition,{type:"tip",children:[(0,r.jsx)(t.p,{children:"For running the server with a smaller index size of 512MB (instead of the default), run this:"}),(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-bash",children:"dotnet run -c Release -- -i 512m\n"})})]}),"\n",(0,r.jsx)(t.h2,{id:"connect-using-a-redis-client",children:"Connect using a Redis Client"}),"\n",(0,r.jsx)(t.p,{children:"Garnet uses the RESP protocol, so you can use any Redis client in your favorite client language to\ntalk to the Garnet server. For C# applications, you can either use StackExchange.Redis or our\nown C# client, called GarnetClient."}),"\n",(0,r.jsx)(t.p,{children:"You can also use redis-cli (a part of Redis tools) to interactively issue commands to Garnet.\nOn Windows, you can either install redis-cli on WSL (Linux) or install Memurai (which compiles\nRedis for Windows) and use memurai-cli."}),"\n",(0,r.jsx)(t.p,{children:"Now you are ready to try our benchmarks!"})]})}function u(e={}){const{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>i});var r=n(7294);const o={},s=r.createContext(o);function i(e){const t=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),r.createElement(s.Provider,{value:t},e.children)}}}]);