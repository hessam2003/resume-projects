import Link from "next/link";

export default function Home() {
  return (
  <h1 className="m-auto text-center border border-solid w-[500px] my-[200px] rounded-[10px] border-[#FFD700] border-3px p-5 text-[30px] text-[#FFD700]-600 hover:text-blue-600"><Link href="./weather">lets go to the weather forecasting page...</Link></h1>
  )
}
