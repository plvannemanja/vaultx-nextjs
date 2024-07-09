import * as React from "react"
import { SVGProps } from "react"
const WalletIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={26}
    height={23}
    fill="none"
    {...props}
  >
    <path
      fill="#161616"
      d="M21.125 18.5a4.881 4.881 0 0 1-4.875-4.874 4.881 4.881 0 0 1 4.875-4.875h2.708V6.584a2.169 2.169 0 0 0-2.166-2.167h-1.084V2.251A2.169 2.169 0 0 0 18.417.084H3.25A3.248 3.248 0 0 0 .055 2.791c-.024.09-.055.176-.055.272v16.521a3.254 3.254 0 0 0 3.25 3.25h18.417a2.169 2.169 0 0 0 2.166-2.167v-2.166h-2.708ZM2.167 3.335c0-.597.485-1.083 1.083-1.083h15.167v2.166H3.25a1.084 1.084 0 0 1-1.083-1.083Z"
    />
    <path
      fill="#161616"
      d="M25.313 11H21.25A3.254 3.254 0 0 0 18 14.25a3.254 3.254 0 0 0 3.25 3.25h4.063a.812.812 0 0 0 .812-.813v-4.875a.812.812 0 0 0-.813-.812Zm-4.063 4.333a1.083 1.083 0 1 1 0-2.166 1.083 1.083 0 0 1 0 2.166Z"
    />
    <script />
  </svg>
)
export default WalletIcon
