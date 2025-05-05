import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

import { Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import IDL from "./idl.json";

// Define the program ID for the counter program
const programId_counter = new PublicKey(
  "H5U88wk7D8Qj7KeztdrJJcWqLwAgZLyMVozrigd2D1Ue"
);

/**
 * createProvider method
 * @param wallet 
 * @param connection 
 * @returns 
 */
function createProvider(wallet: AnchorWallet, connection: Connection) {
  // create a new provider
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });
  anchor.setProvider(provider);
  return provider;
}

/**
 * createCounter method
 * @param wallet 
 * @param connection 
 * @returns 
 */
export async function createCounter(
  wallet: AnchorWallet,
  connection: Connection
) {
  const provider = createProvider(wallet, connection);
  // get new program instance
  const program = new Program(IDL, programId_counter, provider);
  // get the counter address
  const [counter] = PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBytes()],
    program.programId
  );
  console.log("counter", counter.toString());

  // createCounter メソッドを呼び出す
  return await program.methods
    .createCounter()
    .accounts({
      authority: wallet.publicKey,
      counter: counter,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();
}

/**
 *fetchCounter method
 * @param wallet 
 * @param connection 
 * @returns 
 */
export async function fetchCounter(
  wallet: AnchorWallet,
  connection: Connection
) {
  // create a new provider
  const provider = createProvider(wallet, connection);
  const program = new Program(IDL, programId_counter, provider);

  const [counter] = PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBytes()],
    program.programId
  );

  // get fetch method
  const counterAccount = await program.account.counter.fetch(counter);
  console.log(
    "Counter account data:",
    (counterAccount as any).count.toNumber()
  );

  return counterAccount as { count: anchor.BN };
}

/**
 * updateCounter method
 * @param wallet 
 * @param connection 
 * @returns 
 */
export async function updateCounter(
  wallet: AnchorWallet,
  connection: Connection
) {
  // create a new provider
  const provider = createProvider(wallet, connection);
  const program = new Program(IDL, programId_counter, provider);

  const [counter] = PublicKey.findProgramAddressSync(
    [wallet.publicKey.toBytes()],
    program.programId
  );

  // call updateCounter method
  const tx = await program.methods
    .updateCounter() // Assuming updateCounter increments by 1
    .accounts({
      counter: counter,
    })
    .rpc();
  console.log("Your transaction signature", tx);

  return tx;
}
