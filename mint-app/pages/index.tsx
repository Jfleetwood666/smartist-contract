import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, { useContext } from "react";
import { Web3Context } from "../contexts/web3Context";
import { NFTStorage, File, Blob } from "nft.storage";
import useContract from "../hooks/useContract";
import {
  address as smartAddress,
  abi,
} from "../../contract/deployments/rinkeby/SmartistContract.json";
export default function Home() {
  const { address, onboard, provider, network } = useContext(Web3Context);
  console.warn(smartAddress);
  const contract = useContract(smartAddress, abi);
  const storage = new NFTStorage({ token: process.env.STORAGE_API_TOKEN! });
  const onSubmit = async (evt) => {
    evt.preventDefault();
    const data = new FormData(evt.target);
    console.warn(data.get("asset"));
    const metadata = await storage.store({
      name: data.get("name") as string,
      description: data.get("description"),
      image: data.get("asset"),
      // properties: {
      //   custom: 'Custom data can appear here, files are auto uploaded.',
      //   file: new File(['<DATA>'], 'README.md', { type: 'text/plain' }),
      // }
    });

    await contract?.artistMint(metadata.ipnft);

    console.log("IPFS URL for the metadata:", metadata.url);
    console.log("metadata.json contents:\n", metadata.data);
    console.log("metadata.json with IPFS gateway URLs:\n", metadata.embed());
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>mint to your wallet</h1>

        <p className={styles.description}>assets will be pinned on IPFS</p>

        {provider ? (
          <form className={styles.form} onSubmit={onSubmit}>
            <label>
              Name
              <input id="name" name="name" />
            </label>
            <label>
              Description
              <textarea id="description" name="description" />
            </label>

            <label>
              Asset
              <input type="file" id="asset" name="asset" />
            </label>

            <input type="submit" title="Mint" />
          </form>
        ) : (
          <button
            onClick={async () => {
              await onboard?.walletSelect();
              await onboard.walletCheck();
            }}
          >
            Connect Wallet
          </button>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          a 0xEssential joint
          {/* <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span> */}
        </a>
      </footer>
    </div>
  );
}
