// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// From Libp2p tutorial
// https://docs.rs/libp2p/0.51.3/libp2p/tutorials/ping/index.html
use futures::prelude::*;
use libp2p::swarm::{keep_alive, NetworkBehaviour, Swarm, SwarmEvent};
use libp2p::{identity, ping, Multiaddr, PeerId};
use std::error::Error;
use std::thread;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


fn main(){
   
    tauri::Builder::default()
    .setup(|app| {
        let app_clone = app.clone();
        thread::spawn(move || {
            // Run your asynchronous code here
            async_std::task::block_on(async {
                // Your asynchronous code goes here
                // For example, you can use async-std's `async_main` function:
                async_main().await;
            });
            app_clone.emit("async_code_finished", Some(()));
        });
        Ok(())
         }) 
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

        // OK(()); //also from libp2p
}

// #[async_std::main]
async fn async_main()  -> Result<(), Box<dyn Error>>  {
 // Start libp2p 
 let local_key = identity::Keypair::generate_ed25519();
 let local_peer_id = PeerId::from(local_key.public());
 println!("Local peer id: {local_peer_id:?}");

 let transport = libp2p::development_transport(local_key).await?;

 let behaviour = Behaviour::default();

 let mut swarm = Swarm::with_async_std_executor(transport, behaviour, local_peer_id);

 // Tell the swarm to listen on all interfaces and a random, OS-assigned
 // port.
 swarm.listen_on("/ip4/0.0.0.0/tcp/0".parse()?)?;

 // Dial the peer identified by the multi-address given as the second
 // command-line argument, if any.
 if let Some(addr) = std::env::args().nth(1) {
     let remote: Multiaddr = addr.parse()?;
     swarm.dial(remote)?;
     println!("Dialed {addr}")
 }

 loop {
     match swarm.select_next_some().await {
         SwarmEvent::NewListenAddr { address, .. } => println!("Listening on {address:?}"),
         SwarmEvent::Behaviour(event) => println!("{event:?}"),
         _ => {}
     }
 }
 // end libp2p
    OK(()); //also from libp2p

}
/// Our network behaviour.
///
/// For illustrative purposes, this includes the [`KeepAlive`](behaviour::KeepAlive) behaviour so a continuous sequence of
/// pings can be observed.
#[derive(NetworkBehaviour, Default)]
struct Behaviour {
    keep_alive: keep_alive::Behaviour,
    ping: ping::Behaviour,
}