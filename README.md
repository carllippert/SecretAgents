# Secret Agent 🤖

TLDR: Notes + Messaging + AI Agents = The Next Era of Personal Productivity.
-> Local
-> Private
-> Powerful

AI is creating a new paradigm for all of technology.
It's time to start reinventing tools again from their core.

I use Obsidian, a local knowledge base that leverages markdown files every day.
I can't stand having the foundation of my digital system to be in someone else's control.

I also use Telegram and other messaging services a lot to talk with teammates.

I rebuilt these systems with web3 and AI in mind from the core using the best of whats available .

Use the notes section to write and collaborate on documents:

Think of it as a simple version of Obsidian or Roam or Notion today.
All data and saved to web3 storage via Polybase.
Its also saved locally in simple files and a vector db for use with your agents.

Use the messaging section to talk to coworkers or your local AI Agents:

We consider AI Agents and people to be in the same category at the architecture level and treat them the same. Invite them to group chats, have them as a collaborator on docs. Whatever you want.

Design and update your agents:

Agents are not a static thing. They also can do more than write text. They can use tools and leverage internal data. We give you a WYSIWG editor as a base to start extending what agents can do for your business without locking you into someone elses platform.

Everything is always accessible to your agents:

The whole system is built around the idea of data should be yours. It should be local. We don't need servers for this stuff and AI Agents are most useful when they have access to more information about your work.

## Tech Stack

[Tauri](https://tauri.app/) - A framework like Electron ( how VSCode is made ) written in Rust to build local desktop and mobile applications using your favorite web frameworks with a fraction of the resources. It will allow a local AI agents and thousands of locally managed documents on low cost android phones.

[Polybase](https://polybase.xyz/) - Decentralized Supabase. Used to store, encrypt, and share documents between members of an organization. Foundations built on zk, ipfs, and decentralized web primitives.

[Push Protocol](https://push.org/) - Decentralized Messaging. Used to send messages to and from collaborators, requires no signup other than signing with your private key.

[OpenAI GPT](https://platform.openai.com/docs/introduction) - Top Large Language Model AI. Use to integrate "ChatGPT" like intelligence into your software however you like. This was the easy path for getting this project up and running. Next up is using local, open models which are becoming nearly as performant by the day and don't leak your data to places you don't want.

[Langchain JS](https://js.langchain.com/docs/) - Top Opensource framework for working with Large Lange Models ( LLMs ). This helps you take LLM's and tie them together data stores to fetch information and inject it into your prompts.

VectorDB - A database for storing "vectors" which are just numeric representations of strings that make doing things like search easier. This is used to aid and gathering relevant text data to feed the AI System.

Local Filesystem - This is a local app doing local app things. All docs and messages are saved in a simple file system locally, in the spot your computer expects. This means you can continue work offline. Your data is your data and you can leverage normal systems like iCloud to have all your data on all your devices if you prefer. No setup required.

[TailwindCSS](https://tailwindcss.com/) - A styling system for making consistent high quality UI's easily.

[DaisyUI](https://daisyui.com/) - The top component library for making buttons and menus and normal things for TailwindCSS.

[Monaco Editor](https://github.com/suren-atoyan/monaco-react) - Used for the document editing portion of the application. The same editor used by VSCode.

Rust Backend - Tauri is written in Rust and allows you to let rust do the heavy lifting. In the future this will be great for helping improve the applications performance. Also devs love Rust!

[Python Sidecar](https://tauri.app/v1/guides/building/sidecar/) - Tauri has a system for "embedding" any external binary and allowing the Javascript and Rust to talk back and forth with an asynchronous messaging. system. AI, Data Science, ML etc are fields very reliant on the Python language. We added a python sidecar to the application to allow additions to the project to be able to access the broader tool landscape.

- this isn't completely true but the goal was libp2p which can use other transport protocols, and didn't have sufficient time to use a local GPT model so used OpenAI API.

##### Polybase Explorer: https://explorer.testnet.polybase.xyz/studio/pk%2F0x033b12efa243188656bf26eea76a95de67fa192f0e1482f7af816e5ef2131c80f83141ed91235ae6619d587bee9162a0c15a3c310e464ec4556789c1930d1ebe%2Fsecret_agent
