"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2359],{1185:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>l,frontMatter:()=>r,metadata:()=>a,toc:()=>d});var i=t(5893),s=t(1151);const r={id:"transactions",sidebar_label:"Transactions",title:"Transactions"},o="Transactions",a={id:"dev/transactions",title:"Transactions",description:"Garnet supports two types of transactions:",source:"@site/docs/dev/transactions.md",sourceDirName:"dev",slug:"/dev/transactions",permalink:"/docs/dev/transactions",draft:!1,unlisted:!1,editUrl:"https://github.com/microsoft/Garnet/tree/main/website/docs/dev/transactions.md",tags:[],version:"current",frontMatter:{id:"transactions",sidebar_label:"Transactions",title:"Transactions"},sidebar:"garnetDocSidebar",previous:{title:"Locking",permalink:"/docs/dev/tsavorite/locking"},next:{title:"Custom Commands",permalink:"/docs/dev/custom-commands"}},c={},d=[{value:"Redis Transactions",id:"redis-transactions",level:2},{value:"An example:",id:"an-example",level:3},{value:"Transaction Backend",id:"transaction-backend",level:2},{value:"TransactionManager Class Responsibilities",id:"transactionmanager-class-responsibilities",level:2},{value:"Storing the state of Transaction:",id:"storing-the-state-of-transaction",level:3},{value:"Queueing Commands:",id:"queueing-commands",level:3},{value:"Execution",id:"execution",level:3},{value:"Recovery Optimization",id:"recovery-optimization",level:2},{value:"Version Map",id:"version-map",level:2},{value:"Modified API in TsavoriteKV:",id:"modified-api-in-tsavoritekv",level:2},{value:"Watch",id:"watch-1",level:3},{value:"Unwatch:",id:"unwatch",level:3},{value:"Custom Server-side Transactions",id:"custom-server-side-transactions",level:2},{value:"Developing custom server side transactions",id:"developing-custom-server-side-transactions",level:3},{value:"Execution",id:"execution-1",level:3}];function h(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.h1,{id:"transactions",children:"Transactions"}),"\n",(0,i.jsx)(n.p,{children:"Garnet supports two types of transactions:"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsx)(n.li,{children:"Redis Transactions"}),"\n",(0,i.jsx)(n.li,{children:"Custom Server-side Transactions"}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"redis-transactions",children:"Redis Transactions"}),"\n",(0,i.jsxs)(n.p,{children:["You can read more here: ",(0,i.jsx)(n.a,{href:"https://redis.io/docs/manual/transactions",children:"Redis Transactions"}),".\nIn this design, transaction operations come in a MULTI/EXEC scope. Every operation in this scope will be part of the transaction and have full ACID properties. The implementation follows the Optimistic Concurrency design that Redis has. It does not allow you to use the result of reads inside the MULTI/EXEC scope but allows you to read and monitor keys before, and if they are unchanged at the time of execution, the transaction will commit."]}),"\n",(0,i.jsx)(n.h3,{id:"an-example",children:"An example:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"WATCH mykey\nval = GET mykey\nval = val + 1 # not Redis command this happens outside\nMULTI\nSET mykey $val\nEXEC\n"})}),"\n",(0,i.jsxs)(n.p,{children:["In the above example, if ",(0,i.jsx)(n.strong,{children:"mykey"})," changes before ",(0,i.jsx)(n.strong,{children:"EXEC"})," command, the transaction will abort since the calculation of ",(0,i.jsx)(n.em,{children:"val"})," is invalidated."]}),"\n",(0,i.jsx)(n.h2,{id:"transaction-backend",children:"Transaction Backend"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.p,{children:"Transactions in Garnet are implemented using the following classes:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"TransactionManager"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"WatchVersionMap"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"WatchedKeyContainer"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"RespCommandsInfo"})}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"transactionmanager-class-responsibilities",children:"TransactionManager Class Responsibilities"}),"\n",(0,i.jsx)(n.h3,{id:"storing-the-state-of-transaction",children:"Storing the state of Transaction:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Started"}),": Goes to this state after ",(0,i.jsx)(n.code,{children:"MULTI"})," command, TxnManager will queue any command in this state except EXEC"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Running"}),": Goes to this state after EXEC, TxnManager will run the queued commands in this state"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Aborted"}),": Goes to this state in case of anything bad happens"]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"queueing-commands",children:"Queueing Commands:"}),"\n",(0,i.jsxs)(n.p,{children:["When TxnManager goes to ",(0,i.jsx)(n.em,{children:"Started"})," state, it will (1) queue any command afterward and (2) save any key that is used in those commands to lock at the execution time using 2PL.\nIn order to queue commands, they are ",(0,i.jsx)(n.strong,{children:"let to live in the network buffer"}),". Using the ",(0,i.jsx)(n.code,{children:"TrySkip"})," function in ",(0,i.jsx)(n.code,{children:"RespServerSession"}),". To lock the keys at the time of execution, we save pointers to the actual memory location of keys in the network buffer using an array of ",(0,i.jsx)(n.code,{children:"TxnKeyEntry"})," that has an ",(0,i.jsx)(n.code,{children:"ArgSlice"})," and the lock type (Shared or Exclusive)."]}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"TrySkip"})," function uses ",(0,i.jsx)(n.code,{children:"RespCommandsInfo"})," class to skip the correct number of tokens and detects syntax errors. ",(0,i.jsx)(n.code,{children:"RespCommandsinfo"})," stores the number of ",(0,i.jsx)(n.code,{children:"Arity"})," or arguments of each command. E.g., the ",(0,i.jsx)(n.code,{children:"GET"})," command's arity is two. The command token ",(0,i.jsx)(n.code,{children:"GET"})," and one key. We store the minimum number of arguments with a negative value for the commands that can have multiple arguments. ",(0,i.jsx)(n.code,{children:"SET"})," command's arity is  -3 means that it requires at least three arguments (including command toke)."]}),"\n",(0,i.jsxs)(n.p,{children:["During the ",(0,i.jsx)(n.code,{children:"TrySkip"})," we call ",(0,i.jsx)(n.code,{children:"TransactionManager.GetKeys"}),", which goes over the arguments and stores ",(0,i.jsx)(n.code,{children:"TxnKeyEntry"})," for each key in the arguments."]}),"\n",(0,i.jsx)(n.h3,{id:"execution",children:"Execution"}),"\n",(0,i.jsxs)(n.p,{children:["When the the ",(0,i.jsx)(n.code,{children:"TxnState"})," is ",(0,i.jsx)(n.em,{children:"Started"})," and we encounter the ",(0,i.jsx)(n.code,{children:"EXEC"})," we call ",(0,i.jsx)(n.code,{children:"TransactionManager.Run()"}),". What this functions does:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["first acquires the ",(0,i.jsx)(n.code,{children:"LockableContext"})," for the main store and/or object store based on the store type."]}),"\n",(0,i.jsxs)(n.li,{children:["Goes over ",(0,i.jsx)(n.code,{children:"TxnKeyEntry"}),"s and locks all the needed keys."]}),"\n",(0,i.jsxs)(n.li,{children:["Calls ",(0,i.jsx)(n.code,{children:"WatchedKeyContainer.ValidateWatchVersion()"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"It goes over all the watched keys and checks whether their version is the same as the time watch or not"}),"\n",(0,i.jsxs)(n.li,{children:["if it passes, we proceed with execution otherwise, we call ",(0,i.jsx)(n.code,{children:"TransactionManager.Reset(true)"})," to reset the transaction manager. The ",(0,i.jsx)(n.code,{children:"true"})," argument we pass to ",(0,i.jsx)(n.code,{children:"Reset"})," says that it also needs to unlock the keys."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.li,{children:"It writes the transaction start indicator in the AOF to recover atomically in case of failure in the middle of the transaction"}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["After that, the TxnState is set to ",(0,i.jsx)(n.em,{children:"Running"})," and the network ",(0,i.jsx)(n.code,{children:"readHead"})," is set to the first command after ",(0,i.jsx)(n.code,{children:"MULTI"}),", and this time we start actually running those commands. When the execution reaches to EXEC again, and we are in ",(0,i.jsx)(n.em,{children:"Running"})," state, it calls ",(0,i.jsx)(n.code,{children:"TransactionManager.Commit()"}),". What it does:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["Unlock all the keys that we locked in ",(0,i.jsx)(n.code,{children:"Run"})]}),"\n",(0,i.jsxs)(n.li,{children:["Reset ",(0,i.jsx)(n.code,{children:"TransactionManager"})," and ",(0,i.jsx)(n.code,{children:"WatchedKeyContainer"})]}),"\n",(0,i.jsx)(n.li,{children:"It also appends the commit message to the AOF"}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"recovery-optimization",children:"Recovery Optimization"}),"\n",(0,i.jsx)(n.p,{children:"Garnet does regular checkpoints and changes its version between those checkpoints. In order to get checkpoint consistency, we require transaction operations to have the same version or in other words be in the same checkpoint window."}),"\n",(0,i.jsx)(n.p,{children:"To enforce this right now, we do the following:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["When TsavoriteStateMachine is in ",(0,i.jsx)(n.code,{children:"Prepare"})," phase, we do not let a transaction start execution to let checkpoint finish"]}),"\n",(0,i.jsxs)(n.li,{children:["If there is a running transaction and TsavoriteStateMachine moves to ",(0,i.jsx)(n.code,{children:"Prepare"})," we don't let version change happen until the transaction finishes the execution."]}),"\n",(0,i.jsxs)(n.li,{children:["These two happen using ",(0,i.jsx)(n.code,{children:"session.IsInPreparePhase"})," and two while loop at the beginning of ",(0,i.jsx)(n.code,{children:"Run"})," function"]}),"\n"]}),"\n",(0,i.jsx)(n.h1,{id:"watch",children:"Watch"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.p,{children:"It is used to implement optimistic locking."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"Provide a check-and-set (CAS) behavior to transactions."}),"\n",(0,i.jsx)(n.li,{children:"Keys are monitored in order to detect changes against them."}),"\n",(0,i.jsx)(n.li,{children:"If at least one watched key is modified before the EXEC  command, the whole transaction aborts"}),"\n",(0,i.jsxs)(n.li,{children:["It is implemented through a ",(0,i.jsx)(n.code,{children:"Modified"})," bit in ",(0,i.jsx)(n.code,{children:"TsavoriteKV"})," and a ",(0,i.jsx)(n.strong,{children:(0,i.jsx)(n.code,{children:"VersionMap"})})," in ",(0,i.jsx)(n.code,{children:"Garnet"})]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"version-map",children:"Version Map"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.p,{children:"It Monitors modifications on the keys. Every time a watched key gets modified, we increment its version in the version map."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["It has been implemented through a ",(0,i.jsx)(n.code,{children:"Hash Index"})]}),"\n",(0,i.jsxs)(n.li,{children:["To prevent the overhead for normal operations in the critical path we only increment the version in some cases:","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["For in-memory records, we only increment version ",(0,i.jsx)(n.strong,{children:"watched keys"}),". The keys that are watched in Garnet use the ",(0,i.jsx)(n.code,{children:"Modified"})," bit in Tsavorite to track modification (more on Modified bit Below)"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["For records in the disk, we increment the version for ",(0,i.jsx)(n.strong,{children:"copy-update"})," RMWs and Upserts. ",(0,i.jsx)(n.strong,{children:"We intentionally accept this overhead because copy updates are less often, and the overhead is not crucial."})]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Increment the version in ",(0,i.jsx)(n.code,{children:"MainStoreFunctions"})," and ",(0,i.jsx)(n.code,{children:"ObjectStoreFunctions"}),":"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"InPlaceUpdater"})," if it is watched"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"ConcurrentWriter"})," if it is watched"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"ConcurrentDeleter"})," if it is watched"]}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"PostSingleWriter"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"PostInitialUpdater"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"PostCopyUpdater"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"PostSingleDeleter"})}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"modified-api-in-tsavoritekv",children:"Modified API in TsavoriteKV:"}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsxs)(n.p,{children:['Modified bit tracks modifications in records in Tsavorite. The modified bit for each record gets set to "1" when they get modified and ',(0,i.jsx)(n.strong,{children:"Remains"}),' "1" until somebody Reset it to zero using the ',(0,i.jsx)(n.code,{children:"ResetModified"})," API."]}),"\n",(0,i.jsx)(n.h3,{id:"watch-1",children:"Watch"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["We add a ",(0,i.jsx)(n.code,{children:"ClientSesssion.ResetModified(ref Key key)"})," API.","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["CAS the ",(0,i.jsx)(n.code,{children:"RecordInfo"})," word into the same word, but with the ",(0,i.jsx)(n.strong,{children:"modified bit reset"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["When somebody watches a key in Garnet, we call ",(0,i.jsx)(n.code,{children:"ResetModified"})," API and store that key in ",(0,i.jsx)(n.code,{children:"WatchedKeyContainer"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["At the time of watch, we read a version of that record from the version map and store it alongside the key in ",(0,i.jsx)(n.code,{children:"WatchedKeyContainer"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["At the time of Transaction Execution, we go through all keys in ",(0,i.jsx)(n.code,{children:"WatchedKeyContainer"})," and if their version is still the same, we proceed with the transactions"]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"unwatch",children:"Unwatch:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"When a record gets modified in Tsavorite the modified bit gets set automatically"}),"\n",(0,i.jsxs)(n.li,{children:["When a user calls ",(0,i.jsx)(n.code,{children:"Unwatch"})," API in Garnet we simply just reset the ",(0,i.jsx)(n.code,{children:"WatchedKeyContainer"})]}),"\n",(0,i.jsxs)(n.li,{children:["After every ",(0,i.jsx)(n.code,{children:"DISCARD"}),", ",(0,i.jsx)(n.code,{children:"EXEC"}),", ",(0,i.jsx)(n.code,{children:"UNWATCH"})," command we unwatch everything"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"custom-server-side-transactions",children:"Custom Server-side Transactions"}),"\n",(0,i.jsx)(n.p,{children:"Custom transactions allows adding a new transaction and registering it with Garnet on the server side. This registered transaction can then be invoked from any Garnet client to perform a transaction on the Garnet server."}),"\n",(0,i.jsx)(n.h3,{id:"developing-custom-server-side-transactions",children:"Developing custom server side transactions"}),"\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"CustomTransactionProcedure"})," is the base class for all custom transactions. To develop a new one, this class has to be extended and then include the custom logic.\nThere are two methods to be implemented in the new custom transaction:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"Prepare<TGarnetReadApi>(TGarnetReadApi api, ArgSlice input)"})}),"\n",(0,i.jsx)(n.li,{children:(0,i.jsx)(n.code,{children:"Main<TGarnetApi>(TGarnetApi api, ArgSlice input, ref MemoryResult<byte> output)"})}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"Prepare"})," method implementation must setup the keys that will be involved in the transaction using utility methods available described below. The ",(0,i.jsx)(n.code,{children:"Main"})," method is where the actual operation is to be performed as the locks required for the keys setup in the ",(0,i.jsx)(n.code,{children:"Prepare"})," method are already obtained. The ",(0,i.jsx)(n.code,{children:"Main"})," method then generates the output of the transaction as well."]}),"\n",(0,i.jsx)(n.p,{children:"These are the helper methods for developing custom transactions."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"AddKey(ArgSlice key, LockType type, bool isObject)"})," This method is used to add a specified key to the locking set. It takes three parameters: key (the key to be added), type (the type of lock to be applied), and isObject (a boolean value indicating whether the key represents an object)."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"RewindScratchBuffer(ref ArgSlice slice)"})," This method is responsible for rewinding (popping) the last entry of the scratch buffer if it contains the given ArgSlice. It takes a reference to an ArgSlice parameter and returns a boolean value indicating whether the rewind operation was successful."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"CreateArgSlice(ReadOnlySpan<byte> bytes)"})," This method is used to create an ArgSlice in the scratch buffer from a given ReadOnlySpan<byte>. It takes a ReadOnlySpan<byte> parameter representing the argument and returns an ArgSlice object."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"CreateArgSlice(string str)"})," This method is similar to the previous one, but it creates an ArgSlice in UTF8 format from a given string. It takes a string parameter and returns an ArgSlice object."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"GetNextArg(ArgSlice input, ref int offset)"})," This method is used to retrieve the next argument from the input at the specified offset. It takes an ArgSlice parameter representing the input and a reference to an int offset. It returns an ArgSlice object representing the argument as a span. The method internally reads a pointer with a length header to extract the argument.\nThese member functions provide utility and convenience methods for manipulating and working with the transaction data, scratch buffer, and input arguments within the CustomTransactionProcedure class."]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Registering the custom transaction is done by calling the ",(0,i.jsx)(n.code,{children:"NewTransactionProc(string name, int numParams, Func<CustomTransactionProcedure> proc)"})," method on the Garnet server object's ",(0,i.jsx)(n.code,{children:"RegisterAPI"})," object with its name, number of parameters and a method that returns an instance of the custom transaction class."]}),"\n",(0,i.jsx)(n.h3,{id:"execution-1",children:"Execution"}),"\n",(0,i.jsxs)(n.p,{children:["Custom transactions are executed by the ",(0,i.jsx)(n.code,{children:"RunTransactionProc"})," method in the ",(0,i.jsx)(n.code,{children:"TransactionManager"})," class. This method could be invoked either by calling the ",(0,i.jsx)(n.code,{children:"RUNTXP"})," command with the custom transaction details or by using the custom transaction name used when registering."]}),"\n",(0,i.jsxs)(n.p,{children:["The initial phase is performed by invoking the ",(0,i.jsx)(n.code,{children:"Prepare"})," method of the custom transaction which adds the keys that need to be locked using the ",(0,i.jsx)(n.code,{children:"AddKey"})," method. If the ",(0,i.jsx)(n.code,{children:"Prepare"})," method fails by returning ",(0,i.jsx)(n.strong,{children:"false"}),", the transaction manager's ",(0,i.jsx)(n.code,{children:"Reset(false)"})," is called to reset itself. Otherwise, it proceeds to the next step of invoking the ",(0,i.jsx)(n.code,{children:"Run"})," method of the ",(0,i.jsx)(n.code,{children:"TransactionManager"})," class. See the description above for this method. If the ",(0,i.jsx)(n.code,{children:"Run"})," method fails, the transaction manager is reset too."]}),"\n",(0,i.jsxs)(n.p,{children:["Next step, it proceeds to invoking the custom transaction's ",(0,i.jsx)(n.code,{children:"Main"})," method implementation which performs the core logic of the transaction. On successful completion, it proceeds to log the transaction information. On the other hand, if the ",(0,i.jsx)(n.code,{children:"Main"})," method fails by throwing an exception, ",(0,i.jsx)(n.code,{children:"Reset(true)"})," is called to unlock any locked keys and reset itself."]})]})}function l(e={}){const{wrapper:n}={...(0,s.a)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>o});var i=t(7294);const s={},r=i.createContext(s);function o(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);